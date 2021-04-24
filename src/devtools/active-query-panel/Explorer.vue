<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  ref,
  watchEffect,
  h,
  resolveComponent,
} from "vue-demi";

import ExpandableNode from "./ExpandableNode.vue";

import { useTheme } from "../useTheme";

type DefaultExpanded = Record<string, unknown> | boolean;

interface LabelWithValue {
  label: string | number;
  value: Record<string, unknown>;
}

interface SubEntry {
  label: string | number;
  value: Record<string, unknown>;
  path: (string | number)[];
  depth: number;
  defaultExpanded: DefaultExpanded;
}

export default defineComponent({
  name: "ExplorerTree",
  components: { ExpandableNode },
  props: {
    label: {
      required: true,
    },
    defaultExpanded: {
      required: true,
    },
    pageSize: {
      type: Number,
      default: 100,
    },
    depth: {
      type: Number,
      default: 0,
    },
    value: {
      required: true,
    },
  },
  setup(props) {
    const theme = useTheme();
    const expanded = ref(!!props.defaultExpanded);
    const expandedPages = ref<number[]>([]);
    const path = ref<(string | number)[]>([]);
    const subEntries = ref<SubEntry[]>([]);
    const subEntriesLabel = computed(() =>
      subEntries.value.length > 1 ? "items" : "item"
    );
    const subEntryPages = ref<SubEntry[][]>([]);
    const stringifiedValue = computed(() =>
      JSON.stringify(
        props.value,
        Object.getOwnPropertyNames(Object(props.value))
      )
    );

    const toggle = () => {
      expanded.value = !expanded.value;
    };

    const makeProperty = (sub: LabelWithValue): SubEntry => {
      const newPath = path.value.concat(sub.label);
      let subDefaultExpanded: DefaultExpanded = false;
      if (typeof props.defaultExpanded === "boolean") {
        if (props.defaultExpanded === true) {
          subDefaultExpanded = { [sub.label]: true };
        }
      } else if (props.defaultExpanded) {
        subDefaultExpanded = props.defaultExpanded[
          sub.label
        ] as DefaultExpanded;
      }

      return {
        ...sub,
        path: newPath,
        depth: props.depth + 1,
        defaultExpanded: subDefaultExpanded,
      };
    };

    watchEffect(() => {
      if (Array.isArray(props.value)) {
        subEntries.value = props.value.map((d: Record<string, unknown>, i) => {
          return makeProperty({
            label: i,
            value: d,
          });
        });
      } else if (
        props.value !== null &&
        typeof props.value === "object" &&
        // @ts-expect-error Fix typings
        typeof props.value[Symbol.iterator] === "function"
      ) {
        subEntries.value = Array.from(
          // @ts-expect-error Fix typings
          props.value,
          (val: Record<string, unknown>, i) =>
            makeProperty({
              label: i,
              value: val,
            })
        );
      } else if (typeof props.value === "object" && props.value !== null) {
        // eslint-disable-next-line no-shadow
        subEntries.value = Object.entries(props.value).map(([label, value]) =>
          makeProperty({
            label,
            value,
          })
        );
      }

      if (subEntries.value) {
        let i = 0;

        while (i < subEntries.value.length) {
          subEntryPages.value.push(
            subEntries.value.slice(i, i + props.pageSize)
          );
          i = i + props.pageSize;
        }
      }
    });

    const setExpandedPages = (index: number) => {
      if (expandedPages.value.includes(index)) {
        expandedPages.value = expandedPages.value.filter((d) => d !== index);
      } else {
        expandedPages.value = [...expandedPages.value, index];
      }
    };

    return {
      theme,
      subEntryPages,
      toggle,
      expanded,
      subEntries,
      subEntriesLabel,
      expandedPages,
      setExpandedPages,
      stringifiedValue,
    };
  },
  render() {
    const root = this.subEntryPages?.length
      ? h(ExpandableNode, {
          // Vue3
          isExpanded: this.expanded,
          title: this.label,
          subtitle: `${this.subEntries.length} ${this.subEntriesLabel}`,
          onClick: this.toggle,
          // Vue2
          props: {
            isExpanded: this.expanded,
            title: this.label,
            subtitle: `${this.subEntries.length} ${this.subEntriesLabel}`,
          },
          on: {
            click: this.toggle,
          },
        })
      : undefined;

    const singlePage = h(
      "div",
      {
        class: "indent",
      },
      this.subEntries.map((entry) =>
        h(resolveComponent("ExplorerTree"), {
          key: entry.label,
          // Vue3
          label: entry.label,
          value: entry.value,
          // Vue2
          props: {
            label: entry.label,
            value: entry.value,
          },
        })
      )
    );

    const multiPage = h(
      "div",
      {
        class: "indent",
      },
      this.subEntryPages.map((page, index) =>
        h(
          "div",
          {
            key: index,
          },
          [
            h(ExpandableNode, {
              // Vue3
              isExpanded: this.expandedPages.includes(index),
              title: `[${index * this.pageSize} ... ${
                index * this.pageSize + this.pageSize - 1
              }]`,
              onClick: () => this.setExpandedPages(index),
              // Vue2
              props: {
                isExpanded: this.expandedPages.includes(index),
                title: `[${index * this.pageSize} ... ${
                  index * this.pageSize + this.pageSize - 1
                }]`,
              },
              on: {
                click: () => this.setExpandedPages(index),
              },
            }),
            this.expandedPages.includes(index)
              ? h(
                  "div",
                  {
                    class: "indent",
                  },
                  page.map((entry) =>
                    h(resolveComponent("ExplorerTree"), {
                      key: entry.label,
                      // Vue3
                      label: entry.label,
                      value: entry.value,
                      // Vue2
                      props: {
                        label: entry.label,
                        value: entry.value,
                      },
                    })
                  )
                )
              : undefined,
          ]
        )
      )
    );

    const expanded = this.subEntryPages.length === 1 ? singlePage : multiPage;
    const noPages = [
      h("span", { class: "expandable" }, this.label),
      h("span", { style: { color: this.theme.danger } }, this.stringifiedValue),
    ];

    return h(
      "div",
      {
        class: "explorer-tree",
        key: this.$props.label,
      },
      [
        root,
        this.expanded ? expanded : undefined,
        h("span"),
        !this.subEntryPages?.length ? noPages : undefined,
      ]
    );
  },
});
</script>

