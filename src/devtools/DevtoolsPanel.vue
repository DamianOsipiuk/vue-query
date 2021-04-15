<script lang="ts">
import { matchSorter } from "match-sorter";
import { Query } from "react-query/core";
import { computed, defineComponent, PropType, reactive, Ref, ref } from "vue";

import { getQueryStatusLabel, getQueryStatusColor, sortFns } from "./utils";
import { useTheme } from "./useTheme";
import { useQueryClient } from "../useQueryClient";

import Logo from "./components/Logo.vue";
import ActiveQueryPanel from "./components/ActiveQueryPanel.vue";
import QueryOptions, { Options } from "./components/QueryOptions.vue";
import QueryStates from "./components/QueryStates.vue";

interface PanelProps {
  style?: CSSStyleDeclaration;
  className?: string;
}

export default defineComponent({
  name: "DevtoolsPanel",
  components: { Logo, ActiveQueryPanel, QueryOptions, QueryStates },
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

    const activeQueryHash = ref("");

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

    const activeQuery = computed(() => {
      return queries.value.find(
        (query) => query.queryHash === activeQueryHash.value
      );
    });

    queryCache.subscribe(() => {
      unsortedQueries.value = Object.values(queryCache.getAll());
    });

    const onQueryClick = (query: Query) => {
      activeQueryHash.value =
        activeQueryHash.value === query.queryHash ? "" : query.queryHash;
    };

    const onOptionsChange = (newOptions: Options) => {
      Object.assign(options, newOptions);
    };

    return {
      devtoolsPanelStyles,
      queries,
      activeQuery,
      theme,
      getQueryStatusColor,
      getQueryStatusLabel,
      onQueryClick,
      queryClient,

      onOptionsChange,
    };
  },
});
</script>

<template>
  <div class="VueQueryDevtoolsPanel" :style="devtoolsPanelStyles">
    <div
      :style="{
        flex: '1 1 500px',
        minHeight: '40%',
        maxHeight: '100%',
        overflow: 'auto',
        borderRight: `1px solid ${theme.grayAlt}`,
        display: 'flex',
        flexDirection: 'column',
      }"
    >
      <div
        :style="{
          padding: '.5rem',
          background: theme.backgroundAlt,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
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
      <div
        :style="{
          overflowY: 'auto',
          flex: '1',
        }"
      >
        <div
          v-for="query in queries"
          :key="query.queryHash"
          @click="() => onQueryClick(query)"
          :style="{
            display: 'flex',
            borderBottom: `solid 1px ${theme.grayAlt}`,
            cursor: 'pointer',
            background:
              query === activeQuery ? 'rgba(255,255,255,.1)' : undefined,
          }"
        >
          <div
            :style="{
              flex: '0 0 auto',
              width: '2rem',
              height: '2rem',
              background: getQueryStatusColor(query, theme),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              textShadow:
                getQueryStatusLabel(query) === 'stale' ? '0' : '0 0 10px black',
              color: getQueryStatusLabel(query) === 'stale' ? 'black' : 'white',
            }"
          >
            {{ query.observers.length }}
          </div>
          <code
            class="code"
            :style="{
              padding: '.5rem',
            }"
          >
            {{ query.queryHash }}
          </code>
        </div>
      </div>
    </div>
    <ActiveQueryPanel v-if="activeQuery" :query="activeQuery" />
  </div>
</template>

<style scoped>
.code {
  font-size: 0.9em;
}
</style>
