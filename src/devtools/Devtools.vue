<script lang="ts">
import { defineComponent, PropType, ref, h } from "vue-demi";

import DevtoolsPanel from "./DevtoolsPanel.vue";
import CloseButton from "./components/CloseButton.vue";
import ToggleButton from "./components/ToggleButton.vue";
import { Position } from "./utils";

import type { ButtonProps, PanelProps } from "./types";

export default defineComponent({
  name: "VueQueryDevTools",
  props: {
    initialIsOpen: {
      type: Boolean,
      default: false,
    },
    panelProps: {
      type: Object as PropType<PanelProps>,
      default: () => ({}),
    },
    closeButtonProps: {
      type: Object as PropType<ButtonProps>,
      default: () => ({}),
    },
    toggleButtonProps: {
      type: Object as PropType<ButtonProps>,
      default: () => ({}),
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
  render() {
    const devtoolsPanel = h(DevtoolsPanel, {
      class: {
        "devtools-panel": true,
        "devtools-resizing": this.isResizing,
        "devtools-open": this.isOpen,
      },
      style: {
        height: this.devtoolsHeight,
      },
      ref: "panelRef",
      // Vue3
      isOpen: this.isOpen,
      panelProps: this.panelProps as never,
      onHandleDragStart: this.handleDragStart,
      // Vue2
      props: {
        isOpen: this.isOpen,
        panelProps: this.panelProps,
      },
      on: {
        handleDragStart: this.handleDragStart,
      },
    });

    const closeButton = h(CloseButton, {
      // Vue3
      position: this.position,
      buttonProps: this.closeButtonProps,
      onClick: this.onToggleClick,
      // Vue2
      props: {
        position: this.position,
        buttonProps: this.closeButtonProps,
      },
      on: {
        click: this.onToggleClick,
      },
    });

    const toggleButton = h(ToggleButton, {
      // Vue3
      position: this.position,
      buttonProps: this.toggleButtonProps,
      onClick: this.onToggleClick,
      // Vue2
      props: {
        position: this.position,
        buttonProps: this.toggleButtonProps,
      },
      on: {
        click: this.onToggleClick,
      },
    });

    return h("div", { class: "VueQueryDevtools" }, [
      devtoolsPanel,
      this.isOpen ? closeButton : toggleButton,
    ]);
  },
});
</script>

<style>
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

.devtools-resizing {
  transition: none;
}

.devtools-open {
  opacity: 1;
  pointer-events: all;
  transform: translateY(0) scale(1);
}
</style>
