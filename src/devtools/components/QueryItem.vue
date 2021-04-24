<script lang="ts">
import { computed, defineComponent, PropType, h } from "vue-demi";

import type { Query } from "react-query/types";

import { useTheme } from "../useTheme";
import { getQueryState, getQueryStatusColor, QueryState } from "../utils";

export default defineComponent({
  name: "QueryItem",
  props: {
    query: {
      type: Object as PropType<Query>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const theme = useTheme();
    // @ts-expect-error Accessing private property
    const observerCount = computed<number>(() => props.query.observers.length);
    const isStale = computed(
      () => getQueryState(props.query) === QueryState.Stale
    );
    const stateColor = computed(() => getQueryStatusColor(props.query, theme));

    const onQueryClick = () => {
      emit("selectQuery", props.query.queryHash);
    };

    return {
      theme,
      observerCount,
      isStale,
      stateColor,
      onQueryClick,
    };
  },
  render() {
    return h(
      "div",
      {
        style: {
          display: "flex",
          borderBottom: `solid 1px ${this.theme.grayAlt}`,
          cursor: "pointer",
        },
        // Vue3
        onClick: this.onQueryClick,
        // Vue2
        on: {
          click: this.onQueryClick,
        },
      },
      [
        h(
          "div",
          {
            class: "query-state",
            style: {
              background: this.stateColor,
              textShadow: this.isStale ? "0" : "0 0 10px black",
              color: this.isStale ? "black" : "white",
            },
          },
          this.observerCount
        ),
        h("code", this.$props.query.queryHash),
      ]
    );
  },
});
</script>

<style scoped>
.query-state {
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  font-weight: bold;
  height: 2rem;
  justify-content: center;
  width: 2rem;
}

code {
  font-size: 0.9em;
  padding: 0.5rem;
}
</style>
