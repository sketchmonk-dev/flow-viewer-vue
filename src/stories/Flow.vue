<script setup lang="ts">
import { FlowViewerConnection, FlowViewerConnectionLabel, FlowViewerNode, FlowViewerRoot } from '../../lib';
</script>
<template>
    <FlowViewerRoot>
        <div class="flow">
            <FlowViewerNode name="source">
                <div class="node">
                    Source
                </div>
            </FlowViewerNode>
            <FlowViewerNode name="target">
                <div class="node">
                    Target
                </div>
            </FlowViewerNode>
        </div>
        <template #connections>
            <FlowViewerConnection
                source="source"
                target="target"
                sourceSide="bottom"
                targetSide="left"
            >
                <template #path="{ d }">
                    <path :d="d" stroke="black" stroke-width="2" fill="none" />
                </template>
                <FlowViewerConnectionLabel :offset="{ x: 50, y: 0 }">
                    <div class="label">
                        <div class="label__text">
                            Connection Label
                        </div>
                    </div>
                </FlowViewerConnectionLabel>
            </FlowViewerConnection>
        </template>
    </FlowViewerRoot>
</template>
<style lang="css">
.flow {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
    padding: 24px;
    font-family: 'Nunito Sans', sans-serif;
}
.label {
    height: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: 50rem;
    background-color: #fff;
    border: 2px solid #000;
    display: flex;
    align-items: center;
    padding: 0px 12px;
    justify-content: center;
    box-sizing: border-box;
    font-family: 'Nunito Sans', sans-serif;
}
.label__text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.node {
    height: 40px;
    min-width: 200px;
    font-family: 'Nunito Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 600;
    background-color: #f0f0f0;
    border-radius: 8px;
    padding: 4px 12px;
    border: 2px solid #000;
}
</style>