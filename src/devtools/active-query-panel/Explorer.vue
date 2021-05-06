<script lang="ts">
import { computed, defineComponent, ref, h, PropType } from "vue-demi";
import * as VueDemi from "vue-demi";

import ExpandableNode from "./ExpandableNode.vue";

import { useTheme } from "../useTheme";

type DefaultExpanded = boolean | { [key: string]: DefaultExpanded };

interface LabelWithValue {
  label: string;
  value: Record<string, unknown>;
}

interface SubEntry {
  label: string;
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
      type: String,
      required: true,
    },
    defaultExpanded: {
      type: [Object, Boolean] as PropType<DefaultExpanded>,
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
    const subEntries = computed<SubEntry[]>(() => {
      if (Array.isArray(props.value)) {
        return props.value.map((d: Record<string, unknown>, i) => {
          return makeProperty({
            label: String(i),
            value: d,
          });
        });
      } else if (
        props.value !== null &&
        typeof props.value === "object" &&
        // @ts-expect-error Fix typings
        typeof props.value[Symbol.iterator] === "function"
      ) {
        return Array.from(
          // @ts-expect-error Fix typings
          props.value,
          (val: Record<string, unknown>, i) =>
            makeProperty({
              label: String(i),
              value: val,
            })
        );
      } else if (typeof props.value === "object" && props.value !== null) {
        const filteredValue = { ...props.value, __ob__: {} };
        return Object.entries(filteredValue).map(([label, value]) =>
          makeProperty({
            label,
            value,
          })
        );
      }

      return [];
    });
    const subEntriesLabel = computed(() =>
      subEntries.value.length > 1 ? "items" : "item"
    );
    const subEntryPages = computed(() => {
      const pages = [];
      let i = 0;
      while (i < subEntries.value.length) {
        pages.push(subEntries.value.slice(i, i + props.pageSize));
        i = i + props.pageSize;
      }
      return pages;
    });
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
        subDefaultExpanded = props.defaultExpanded[sub.label];
      }

      return {
        ...sub,
        path: newPath,
        depth: props.depth + 1,
        defaultExpanded: subDefaultExpanded,
      };
    };

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

    const recursiveComponent = VueDemi.resolveComponent
      ? VueDemi.resolveComponent("ExplorerTree")
      : "ExplorerTree";

    const singlePage = h(
      "div",
      {
        class: "indent",
      },
      this.subEntries.map((entry) =>
        h(recursiveComponent, {
          key: entry.label,
          // Vue3
          label: entry.label,
          value: entry.value,
          defaultExpanded: false,
          // Vue2
          props: {
            label: entry.label,
            value: entry.value,
            defaultExpanded: false,
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
                    h(recursiveComponent, {
                      key: entry.label,
                      // Vue3
                      label: entry.label,
                      value: entry.value,
                      defaultExpanded: false,
                      // Vue2
                      props: {
                        label: entry.label,
                        value: entry.value,
                        defaultExpanded: false,
                      },
                    })
                  )
                )
              : undefined,
          ]
        )
      )
    );

    const expanded = this.expanded
      ? this.subEntryPages.length === 1
        ? singlePage
        : multiPage
      : undefined;

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
      [root, expanded, ...(!this.subEntryPages?.length ? noPages : [])]
    );
  },
});
</script>

<style>
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
