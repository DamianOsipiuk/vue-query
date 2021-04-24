<script lang="ts">
import { computed, defineComponent, PropType, h } from "vue-demi";

import Logo from "./Logo.vue";

import { Position } from "../utils";
import type { ButtonProps } from "../types";

export default defineComponent({
  name: "ToggleButton",
  props: {
    position: {
      type: String as PropType<Position>,
      required: true,
    },
    buttonProps: {
      type: Object as PropType<ButtonProps>,
      default: () => ({}),
    },
  },
  emits: ["click"],
  setup(props, context) {
    const onClick = () => {
      context.emit("click");
      props.buttonProps.click?.();
    };

    const position = computed(() => {
      if (props.position === Position.TR) {
        return { top: 0, right: 0 };
      }
      if (props.position === Position.TL) {
        return { top: 0, left: 0 };
      }
      if (props.position === Position.BR) {
        return { bottom: 0, right: 0 };
      }

      return { bottom: 0, left: 0 };
    });

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
      ...position.value,
      ...props.buttonProps.style,
    }));

    return {
      onClick,
      buttonStyles,
    };
  },
  render() {
    return h(
      "button",
      {
        style: this.buttonStyles,
        // Vue3
        type: "button",
        ariaLabel: "Open Vue Query Devtools",
        onClick: this.onClick,
        // Vue2
        attrs: {
          type: "button",
          ariaLabel: "Open Vue Query Devtools",
        },
        on: {
          click: this.onClick,
        },
      },
      [h(Logo)]
    );
  },
});
</script>
