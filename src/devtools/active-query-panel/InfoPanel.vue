<script lang="ts">
import { defineComponent, h } from "vue-demi";

import { useTheme } from "../useTheme";

export default defineComponent({
  name: "InfoPanel",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup() {
    const theme = useTheme();

    return {
      theme,
    };
  },
  render() {
    // Compatibility between Vue2 and Vue3
    const slot =
      typeof this.$slots.default === "function"
        ? this.$slots.default()
        : this.$slots.default;

    return h("div", [
      h(
        "div",
        {
          class: "info-title",
          style: {
            background: this.theme.backgroundAlt,
          },
        },
        this.$props.title
      ),
      h("div", { class: "info-panel" }, slot),
    ]);
  },
});
</script>

<style>
.info-title {
  padding: 0.5rem;
  position: sticky;
  top: 0;
  z-index: 1;
}

.info-panel {
  padding: 0.5rem;
}
</style>
