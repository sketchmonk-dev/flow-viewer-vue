<script setup lang="ts">
import { computed } from "vue";
import type { SourceSide, TargetSide } from "../common";
import {
    useComputedConnectionPathString,
    useGridGuides,
    useProvideConnectionInfo
} from "./context";

type Props = {
  source: string;
  target: string;
  sourceSide: SourceSide;
  targetSide: TargetSide;
};

const props = defineProps<Props>();

const source = computed(() => props.source);
const target = computed(() => props.target);
const sourceSide = computed(() => props.sourceSide);
const targetSide = computed(() => props.targetSide);

const guides = useGridGuides(source, target);
const connection = useComputedConnectionPathString(
  guides,
  sourceSide,
  targetSide
);

useProvideConnectionInfo({
    source,
    target,
    sourceSide,
    targetSide,
    guides,
})
</script>
<template>
  <g>
    <slot v-if="connection" name="path" :d="connection">
      <path :d="connection" stroke="2" stroke-color="black" />
    </slot>
    <slot />
  </g>
</template>
