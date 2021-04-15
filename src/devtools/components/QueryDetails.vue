<script lang="ts">
import { defineComponent, PropType, ref } from "vue";

import type { Query } from "react-query/types";

import InfoPanel from "./InfoPanel.vue";

import { useTheme } from "../useTheme";
import { useQueryCacheUpdater } from "../useQueryCacheUpdater";
import { getQueryStatusColor, getQueryStatusLabel } from "../utils";

export default defineComponent({
  name: "QueryDetails",
  components: { InfoPanel },
  props: {
    query: {
      type: Object as PropType<Query>,
      required: true,
    },
  },
  setup(props) {
    const theme = useTheme();

    const formattedQueryKey = ref("");
    const queryStatusLabel = ref("");
    const observersCount = ref("");
    const updateDate = ref("");
    const statusBackground = ref("");

    const stateUpdater = () => {
      formattedQueryKey.value = props.query.queryHash;
      queryStatusLabel.value = getQueryStatusLabel(props.query);
      // @ts-expect-error Accessing private property
      observersCount.value = props.query.observers.length;
      updateDate.value = new Date(
        props.query.state.dataUpdatedAt
      ).toLocaleTimeString();
      statusBackground.value = getQueryStatusColor(props.query, theme);
    };

    useQueryCacheUpdater(props.query.queryHash, stateUpdater);

    return {
      formattedQueryKey,
      queryStatusLabel,
      observersCount,
      updateDate,
      statusBackground,
    };
  },
});
</script>

<template>
  <InfoPanel title="Query Details">
    <div class="info-line">
      <code>
        <pre>{{ formattedQueryKey }}</pre>
      </code>
      <span :style="{ background: statusBackground }">
        {{ queryStatusLabel }}
      </span>
    </div>
    <div class="info-line">
      Observers:
      <code>{{ observersCount }}</code>
    </div>
    <div class="info-line">
      Last Updated:
      <code>{{ updateDate }}</code>
    </div>
  </InfoPanel>
</template>

<style scoped>
.info-line {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
}

.info-line:not(:last-of-type) {
  margin-bottom: 0.5rem;
}

code {
  line-height: 1.8rem;
  font-size: 0.9em;
}

pre {
  margin: 0;
  padding: 0;
  overflow: auto;
}

span {
  padding: 0.3rem 0.6rem;
  border-radius: 0.4rem;
  font-weight: bold;
  text-shadow: 0 2px 10px black;
  flex-shrink: 0;
}
</style>
