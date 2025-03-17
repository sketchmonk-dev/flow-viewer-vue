<script setup lang="ts">
import { useFlowContext } from './context';

defineProps<{
    name: string;
}>();

const { getNodeId } = useFlowContext();
</script>
<template>
    <div :data-node-id="getNodeId(name)">
        <slot />
    </div>
</template>