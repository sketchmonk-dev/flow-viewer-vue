<script setup lang="ts">
import { computed } from 'vue';
import { useComputedLabelPosition, useInjectConnectionInfo } from './context';

const props = defineProps<{
    width?: number;
    height?: number;
}>();

const { guides, sourceSide, targetSide } = useInjectConnectionInfo();
const labelPosition = useComputedLabelPosition(guides, sourceSide, targetSide);
const adjustedLabelPosition = computed(() => {
  if (labelPosition.value) {
    const h = props.height ?? 20;
    const w = props.width ?? 140;
    return {
      x: labelPosition.value.x - w / 2,
      y: labelPosition.value.y - h / 2,
    };
  }
  return null;
});

</script>
<template>
<foreignObject
    v-if="adjustedLabelPosition"
    :x="adjustedLabelPosition.x"
    :y="adjustedLabelPosition.y"
    :width="width ?? 140"
    :height="height ?? 20"
>
    <slot />
</foreignObject>
</template>