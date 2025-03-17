import { createInjectionState, useResizeObserver } from "@vueuse/core";
import { type FlowViewerOptions, type GridGuides, p, type SourceSide, type TargetSide } from "../common";
import { computed, inject, type MaybeRefOrGetter, onWatcherCleanup, provide, ref, type Ref, toRef, watch } from "vue";
import { computeGridGuides, generatePathString } from "../utils";

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
        if (el) {
            sourceRect.value = el.getBoundingClientRect();
            const observer = new ResizeObserver(() => {
                sourceRect.value = el.getBoundingClientRect();
            })
            observer.observe(el);
            observer.observe(document.body);
            onWatcherCleanup(() => {
                observer.disconnect();
            });
        }
    }, { immediate: true })

    watch(toRef(target), (t) => {
        const el = getNodeEl(t);
        if (el) {
            targetRect.value = el.getBoundingClientRect();
            const observer = new ResizeObserver(() => {
                targetRect.value = el.getBoundingClientRect();
            })
            observer.observe(el);
            observer.observe(document.body);
            onWatcherCleanup(() => {
                observer.disconnect();
            });
        }
    }, { immediate: true });

    const guides = computed(() => {
        if (!sourceRect.value || !targetRect.value) {
            return null;
        }
        return computeGridGuides(sourceRect.value, targetRect.value, offset.value, margin.value);
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
            return generatePathString(
                guides$.value,
                sourceSide$.value,
                targetSide$.value,
                radius.value,
            )
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
    const guides$ = toRef(guides);
    const sourceSide$ = toRef(sourceSide);
    const targetSide$ = toRef(targetSide);

    return computed(() => {
        if (guides$.value) {
            const ss = sourceSide$.value;
            const ts = targetSide$.value;
            const { t, vc, m } = guides$.value;
            if ((ss === 'left' && ts === 'right') || (ss === 'right' && ts === 'left')) {
                return p(t.hc, vc);
            } else if (ss === 'left' && (ts === 'left' || ts === 'top')) {
                return p(m.l, vc)
            } else if (ss === 'right' && (ts === 'right' || ts === 'top')) {
                return p(m.r, vc)
            } else if (ss === 'bottom' && ts === 'top') {
                return p(t.hc, vc)
            } else if (ss === 'bottom' && ts === 'left') {
                return p(m.l, vc)
            } else if (ss === 'bottom' && ts === 'right') {
                return p(m.r, vc)
            }
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