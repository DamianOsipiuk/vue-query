<script lang="ts">
import { matchSorter } from "match-sorter";
import { Query } from "react-query/core";
import {
  computed,
  ComputedRef,
  defineComponent,
  PropType,
  Ref,
  ref,
} from "vue";

import {
  getQueryStatusLabel,
  getQueryStatusColor,
  SortFn,
  sortFns,
} from "./utils";
import { useTheme } from "./useTheme";
import { useQueryClient } from "../useQueryClient";

import Logo from "./components/Logo.vue";
import ActiveQueryPanel from "./components/ActiveQueryPanel.vue";

interface PanelProps {
  style?: CSSStyleDeclaration;
  className?: string;
}

export default defineComponent({
  name: "DevtoolsPanel",
  components: { Logo, ActiveQueryPanel },
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
    const sort = ref(Object.keys(sortFns)[0]);
    const filter = ref("");
    const sortDesc = ref(false);
    const activeQueryHash = ref("");

    const sortFn: ComputedRef<SortFn> = computed(() => sortFns[sort.value]);

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
      const sorted = [...unsortedQueries.value].sort(sortFn.value);

      if (sortDesc.value) {
        sorted.reverse();
      }

      if (!filter.value) {
        return sorted;
      }

      return matchSorter(sorted, filter.value, { keys: ["queryHash"] }).filter(
        (d) => d.queryHash
      );
    });

    const activeQuery = computed(() => {
      return queries.value.find(
        (query) => query.queryHash === activeQueryHash.value
      );
    });

    const hasFresh = computed(() => {
      return queries.value.filter((q) => getQueryStatusLabel(q) === "fresh")
        .length;
    });
    const hasFetching = computed(() => {
      return queries.value.filter((q) => getQueryStatusLabel(q) === "fetching")
        .length;
    });
    const hasStale = computed(() => {
      return queries.value.filter((q) => getQueryStatusLabel(q) === "stale")
        .length;
    });
    const hasInactive = computed(() => {
      return queries.value.filter((q) => getQueryStatusLabel(q) === "inactive")
        .length;
    });

    queryCache.subscribe(() => {
      unsortedQueries.value = Object.values(queryCache.getAll());
    });

    const onChange = (event: KeyboardEvent) => {
      // @ts-expect-error Fixme
      filter.value = event.target?.value;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        filter.value = "";
      }
    };

    const onSortChange = (event: Event) => {
      // @ts-expect-error Fixme
      sort.value = event.target?.value;
    };

    const onSortDescChange = () => {
      sortDesc.value = !sortDesc.value;
    };

    const onQueryClick = (query: Query) => {
      activeQueryHash.value =
        activeQueryHash.value === query.queryHash ? "" : query.queryHash;
    };

    return {
      devtoolsPanelStyles,
      queries,
      activeQuery,
      filter,
      sort,
      sortFns,
      sortDesc,
      hasFresh,
      hasFetching,
      hasStale,
      hasInactive,
      theme,
      getQueryStatusColor,
      getQueryStatusLabel,
      onChange,
      onKeyDown,
      onSortChange,
      onSortDescChange,
      onQueryClick,
      queryClient,
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
          <span class="query-keys">
            <span
              class="query-key"
              :style="{
                background: theme.success,
                opacity: hasFresh ? 1 : 0.3,
              }"
            >
              fresh <code class="code">{{ hasFresh }}</code>
            </span>
            <span
              class="query-key"
              :style="{
                background: theme.active,
                opacity: hasFetching ? 1 : 0.3,
              }"
            >
              fetching
              <code class="code">{{ hasFetching }}</code>
            </span>
            <span
              class="query-key"
              :style="{
                background: theme.warning,
                color: 'black',
                textShadow: '0',
                opacity: hasStale ? 1 : 0.3,
              }"
            >
              stale <code class="code">{{ hasStale }}</code>
            </span>
            <span
              class="query-key"
              :style="{
                background: theme.gray,
                opacity: hasInactive ? 1 : 0.3,
              }"
            >
              inactive
              <code class="code">{{ hasInactive }}</code>
            </span>
          </span>
          <div
            :style="{
              display: 'flex',
              alignItems: 'center',
            }"
          >
            <input
              class="input"
              placeholder="Filter"
              :value="filter ?? ''"
              @input="onChange"
              @keydown="onKeyDown"
              :style="{
                flex: '1',
                marginRight: '.5rem',
                backgroundColor: theme.inputBackgroundColor,
                color: theme.inputTextColor,
              }"
            />
            <div>
              <select
                class="select"
                v-if="!filter"
                :value="sort"
                @change="onSortChange"
                :style="{
                  flex: '1',
                  minWidth: 75,
                  marginRight: '.5rem',
                  backgroundColor: theme.inputBackgroundColor,
                  color: theme.inputTextColor,
                }"
              >
                <option
                  v-for="key in Object.keys(sortFns)"
                  :key="key"
                  :value="key"
                >
                  Sort by {{ key }}
                </option>
              </select>
              <button
                class="button"
                type="button"
                @click="onSortDescChange"
                :style="{
                  padding: '.3rem .4rem',
                  background: theme.gray,
                }"
              >
                {{ sortDesc ? "⬇ Desc" : "⬆ Asc" }}
              </button>
            </div>
          </div>
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
.query-keys {
  display: inline-block;
  font-size: 0.9em;
  margin-bottom: 0.5rem;
}
.query-keys .query-key {
  margin-left: 5px;
}
.query-key {
  display: inline-flex;
  align-items: center;
  padding: 0.2em 0.4em;
  font-weight: bold;
  text-shadow: 0 0 10px black;
  border-radius: 0.2em;
}
.query-key .code {
  padding-left: 5px;
}
.code {
  font-size: 0.9em;
}
.input {
  border: 0;
  border-radius: 0.2em;
  font-size: 0.9em;
  line-height: 1.3;
  padding: 0.3em 0.4em;
}
.button {
  background: #3f4e60;
  appearance: none;
  font-size: 0.9em;
  font-weight: bold;
  border: 0;
  border-radius: 0.3em;
  color: white;
  padding: 0.5em;
  cursor: pointer;
}
.select {
  display: inline-block;
  font-size: 0.9em;
  font-family: sans-serif;
  font-weight: normal;
  line-height: 1.3;
  padding: 0.3em 1.5em 0.3em 0.5em;
  height: auto;
  border: 0;
  border-radius: 0.2em;
  appearance: none;
  --webkit-appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%23444444'><polygon points='0,25 100,25 50,75'/></svg>");
  background-repeat: no-repeat;
  background-position: right 0.55em center;
  background-size: 0.65em auto, 100%;
}
</style>
