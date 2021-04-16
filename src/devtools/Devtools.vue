<script lang="ts">
import { defineComponent, PropType, ref } from "vue";

import DevtoolsPanel from "./DevtoolsPanel.vue";
import CloseButton from "./components/CloseButton.vue";
import ToggleButton from "./components/ToggleButton.vue";
import { Position } from "./utils";

import type { ButtonProps, PanelProps } from "./types";

export default defineComponent({
  name: "VueQueryDevTools",
  components: { CloseButton, DevtoolsPanel, ToggleButton },
  props: {
    initialIsOpen: {
      type: Boolean,
      default: false,
    },
    panelProps: {
      type: Object as PropType<PanelProps>,
      default: {},
    },
    closeButtonProps: {
      type: Object as PropType<ButtonProps>,
      default: {},
    },
    toggleButtonProps: {
      type: Object as PropType<ButtonProps>,
      default: {},
    },
    position: {
      type: String as PropType<Position>,
      default: Position.BL,
    },
    containerElement: {
      type: String,
      default: "footer",
    },
  },
  setup(props) {
    const isOpen = ref(props.initialIsOpen);
    const isResizing = ref(false);
    const devtoolsHeight = ref("500px");
    const panelRef = ref();

    const onToggleClick = () => {
      isOpen.value = !isOpen.value;
    };

    const handleDragStart = (event: MouseEvent) => {
      if (event.button !== 0) return; // Only allow left click for drag

      isResizing.value = true;

      const dragInfo = {
        originalHeight: panelRef.value?.$el.getBoundingClientRect().height,
        pageY: event.pageY,
      };

      const run = (moveEvent: MouseEvent) => {
        const delta = dragInfo.pageY - moveEvent.pageY;
        const newHeight = dragInfo.originalHeight + delta;

        devtoolsHeight.value = newHeight + "px";

        if (newHeight < 100) {
          isOpen.value = false;
        } else {
          isOpen.value = true;
        }
      };

      const unsub = () => {
        isResizing.value = false;
        document.removeEventListener("mousemove", run);
        document.removeEventListener("mouseUp", unsub);
      };

      document.addEventListener("mousemove", run);
      document.addEventListener("mouseup", unsub);
    };

    return {
      isOpen,
      isResizing,
      devtoolsHeight,
      panelRef,
      onToggleClick,
      handleDragStart,
    };
  },
});
</script>

<template>
  <div class="VueQueryDevtools">
    <DevtoolsPanel
      class="devtools-panel"
      ref="panelRef"
      @handleDragStart="handleDragStart"
      :class="{ resizing: isResizing, open: isOpen }"
      :style="{
        height: devtoolsHeight,
      }"
      :isOpen="isOpen"
      :panelProps="panelProps"
    />
    <CloseButton
      v-if="isOpen"
      :position="position"
      :buttonProps="closeButtonProps"
      @click="onToggleClick"
    />
    <ToggleButton
      v-if="!isOpen"
      :position="position"
      :buttonProps="toggleButtonProps"
      @click="onToggleClick"
    />
  </div>
</template>

<style scoped>
.devtools-panel {
  bottom: 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  max-height: 90%;
  opacity: 0;
  pointer-events: none;
  position: fixed;
  right: 0;
  transform-origin: top;
  transform: translateY(15px) scale(1.02);
  transition: all 0.2s ease;
  width: 100%;
  z-index: 99999;
}

.resizing {
  transition: none;
}

.open {
  opacity: 1;
  pointer-events: all;
  transform: translateY(0) scale(1);
}
</style>
