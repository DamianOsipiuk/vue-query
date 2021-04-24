<script lang="ts">
import { computed, defineComponent, PropType, h } from "vue-demi";
import type { Query } from "react-query/types";

import { useTheme } from "../useTheme";
import { getQueryState, QueryState, QueryStateLabel } from "../utils";

export default defineComponent({
  name: "QueryStates",
  props: {
    queries: {
      type: Array as PropType<Query[]>,
      required: true,
    },
  },
  setup(props) {
    const theme = useTheme();

    const getQueryStateData = (state: QueryState) => {
      const count = props.queries.filter((q) => getQueryState(q) === state)
        .length;

      return {
        label: QueryStateLabel[state],
        opacity: count ? 1 : 0.3,
        count,
      };
    };

    const fresh = computed(() => getQueryStateData(QueryState.Fresh));
    const fetching = computed(() => getQueryStateData(QueryState.Fetching));
    const stale = computed(() => getQueryStateData(QueryState.Stale));
    const inactive = computed(() => getQueryStateData(QueryState.Inactive));

    return {
      theme,
      fresh,
      fetching,
      stale,
      inactive,
    };
  },
  render() {
    const freshState = h(
      "span",
      {
        class: "query-state",
        style: {
          background: this.theme.success,
          opacity: this.fresh.opacity,
        },
      },
      `${this.fresh.label} ${this.fresh.count}`
    );

    const fetchingState = h(
      "span",
      {
        class: "query-state",
        style: {
          background: this.theme.active,
          opacity: this.fetching.opacity,
        },
      },
      `${this.fetching.label} ${this.fetching.count}`
    );

    const staleState = h(
      "span",
      {
        class: "query-state",
        style: {
          background: this.theme.warning,
          color: "black",
          textShadow: "0",
          opacity: this.stale.opacity,
        },
      },
      `${this.stale.label} ${this.stale.count}`
    );

    const inactiveState = h(
      "span",
      {
        class: "query-state",
        style: {
          background: this.theme.gray,
          opacity: this.inactive.opacity,
        },
      },
      `${this.inactive.label} ${this.inactive.count}`
    );

    return h(
      "div",
      {
        class: "query-states",
      },
      [freshState, fetchingState, staleState, inactiveState]
    );
  },
});
</script>

<style scoped>
.query-states {
  display: flex;
  font-size: 0.9em;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}
.query-state {
  align-items: center;
  border-radius: 0.2em;
  display: inline-flex;
  font-weight: bold;
  margin-left: 5px;
  padding: 0.2em 0.4em;
  text-shadow: 0 0 10px black;
}
</style>
