<script lang="ts">
import { defineComponent, PropType } from "vue";

import type { Query } from "react-query/types";

import Explorer from "./Explorer.vue";
import InfoPanel from "./InfoPanel.vue";
import QueryActions from "./QueryActions.vue";
import QueryDetails from "./QueryDetails.vue";

export default defineComponent({
  name: "ActiveQueryPanel",
  components: { Explorer, InfoPanel, QueryActions, QueryDetails },
  props: {
    query: {
      type: Object as PropType<Query>,
      required: true,
    },
  },
});
</script>

<template>
  <div class="active-query-panel">
    <QueryDetails :query="query" />
    <QueryActions :query="query" />
    <InfoPanel title="Data Explorer">
      <Explorer label="Data" :value="query.state.data" :defaultExpanded="{}" />
    </InfoPanel>
    <InfoPanel title="Query Explorer">
      <Explorer
        label="Query"
        :value="query"
        :defaultExpanded="{
          queryKey: true,
        }"
      />
    </InfoPanel>
  </div>
</template>

<style scoped>
.active-query-panel {
  display: flex;
  flex-direction: column;
  flex: 1 1 500px;
  height: 100%;
  overflow: auto;
}
</style>
