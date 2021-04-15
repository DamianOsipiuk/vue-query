<script lang="ts">
import { matchSorter } from "match-sorter";
import { Query } from "react-query/core";
import { computed, defineComponent, PropType, reactive, Ref, ref } from "vue";

import { sortFns, getQueryState } from "./utils";
import { useTheme } from "./useTheme";
import { useQueryClient } from "../useQueryClient";

import Logo from "./components/Logo.vue";
import ActiveQueryPanel from "./components/ActiveQueryPanel.vue";
import QueryItem from "./components/QueryItem.vue";
import QueryOptions, { Options } from "./components/QueryOptions.vue";
import QueryStates from "./components/QueryStates.vue";

interface PanelProps {
  style?: CSSStyleDeclaration;
  className?: string;
}

export default defineComponent({
  name: "DevtoolsPanel",
  components: { Logo, ActiveQueryPanel, QueryItem, QueryOptions, QueryStates },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    panelProps: {
      type: Object as PropType<PanelProps>,
      default: {},
    },
  },
  setup(props) {
    const theme = useTheme();
    const devToolsHeight = ref(400);

    const options = reactive({
      filter: "",
      sortDesc: false,
      sortFn: sortFns["Status > Last Updated"],
    });

    const devtoolsPanelStyles = computed(() => ({
      display: "flex",
      position: "fixed",
      bottom: "0",
      right: "0",
      background: "#0b1521",
      color: "#fff",
      zIndex: "99999",
      width: "100%",
      height: (devToolsHeight.value ?? 500) + "px",
      maxHeight: "90%",
      boxShadow: "0 0 20px rgba(0,0,0,.3)",
      borderTop: `1px solid ${theme.gray}`,
      transformOrigin: "top",
      ...(props.panelProps.style || {}),
      transition: `all .2s ease`,
      ...(props.isOpen
        ? {
            opacity: 1,
            pointerEvents: "all",
            transform: `translateY(0) scale(1)`,
          }
        : {
            opacity: 0,
            pointerEvents: "none",
            transform: `translateY(15px) scale(1.02)`,
          }),
    }));

    const queryClient = useQueryClient();
    const queryCache = queryClient.getQueryCache();
    queryCache.subscribe(() => {
      unsortedQueries.value = Object.values(queryCache.getAll());
    });

    const unsortedQueries = (ref(
      Object.values(queryCache.findAll())
    ) as unknown) as Ref<Query[]>;

    const queries = computed(() => {
      const sorted = [...unsortedQueries.value].sort(options.sortFn);

      if (options.sortDesc) {
        sorted.reverse();
      }

      if (!options.filter) {
        return sorted;
      }

      return matchSorter(sorted, options.filter, {
        keys: ["queryHash"],
      }).filter((d) => d.queryHash);
    });

    const activeQuery = ref<Query>();

    const selectQuery = (queryHash: string) => {
      if (activeQuery.value?.queryHash === queryHash) {
        activeQuery.value = undefined;
      } else {
        activeQuery.value = queryCache.get(queryHash);
      }
    };

    const onOptionsChange = (newOptions: Options) => {
      Object.assign(options, newOptions);
    };

    return {
      theme,
      devtoolsPanelStyles,
      queries,
      activeQuery,
      getQueryState,

      onOptionsChange,
      selectQuery,
    };
  },
});
</script>

<template>
  <div class="VueQueryDevtoolsPanel" :style="devtoolsPanelStyles">
    <div
      class="query-panel"
      :style="{
        borderRight: `1px solid ${theme.grayAlt}`,
      }"
    >
      <div
        class="query-panel-header"
        :style="{
          background: theme.backgroundAlt,
        }"
      >
        <Logo
          aria-hidden
          :style="{
            marginRight: '.5rem',
          }"
        />
        <div
          :style="{
            display: 'flex',
            flexDirection: 'column',
          }"
        >
          <QueryStates />
          <QueryOptions @optionsChange="onOptionsChange" />
        </div>
      </div>
      <div class="query-list">
        <QueryItem
          v-for="query in queries"
          @selectQuery="selectQuery"
          :key="getQueryState(query) + query.state.dataUpdatedAt"
          :query="query"
          :style="{
            background:
              query === activeQuery ? 'rgba(255,255,255,.1)' : undefined,
          }"
        />
      </div>
    </div>
    <ActiveQueryPanel
      v-if="activeQuery"
      :key="getQueryState(activeQuery) + activeQuery.state.dataUpdatedAt"
      :query="activeQuery"
    />
  </div>
</template>

<style scoped>
.query-panel {
  flex: 1 1 500px;
  min-height: 40%;
  max-height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.query-panel-header {
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.query-list {
  flex: 1;
  overflow-y: auto;
}
</style>
