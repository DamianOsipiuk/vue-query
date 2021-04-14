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
    const devtoolsHeight = ref(200);

    const onToggleClick = () => {
      isOpen.value = !isOpen.value;
    };

    return {
      isOpen,
      devtoolsHeight,
      onToggleClick,
    };
  },
});
</script>

<template>
  <div class="VueQueryDevtools">
    <DevtoolsPanel :isOpen="isOpen" :panelProps="panelProps" />
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
