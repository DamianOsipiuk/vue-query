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
          class: "title",
          style: {
            background: this.theme.backgroundAlt,
          },
        },
        this.$props.title
      ),
      h("div", { class: "panel" }, slot),
    ]);
  },
});
</script>

<style scoped>
.title {
  padding: 0.5rem;
  position: sticky;
  top: 0;
  z-index: 1;
}

.panel {
  padding: 0.5rem;
}
</style>
