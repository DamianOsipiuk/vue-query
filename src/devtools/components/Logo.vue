<script lang="ts">
import { defineComponent, h } from "vue-demi";

export default defineComponent({
  render() {
    const svgAttrs = {
      xmlns: "http://www.w3.org/2000/svg",
      width: "40",
      height: "40",
      viewBox: "0 0 261.76 226.69",
    };
    const path1Attrs = {
      fill: "#ffd94c",
      stroke: "#002c4b",
      "stroke-width": "32.63",
      d: "M156.77 42.75L126.55 95.1 96.32 42.75h-48.3l78.53 136 78.53-136z",
    };
    const path2Attrs = {
      fill: "none",
      stroke: "#ff4154",
      "stroke-width": "12.43",
      d: "M156.77 42.75L126.55 95.1 96.32 42.75h-48.3l78.53 136 78.53-136z",
    };

    const createPath = (attrs: Record<string, unknown>) =>
      h("path", {
        // Vue3
        ...attrs,
        // Vue2
        attrs,
      });

    return h(
      "svg",
      {
        // Vue3
        ...svgAttrs,
        // Vue2
        attrs: svgAttrs,
      },
      [createPath(path1Attrs), createPath(path2Attrs)]
    );
  },
});
</script>
