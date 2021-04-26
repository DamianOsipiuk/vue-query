<script lang="ts">
import { defineComponent, reactive, ref, h } from "vue-demi";

import type { Options } from "../types";
import { useTheme } from "../useTheme";
import { sortFns } from "../utils";

export default defineComponent({
  name: "QueryOptions",
  emits: {
    optionsChange: (options: Options) => Boolean(options),
  },
  setup(_props, { emit }) {
    const theme = useTheme();
    const sortFnKeys = Object.keys(sortFns);

    const sort = ref(sortFnKeys[0]);

    const options = reactive({
      filter: "",
      sortDesc: false,
      sortFn: sortFns["Status > Last Updated"],
    });

    const onInput = (event: InputEvent) => {
      options.filter = (event.target as HTMLInputElement)?.value;

      emit("optionsChange", options);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        options.filter = "";
        emit("optionsChange", options);
      }
    };

    const onSortFnChange = (event: Event) => {
      sort.value = (event.target as HTMLSelectElement)?.value;
      options.sortFn = sortFns[sort.value];

      emit("optionsChange", options);
    };

    const onSortDescChange = () => {
      options.sortDesc = !options.sortDesc;

      emit("optionsChange", options);
    };

    return {
      theme,
      sortFnKeys,
      sort,
      options,
      onInput,
      onKeyDown,
      onSortFnChange,
      onSortDescChange,
    };
  },
  render() {
    const input = h("input", {
      class: "options-input",
      style: {
        backgroundColor: this.theme.inputBackgroundColor,
        color: this.theme.inputTextColor,
      },
      // Vue3
      placeholder: "Filter",
      value: this.options.filter,
      onInput: this.onInput,
      onKeydown: this.onKeyDown,
      // Vue2
      attrs: {
        placeholder: "Filter",
        value: this.options.filter,
      },
      on: {
        input: this.onInput,
        keydown: this.onKeyDown,
      },
    });

    const select = !this.options.filter
      ? h(
          "select",
          {
            class: "options-select",
            style: {
              backgroundColor: this.theme.inputBackgroundColor,
              color: this.theme.inputTextColor,
            },
            // Vue3
            value: this.sort,
            onChange: this.onSortFnChange,
            // Vue2
            attrs: {
              value: this.sort,
            },
            on: {
              change: this.onSortFnChange,
            },
          },
          this.sortFnKeys.map((key) => {
            return h(
              "option",
              {
                key: key,
                // Vue3
                value: key,
                // Vue2
                attrs: {
                  value: key,
                },
              },
              `Sort by ${key}`
            );
          })
        )
      : undefined;

    const button = !this.options.filter
      ? h(
          "button",
          {
            class: "options-button",
            style: {
              background: this.theme.gray,
            },
            // Vue3
            type: "button",
            onClick: this.onSortDescChange,
            // Vue2
            attrs: {
              type: "button",
            },
            on: {
              click: this.onSortDescChange,
            },
          },
          this.options.sortDesc ? "⬇ Desc" : "⬆ Asc"
        )
      : undefined;

    return h(
      "div",
      {
        class: "options-wrapper",
      },
      [input, select, button]
    );
  },
});
</script>

<style>
.options-wrapper {
  align-items: center;
  display: flex;
}

.options-input {
  border-radius: 0.2em;
  border: 0;
  flex: 1;
  font-size: 0.9em;
  line-height: 1.3;
  margin-right: 0.5rem;
  padding: 0.3em 0.4em;
}

.options-button {
  appearance: none;
  background: #3f4e60;
  border-radius: 0.3em;
  border: 0;
  color: white;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: bold;
  padding: 0.3rem 0.4rem;
}

.options-select {
  --webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%23444444'><polygon points='0,25 100,25 50,75'/></svg>");
  background-position: right 0.55em center;
  background-repeat: no-repeat;
  background-size: 0.65em auto, 100%;
  border-radius: 0.2em;
  border: 0;
  display: inline-block;
  flex: 1;
  font-family: sans-serif;
  font-size: 0.9em;
  font-weight: normal;
  height: auto;
  line-height: 1.3;
  margin-right: 0.5rem;
  min-width: 75;
  padding: 0.3em 1.5em 0.3em 0.5em;
}
</style>
