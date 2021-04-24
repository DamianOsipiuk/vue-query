<script lang="ts">
import { computed, defineComponent, PropType, h } from "vue-demi";

import type { Query } from "react-query/types";

import InfoPanel from "./InfoPanel.vue";

import { useTheme } from "../useTheme";
import { useQueryClient } from "../../useQueryClient";

export default defineComponent({
  name: "QueryActions",
  props: {
    query: {
      type: Object as PropType<Query>,
      required: true,
    },
  },
  setup(props) {
    const theme = useTheme();
    const queryClient = useQueryClient();
    const isFetching = computed(() => props.query.state.isFetching);

    const doFetch = () => {
      props.query.fetch();
    };
    const doInvalidate = () => {
      queryClient.invalidateQueries(props.query);
    };
    const doReset = () => {
      queryClient.resetQueries(props.query);
    };
    const doRemove = () => {
      queryClient.removeQueries(props.query);
    };

    return {
      theme,
      isFetching,
      doFetch,
      doInvalidate,
      doReset,
      doRemove,
    };
  },
  render() {
    return h(
      InfoPanel,
      {
        // Vue3
        title: "Actions",
        // Vue2
        props: {
          title: "Actions",
        },
      },
      [
        h(
          "button",
          {
            style: {
              background: this.isFetching
                ? this.theme.grayAlt
                : this.theme.active,
              cursor: this.isFetching ? "not-allowed" : "pointer",
            },
            // Vue3
            type: "button",
            disabled: this.isFetching,
            onClick: this.doFetch,
            // Vue2
            attrs: {
              type: "button",
              disabled: this.isFetching,
            },
            on: {
              click: this.doFetch,
            },
          },
          "Refetch"
        ),
        h(
          "button",
          {
            style: {
              background: this.theme.warning,
              color: this.theme.inputTextColor,
            },
            // Vue3
            type: "button",
            onClick: this.doInvalidate,
            // Vue2
            attrs: {
              type: "button",
            },
            on: {
              click: this.doInvalidate,
            },
          },
          "Invalidate"
        ),
        h(
          "button",
          {
            style: {
              background: this.theme.gray,
            },
            // Vue3
            type: "button",
            onClick: this.doReset,
            // Vue2
            attrs: {
              type: "button",
            },
            on: {
              click: this.doReset,
            },
          },
          "Reset"
        ),
        h(
          "button",
          {
            style: {
              background: this.theme.danger,
            },
            // Vue3
            type: "button",
            onClick: this.doRemove,
            // Vue2
            attrs: {
              type: "button",
            },
            on: {
              click: this.doRemove,
            },
          },
          "Remove"
        ),
      ]
    );
  },
});
</script>

<style scoped>
button {
  appearance: none;
  border-radius: 0.3em;
  border: 0;
  color: white;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: bold;
  padding: 0.5em;
}

button:not(:last-of-type) {
  margin-right: 5px;
}
</style>