<template>
  <div class="explorer-tree" :key="label">
    <ExpandableNode
      v-if="subEntryPages.length"
      :isExpanded="expanded"
      :title="label"
      :subtitle="subEntries.length + ' ' + subEntriesLabel"
      @click="toggle"
    />
    <div v-if="expanded && subEntryPages.length === 1" class="indent">
      <ExplorerTree
        v-for="entry of subEntries"
        :key="entry.label"
        :label="entry.label"
        :value="entry.value"
        :defaultExpanded="false"
      />
    </div>
    <div v-if="expanded && subEntryPages.length !== 1" class="indent">
      <div v-for="(entries, index) in subEntryPages" :key="index">
        <ExpandableNode
          :isExpanded="expandedPages.includes(index)"
          :title="
            '[' +
            index * pageSize +
            ' ... ' +
            (index * pageSize + pageSize - 1) +
            ']'
          "
          @click="() => setExpandedPages(index)"
        />
        <div v-if="expandedPages.includes(index)" class="indent">
          <ExplorerTree
            v-for="entry of entries"
            :key="entry.label"
            :label="entry.label"
            :value="entry.value"
            :defaultExpanded="false"
          />
        </div>
      </div>
    </div>
    <span v-if="!subEntryPages.length" class="expandable">{{ label }}:</span>
    <span v-if="!subEntryPages.length" :style="{ color: theme.danger }">
      {{ stringifiedValue }}
    </span>
  </div>
</template>

<style scoped>
.explorer-tree {
  font-family: Menlo, monospace;
  font-size: 0.9rem;
  line-height: 1.7;
  outline: none;
  word-break: break-word;
}

.expandable {
  margin-right: 10px;
}

.indent {
  margin-left: 0.1rem;
  padding-left: 1rem;
  border-left: 2px solid rgba(0, 0, 0, 0.15);
}
</style>
