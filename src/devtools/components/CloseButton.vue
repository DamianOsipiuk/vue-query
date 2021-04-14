<script lang="ts">
import { computed, defineComponent, PropType } from "vue";

import { Position } from "../utils";
import type { ButtonProps } from "../types";

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

    const position = computed(() => {
      if (props.position === Position.TR || props.position === Position.BR) {
        return { right: 0 };
      } else {
        return { left: 0 };
      }
    });

    const buttonStyles = computed(() => ({
      position: "fixed",
      zIndex: "99999",
      margin: ".5rem",
      bottom: 0,
      ...position.value,
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
