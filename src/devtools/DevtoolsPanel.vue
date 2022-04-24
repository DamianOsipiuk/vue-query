<script lang="ts">
import { matchSorter } from "match-sorter";
import type { Query, QueryCache, QueryClient } from "react-query/core";
import {
  computed,
  defineComponent,
  PropType,
  reactive,
  Ref,
  ref,
  h,
  onScopeDispose,
} from "vue-demi";
import { useQueryClient } from "vue-query";

import { sortFns, getQueryState, makeArrayNonConfigurable } from "./utils";
import { useTheme } from "./useTheme";

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

const getSortedQueries = (queryCache: QueryCache, filterOptions: Options) => {
  const queries = queryCache.getAll();
  // Fix for infinite loop in Vue2.x
  makeArrayNonConfigurable(queries);
  const sorted = [...queries].sort(filterOptions.sortFn);

  if (filterOptions.sortDesc) {
    sorted.reverse();
  }

  if (!filterOptions.filter) {
    return sorted;
  }

  return matchSorter(sorted, filterOptions.filter, {
    keys: ["queryHash"],
  }).filter((d) => d.queryHash);
};

/**
 * @deprecated Vue Query Devtools are now available as a plugin to the official Vue Devtools.
 * Standalone devtools will be removed in v2 of vue-query.
 * Please visit https://vue-query.vercel.app/#/getting-started/devtools for more information.
 */
const DevtoolsPanel = defineComponent({
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
    queryClientKeys: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn(
        `[vue-query] Deprecation warning: Vue Query Devtools are now available as a plugin to the official Vue Devtools.\nStandalone devtools will be removed in v2 of vue-query.\nPlease visit https://vue-query.vercel.app/#/getting-started/devtools for more information.`
      );
    }

    let queryCache: QueryCache;
    let unsubscribe = () => {
      // NOOP
    };

    const defaultClient = useQueryClient();
    const clients = props.queryClientKeys.reduce((map, key) => {
      map[key] = useQueryClient(key);
      return map;
    }, {} as Record<string, QueryClient>);

    const theme = useTheme();

    const devtoolsPanelStyles = computed(() => ({
      backgroundColor: theme.background,
      color: theme.foreground,
    }));

    const options = reactive({
      selectedQueryClientKey: "",
      filter: "",
      sortDesc: false,
      sortFn: sortFns["Status > Last Updated"],
    });
    const onOptionsChange = (newOptions: Options) => {
      if (
        options.selectedQueryClientKey !== newOptions.selectedQueryClientKey
      ) {
        selectQueryClient(newOptions.selectedQueryClientKey);
      }
      Object.assign(options, newOptions);
      queries.value = getSortedQueries(queryCache, options);
    };

    const queries = ref([]) as Ref<Query[]>;

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

    const selectQueryClient = (queryClientKey?: string) => {
      unsubscribe();
      const queryClient = queryClientKey
        ? clients[queryClientKey]
        : defaultClient;
      queryCache = queryClient.getQueryCache();
      queries.value = getSortedQueries(queryCache, options);
      unsubscribe = queryCache.subscribe(() => {
        queries.value = getSortedQueries(queryCache, options);
      });
      activeQuery.value = undefined;
    };

    selectQueryClient();

    onScopeDispose(() => unsubscribe);

    return {
      theme,
      devtoolsPanelStyles,
      queries,
      getQueryState,
      onOptionsChange,
      activeQuery,
      selectQuery,
      handleDragStart,
      options,
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
                    queryClientKeys: this.queryClientKeys,
                    // Vue2
                    on: {
                      optionsChange: this.onOptionsChange,
                    },
                    props: {
                      queryClientKeys: this.queryClientKeys,
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
              selectedQueryClientKey: this.options.selectedQueryClientKey,
              // Vue2
              props: {
                query: this.activeQuery,
                selectedQueryClientKey: this.options.selectedQueryClientKey,
              },
            })
          : undefined,
      ]
    );
  },
});

export default DevtoolsPanel;
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
