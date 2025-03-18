## Flow Viewer Component

`@sketchmonk/flow-viewer-vue` is a headless library for drawing workflow flow diagrams in Vue. It provides a set of components to create and manage nodes and connections in a flow diagram.

### Components

- **FlowViewerRoot**: The root component used to create the canvas.
- **FlowViewerNode**: A node in the workflow.
- **FlowViewerConnection**: A connection from one node to the next.
- **FlowViewerConnectionLabel**: Used inside a FlowViewerConnection to add a label to the connection path.

### Component APIs

### FlowViewerRoot.vue

| Prop           | Type     | Description                                | Default |
| -------------- | -------- | ------------------------------------------ | ------- |
| `margin`       | `number` | The margin around the flow viewer.         | 12      |
| `cornerRadius` | `number` | The corner radius for the flow viewer.     | 8       |
| `idPrefix`     | `string` | The prefix for IDs within the flow viewer. | 'flow'  |

### FlowViewerNode.vue

| Prop   | Type     | Description                                                      | Default |
| ------ | -------- | ---------------------------------------------------------------- | ------- |
| `name` | `string` | The name of the node. This is used to generate a unique node ID. | -       |

### FlowViewerConnection.vue

| Prop         | Type         | Description                                              | Default |
| ------------ | ------------ | -------------------------------------------------------- | ------- |
| `source`     | `string`     | The ID of the source node.                               | -       |
| `target`     | `string`     | The ID of the target node.                               | -       |
| `sourceSide` | `SourceSide` | The side of the source node where the connection starts. | -       |
| `targetSide` | `TargetSide` | The side of the target node where the connection ends.   | -       |

### FlowViewerConnectionLabel.vue

| Prop     | Type     | Description                       | Default          |
| -------- | -------- | --------------------------------- | ---------------- |
| `width`  | `number` | The width of the label.           | 140              |
| `height` | `number` | The height of the label.          | 20               |
| `offset` | `Point`  | The offset position of the label. | `{ x: 0, y: 0 }` |

### Sample Usage

Below is a sample usage of the library:

```vue
<script setup lang="ts">
import { FlowViewerConnection, FlowViewerConnectionLabel, FlowViewerNode, FlowViewerRoot } from '@sketchmonk/flow-viewer-vue';
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
        sourceSide="right"
        targetSide="left"
      >
        <template #path="{ d }">
          <path :d="d" stroke="black" stroke-width="2" fill="none" />
        </template>
        <FlowViewerConnectionLabel>
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
```

### Installation

```bash
npm install @sketchmonk/flow-viewer-vue
```

### Usage

Import the components you need from the library and use them in your Vue components as shown in the sample usage above.

For more details, refer to the documentation.