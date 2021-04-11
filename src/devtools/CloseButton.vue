<script lang="ts">
import { computed, defineComponent, PropType } from "vue";

import { Position } from "./utils";
import type { ButtonProps } from "./types";

export default defineComponent({
  name: "CloseButton",
  props: {
    position: {
      type: String,
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
      position: "fixed",
      zIndex: "99999",
      margin: ".5rem",
      bottom: 0,
      ...(props.position === Position.TR
        ? {
            right: "0",
          }
        : props.position === Position.TL
        ? {
            left: "0",
          }
        : props.position === Position.BR
        ? {
            right: "0",
          }
        : {
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
  <button type="button" @click="onClick" :style="buttonStyles">Close</button>
</template>
