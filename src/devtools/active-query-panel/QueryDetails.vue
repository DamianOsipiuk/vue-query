<script lang="ts">
import { computed, defineComponent, PropType, h } from "vue-demi";

import type { Query } from "react-query/types";

import InfoPanel from "./InfoPanel.vue";

import { useTheme } from "../useTheme";
import { getQueryStatusColor, getQueryStatusLabel } from "../utils";

export default defineComponent({
  name: "QueryDetails",
  props: {
    query: {
      type: Object as PropType<Query>,
      required: true,
    },
  },
  setup(props) {
    const theme = useTheme();

    const formattedQueryKey = computed(() => props.query.queryHash);
    const queryStatusLabel = computed(() => getQueryStatusLabel(props.query));
    // @ts-expect-error Accessing private property
    const observersCount = computed(() => props.query.observers.length);
    const updateDate = computed(() =>
      new Date(props.query.state.dataUpdatedAt).toLocaleTimeString()
    );
    const statusBackground = computed(() =>
      getQueryStatusColor(props.query, theme)
    );

    return {
      formattedQueryKey,
      queryStatusLabel,
      observersCount,
      updateDate,
      statusBackground,
    };
  },
  render() {
    return h(
      InfoPanel,
      {
        // Vue3
        title: "Query Details",
        // Vue2
        attrs: {
          title: "Query Details",
        },
      },
      [
        h("div", { class: "info-line" }, [
          h("code", [h("pre", this.formattedQueryKey)]),
          h(
            "span",
            { style: { background: this.statusBackground } },
            this.queryStatusLabel
          ),
        ]),
        h("div", { class: "info-line" }, [
          "Observers:",
          h("code", this.observersCount),
        ]),
        h("div", { class: "info-line" }, [
          "Last Updated:",
          h("code", this.updateDate),
        ]),
      ]
    );
  },
});
</script>

<style scoped>
.info-line {
  align-items: stretch;
  display: flex;
  justify-content: space-between;
}

.info-line:not(:last-of-type) {
  margin-bottom: 0.5rem;
}

code {
  font-size: 0.9em;
  line-height: 1.8rem;
}

pre {
  margin: 0;
  overflow: auto;
  padding: 0;
}

span {
  border-radius: 0.4rem;
  flex-shrink: 0;
  font-weight: bold;
  padding: 0.3rem 0.6rem;
  text-shadow: 0 2px 10px black;
}
</style>
