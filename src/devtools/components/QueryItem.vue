<script lang="ts">
import { computed, defineComponent, PropType, h } from "vue-demi";

import type { Query } from "react-query/types/core";

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
    const observerCount = computed<number>(() =>
      props.query.getObserversCount()
    );
    const isStale = computed(
      () => getQueryState(props.query) === QueryState.Stale
    );
    const isDisabled = computed(
      () => observerCount.value > 0 && !props.query.isActive()
    );
    const stateColor = computed(() => getQueryStatusColor(props.query, theme));

    const onQueryClick = () => {
      emit("selectQuery", props.query.queryHash);
    };

    return {
      theme,
      observerCount,
      isStale,
      isDisabled,
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
            class: "query-item-state",
            style: {
              background: this.stateColor,
              textShadow: this.isStale ? "0" : "0 0 10px black",
              color: this.isStale ? "black" : "white",
            },
          },
          this.observerCount
        ),
        this.isDisabled
          ? h(
              "div",
              {
                class: "query-item-disabled-label",
                style: {
                  background: this.theme.gray,
                },
              },
              "disabled"
            )
          : null,
        h(
          "code",
          {
            class: "query-item-code",
          },
          this.$props.query.queryHash
        ),
      ]
    );
  },
});
</script>

<style>
.query-item-state {
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  font-weight: bold;
  height: 2rem;
  justify-content: center;
  width: 2rem;
}

.query-item-disabled-label {
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  font-weight: bold;
  height: 2rem;
  padding: 0 0.5em;
}

.query-item-code {
  font-size: 0.9em;
  padding: 0.5rem;
  color: "inherit";
}
</style>
