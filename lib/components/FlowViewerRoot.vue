<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { FlowViewerOptions } from '../common';
import { useProvideFlowContext } from './context';

const props = withDefaults(
    defineProps<Partial<FlowViewerOptions>>(),
    {
        margin: 12,
        cornerRadius: 8,
        idPrefix: 'flow'
    }
);

const root = ref<HTMLElement | null>(null);
const { size } = useProvideFlowContext({
    root,
    options: props,
});

const shouldMountConnections = ref(false);
onMounted(() => {
    shouldMountConnections.value = true;
})
</script>
<template>
    <div :style="{ position: 'relative'}" ref="root">
        <svg
            :view-box="`0 0 ${size.width} ${size.height}`"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;" 
            v-if="shouldMountConnections">
            <slot name="connections" />
        </svg>
        <div style="position: relative; z-index: 1;">
            <slot />
        </div>
    </div>
</template>