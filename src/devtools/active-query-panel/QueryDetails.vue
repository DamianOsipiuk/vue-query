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
        h("div", { class: "details-info-line" }, [
          h(
            "code",
            {
              class: "details-code",
            },
            [h("pre", { class: "details-pre" }, this.formattedQueryKey)]
          ),
          h(
            "span",
            {
              class: "details-span",
              style: { background: this.statusBackground },
            },
            this.queryStatusLabel
          ),
        ]),
        h("div", { class: "details-info-line" }, [
          "Observers:",
          h(
            "code",
            {
              class: "details-code",
            },
            this.observersCount
          ),
        ]),
        h("div", { class: "details-info-line" }, [
          "Last Updated:",
          h(
            "code",
            {
              class: "details-code",
            },
            this.updateDate
          ),
        ]),
      ]
    );
  },
});
</script>

<style>
.details-info-line {
  align-items: stretch;
  display: flex;
  justify-content: space-between;
}

.details-info-line:not(:last-of-type) {
  margin-bottom: 0.5rem;
}

.details-code {
  font-size: 0.9em;
  line-height: 1.8rem;
}

.details-pre {
  margin: 0;
  overflow: auto;
  padding: 0;
}

.details-span {
  border-radius: 0.4rem;
  flex-shrink: 0;
  font-weight: bold;
  padding: 0.3rem 0.6rem;
  text-shadow: 0 2px 10px black;
}
</style>
