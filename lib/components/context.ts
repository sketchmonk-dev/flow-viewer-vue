import { createInjectionState, useResizeObserver } from "@vueuse/core";
import { type FlowViewerOptions, type GridGuides, p, type Point, type SourceSide, type TargetSide } from "../common";
import { computed, inject, type MaybeRefOrGetter, onWatcherCleanup, provide, ref, type Ref, toRef, watch } from "vue";
import { computeGridGuides, generatePathString } from "../utils";
import { Logger } from '../logger';

const logger = new Logger('context.ts');

interface FlowViewerState {
    root: Ref<HTMLElement | null>;
    options: FlowViewerOptions;
}

export const [useProvideFlowContext, useInjectFlowContext] = createInjectionState(
    (state: FlowViewerState) => {
        // helper methods
        const getNodeId = (name: string) => {
            return `${state.options.idPrefix}__node-${name}`
        }
        const getNodeEl = (name: string) => {
            return state.root.value?.querySelector(`[data-node-id=${getNodeId(name)}]`) ?? null;
        }

        // compute offset
        const offset = ref({ x: 0, y: 0 });
        const size = ref({ width: 0, height: 0 });
        useResizeObserver([state.root, document.body], () => {
            if (state.options.debug) {
                logger.debug('resize observer on root called: updating size & offset', state.root.value);
            }
            const entry = state.root.value;
            if (entry) {
                const rect = entry.getBoundingClientRect();
                size.value.width = rect.width;
                size.value.height = rect.height;
                offset.value.x = rect.left;
                offset.value.y = rect.top;
            }
        });

        return {
            root: state.root,
            options: state.options,
            getNodeId,
            getNodeEl,
            offset,
            size,
        }
    }
);

export function useFlowContext() {
    const context = useInjectFlowContext();
    if (!context) {
        throw new Error('no flow context provided');
    }
    return context;
}

export function useGridGuides(
    source: MaybeRefOrGetter<string>,
    target: MaybeRefOrGetter<string>,
) {
    const { getNodeEl, offset, options } = useFlowContext();

    const sourceRect = ref<DOMRect | null>(null);
    const targetRect = ref<DOMRect | null>(null);

    const margin = computed(() => options.margin);

    watch(toRef(source), (s) => {
        const el = getNodeEl(s);
        if (options.debug) {
            logger.debug(`useGridGuides: watcher on source called: ${s}`, el);
        }
        if (el) {
            sourceRect.value = el.getBoundingClientRect();
            const observer = new ResizeObserver(() => {
                sourceRect.value = el.getBoundingClientRect();
                if (options.debug) {
                    logger.debug('useGridGuides: sourceRect updated', sourceRect.value);
                }
            })
            observer.observe(el);
            observer.observe(document.body);
            onWatcherCleanup(() => {
                logger.info('useGridGuides: cleanup source watcher');
                observer.disconnect();
            });
        }
    }, { immediate: true })

    watch(toRef(target), (t) => {
        const el = getNodeEl(t);
        if (options.debug) {
            logger.debug(`useGridGuides: watcher on target called: ${t}`, el);
        }
        if (el) {
            targetRect.value = el.getBoundingClientRect();
            const observer = new ResizeObserver(() => {
                targetRect.value = el.getBoundingClientRect();
                if (options.debug) {
                    logger.debug('useGridGuides: targetRect updated', targetRect.value);
                }
            })
            observer.observe(el);
            observer.observe(document.body);
            onWatcherCleanup(() => {
                logger.info('useGridGuides: cleanup target watcher');
                observer.disconnect();
            });
        }
    }, { immediate: true });

    const guides = computed(() => {
        if (!sourceRect.value || !targetRect.value) {
            return null;
        }
        const g = computeGridGuides(sourceRect.value, targetRect.value, offset.value, margin.value);
        if (options.debug) {
            logger.debug('useGridGuides: computed guides', g);
        }
        return g;
    });

    return guides;
}

export function useComputedConnectionPathString(
    guides: MaybeRefOrGetter<GridGuides|null>,
    sourceSide: MaybeRefOrGetter<SourceSide>,
    targetSide: MaybeRefOrGetter<TargetSide>,
) {

    const { options } = useFlowContext();
    const radius = computed(() => options.cornerRadius);

    const guides$ = toRef(guides);
    const sourceSide$ = toRef(sourceSide);
    const targetSide$ = toRef(targetSide);
    const path = computed(() => {
        if (guides$.value) {
            const p = generatePathString(
                guides$.value,
                sourceSide$.value,
                targetSide$.value,
                radius.value,
            )
            if (options.debug) {
                logger.debug('useComputedConnectionPathString: computed path', p);
            }
            return p;
        }
        return null;
    });

    return path;
}

export function useComputedLabelPosition(
    guides: MaybeRefOrGetter<GridGuides|null>,
    sourceSide: MaybeRefOrGetter<SourceSide>,
    targetSide: MaybeRefOrGetter<TargetSide>,
) {
    const { options } = useFlowContext();
    const guides$ = toRef(guides);
    const sourceSide$ = toRef(sourceSide);
    const targetSide$ = toRef(targetSide);

    return computed(() => {
        if (guides$.value) {
            const ss = sourceSide$.value;
            const ts = targetSide$.value;
            const { t, vc, m } = guides$.value;
            let lp: Point | null = null;
            if ((ss === 'left' && ts === 'right') || (ss === 'right' && ts === 'left')) {
                lp = p(t.hc, vc);
            } else if (ss === 'left' && (ts === 'left' || ts === 'top')) {
                lp = p(m.l, vc)
            } else if (ss === 'right' && (ts === 'right' || ts === 'top')) {
                lp = p(m.r, vc)
            } else if (ss === 'bottom' && ts === 'top') {
                lp = p(t.hc, vc)
            } else if (ss === 'bottom' && ts === 'left') {
                lp = p(m.l, vc)
            } else if (ss === 'bottom' && ts === 'right') {
                lp = p(m.r, vc)
            }
            if (options.debug) {
                logger.debug('useComputedLabelPosition: computed label position', lp);
            }
            return lp;
        }
        return null;
    })
}

// providing connection info
export interface ConnectionInfo {
    source: Ref<string>;
    target: Ref<string>;
    sourceSide: Ref<SourceSide>;
    targetSide: Ref<TargetSide>;
    guides: Ref<GridGuides | null>;
}

export const CONNECTION_INFO_INJECTION_KEY = Symbol('CONNECTION_INFO');
export function useProvideConnectionInfo(info: ConnectionInfo) {
    provide(CONNECTION_INFO_INJECTION_KEY, info);
}
export function useInjectConnectionInfo() {
    const info = inject<ConnectionInfo>(CONNECTION_INFO_INJECTION_KEY);
    if (!info) {
        throw new Error('no connection info provided');
    }
    return info;
}