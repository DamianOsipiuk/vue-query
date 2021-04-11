<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import Logo from "./Logo.vue";

import { Position } from "./utils";
import type { ButtonProps } from "./types";

export default defineComponent({
  name: "ToggleButton",
  components: { Logo },
  props: {
    position: {
      type: String as PropType<Position>,
      required: true,
    },
    buttonProps: {
      type: Object as PropType<ButtonProps>,
      default: {},
    },
  },
  emits: ["click"],
  setup(props, context) {
    const onClick = () => {
      context.emit("click");
      props.buttonProps.click?.();
    };

    const buttonStyles = computed(() => ({
      background: "none",
      border: 0,
      padding: 0,
      position: "fixed",
      zIndex: "99999",
      display: "inline-flex",
      fontSize: "1.5rem",
      margin: ".5rem",
      cursor: "pointer",
      width: "fit-content",
      ...(props.position === Position.TR
        ? {
            top: "0",
            right: "0",
          }
        : props.position === Position.TL
        ? {
            top: "0",
            left: "0",
          }
        : props.position === Position.BR
        ? {
            bottom: "0",
            right: "0",
          }
        : {
            bottom: "0",
            left: "0",
          }),
      ...props.buttonProps.style,
    }));

    return {
      onClick,
      buttonStyles,
    };
  },
});
</script>

<template>
  <button
    type="button"
    aria-label="Open Vue Query Devtools"
    @click="onClick"
    :style="buttonStyles"
  >
    <logo />
  </button>
</template>
