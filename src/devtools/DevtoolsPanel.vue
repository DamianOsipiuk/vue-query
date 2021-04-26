<script lang="ts">
import { matchSorter } from "match-sorter";
import type { Query } from "react-query/core";
import {
  computed,
  defineComponent,
  PropType,
  reactive,
  Ref,
  ref,
  h,
} from "vue-demi";

import { sortFns, getQueryState } from "./utils";
import { useTheme } from "./useTheme";
import { useQueryClient } from "../useQueryClient";

import Logo from "./components/Logo.vue";
import ActiveQueryPanel from "./active-query-panel/ActiveQueryPanel.vue";
import QueryItem from "./components/QueryItem.vue";
import QueryOptions from "./components/QueryOptions.vue";
import QueryStates from "./components/QueryStates.vue";
import type { Options } from "./types";

interface PanelProps {
  style?: CSSStyleDeclaration;
  className?: string;
}

export default defineComponent({
  name: "DevtoolsPanel",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    panelProps: {
      type: Object as PropType<PanelProps>,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const theme = useTheme();

    const devtoolsPanelStyles = computed(() => ({
      backgroundColor: theme.background,
      color: theme.foreground,
    }));

    const options = reactive({
      filter: "",
      sortDesc: false,
      sortFn: sortFns["Status > Last Updated"],
    });
    const onOptionsChange = (newOptions: Options) => {
      Object.assign(options, newOptions);
      queries.value = getSortedQueries();
    };

    const queries: Ref<Query[]> = ref([]);
    const getSortedQueries = () => {
      const queries = queryCache.getAll();
      const sorted = [...queries].sort(options.sortFn);

      if (options.sortDesc) {
        sorted.reverse();
      }

      if (!options.filter) {
        return sorted;
      }

      return matchSorter(sorted, options.filter, {
        keys: ["queryHash"],
      }).filter((d) => d.queryHash);
    };
    const queryClient = useQueryClient();
    const queryCache = queryClient.getQueryCache();
    queryCache.subscribe(() => {
      queries.value = getSortedQueries();
    });

    const activeQuery = ref<Query>();
    const selectQuery = (queryHash: string) => {
      if (activeQuery.value?.queryHash === queryHash) {
        activeQuery.value = undefined;
      } else {
        activeQuery.value = queryCache.get(queryHash);
      }
    };

    const handleDragStart = (event: MouseEvent) => {
      emit("handleDragStart", event);
    };

    return {
      theme,
      devtoolsPanelStyles,
      queries,
      getQueryState,
      onOptionsChange,
      activeQuery,
      selectQuery,
      handleDragStart,
    };
  },
  render() {
    const queryList = this.queries.map((query, index) => {
      return h(QueryItem, {
        key: getQueryState(query) + query.state.dataUpdatedAt + index,
        style: {
          background:
            query === this.activeQuery ? "rgba(255,255,255,.1)" : undefined,
        },
        // Vue3
        query: query,
        onSelectQuery: this.selectQuery,
        // Vue2
        props: {
          query: query,
        },
        on: {
          selectQuery: this.selectQuery,
        },
      });
    });

    return h(
      "div",
      {
        class: "VueQueryDevtoolsPanel",
        style: this.devtoolsPanelStyles,
      },
      [
        h("div", {
          class: "resize-bar",
          // Vue3
          onMousedown: this.handleDragStart,
          // Vue2
          on: {
            mousedown: this.handleDragStart,
          },
        }),
        h(
          "div",
          {
            class: "query-panel",
            style: {
              borderRight: `1px solid ${this.theme.grayAlt}`,
            },
          },
          [
            h(
              "div",
              {
                class: "query-panel-header",
                style: {
                  background: this.theme.backgroundAlt,
                },
              },
              [
                h(Logo, {
                  ariaHidden: true,
                  style: { marginRight: ".5rem" },
                }),
                h("div", { class: "vertical-list" }, [
                  h(QueryStates, {
                    // Vue3
                    queries: this.queries,
                    // Vue2
                    props: {
                      queries: this.queries,
                    },
                  }),
                  h(QueryOptions, {
                    // Vue3
                    onOptionsChange: this.onOptionsChange,
                    // Vue2
                    on: {
                      optionsChange: this.onOptionsChange,
                    },
                  }),
                ]),
              ]
            ),
            h("div", { class: "query-list" }, queryList),
          ]
        ),
        this.activeQuery
          ? h(ActiveQueryPanel, {
              key:
                getQueryState(this.activeQuery) +
                this.activeQuery.state.dataUpdatedAt,
              // Vue3
              query: this.activeQuery,
              // Vue2
              props: {
                query: this.activeQuery,
              },
            })
          : undefined,
      ]
    );
  },
});
</script>

<style>
.VueQueryDevtoolsPanel {
  display: flex;
  font-family: sans-serif;
  font-size: clamp(12px, 1.5vw, 14px);
}

@media (max-width: 1000px) {
  .VueQueryDevtoolsPanel {
    flex-direction: column;
  }
}

@media (max-width: 600px) {
  .VueQueryDevtoolsPanel {
    font-size: 0.9rem;
  }
}

.resize-bar {
  cursor: row-resize;
  height: 4px;
  left: 0;
  margin-bottom: -4px;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 100000;
}

.vertical-list {
  display: flex;
  flex-direction: column;
}

.query-panel {
  display: flex;
  flex-direction: column;
  flex: 1 1 500px;
  max-height: 100%;
  min-height: 40%;
  overflow: auto;
}

.query-panel-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
}

.query-list {
  flex: 1;
  overflow-y: auto;
}
</style>
