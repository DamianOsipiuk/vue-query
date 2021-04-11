<script lang="ts">
import { defineComponent, PropType, ref, watchEffect } from "vue";
import { useTheme } from "./useTheme";

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
  name: "Explorer",
  props: {
    label: {},
    defaultExpanded: {
      type: Object as PropType<DefaultExpanded>,
    },
    pageSize: {
      type: Number,
      default: 100,
    },
    depth: {
      type: Number,
      default: 0,
    },
    value: {},
  },
  setup(props) {
    const theme = useTheme();
    const expanded = ref(props.defaultExpanded);
    const expandedPages = ref<number[]>([]);
    const path = ref<(string | number)[]>([]);
    const type = ref<string>(typeof props.value);
    const subEntries = ref<SubEntry[]>([]);
    const subEntryPages = ref<SubEntry[][]>([]);

    const toggle = (set?: Record<string, unknown>) => {
      expanded.value = typeof set !== "undefined" ? set : !expanded.value;
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
        type.value = "array";
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
        type.value = "Iterable";
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
        type.value = "object";
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
      subEntryPages,
      toggle,
      expanded,
      subEntries,
      type,
      expandedPages,
      setExpandedPages,
      theme,
    };
  },
});
</script>

<template>
  <div
    :style="{
      fontFamily: 'Menlo, monospace',
      fontSize: '0.9rem',
      lineHeight: '1.7',
      outline: 'none',
      wordBreak: 'break-word',
    }"
    :key="label"
  >
    <span
      v-if="subEntryPages?.length"
      :style="{ cursor: 'pointer', color: 'white' }"
      @click="() => toggle()"
    >
      <span
        :style="{
          display: 'inline-block',
          transition: 'all .1s ease',
          transform: `rotate(${expanded ? 90 : 0}deg)`,
        }"
      >
        ▶
      </span>
      {{ label }}{{ " " }}
      <span :style="{ color: 'grey', fontSize: '.7rem' }">
        {{ String(type).toLowerCase() === "iterable" ? "(Iterable) " : "" }}
        {{ subEntries.length }} {{ subEntries.length > 1 ? `items` : `item` }}
      </span>
    </span>
    <div
      v-if="expanded && subEntryPages.length === 1"
      :style="{
        marginLeft: '.1rem',
        paddingLeft: '1rem',
        borderLeft: '2px solid rgba(0,0,0,.15)',
      }"
    >
      <Explorer
        v-for="entry of subEntries"
        :key="entry.label"
        :label="entry.label"
        :value="entry.value"
      />
    </div>
    <div
      v-if="expanded && subEntryPages.length !== 1"
      :style="{
        marginLeft: '.1rem',
        paddingLeft: '1rem',
        borderLeft: '2px solid rgba(0,0,0,.15)',
      }"
    >
      <div v-for="(entries, index) in subEntryPages" :key="index">
        <div
          :style="{
            fontFamily: 'Menlo, monospace',
            fontSize: '0.9rem',
            lineHeight: '1.7',
            outline: 'none',
            wordBreak: 'break-word',
          }"
        >
          <span
            :style="{ cursor: 'pointer', color: 'white' }"
            @click="() => setExpandedPages(index)"
          >
            <span
              :style="{
                display: 'inline-block',
                transition: 'all .1s ease',
                transform: `rotate(${expanded ? 90 : 0}deg)`,
              }"
            >
              ▶
            </span>
            [{{ index * pageSize }} ...{{ " " }}
            {{ index * pageSize + pageSize - 1 }}]
          </span>
          <div
            v-if="expandedPages.includes(index)"
            :style="{
              marginLeft: '.1rem',
              paddingLeft: '1rem',
              borderLeft: '2px solid rgba(0,0,0,.15)',
            }"
          >
            <Explorer
              v-for="entry of entries"
              :key="entry.label"
              :label="entry.label"
              :value="entry.value"
            />
          </div>
        </div>
      </div>
    </div>
    <span
      v-if="!subEntryPages?.length"
      :style="{ cursor: 'pointer', color: 'white' }"
      >{{ label }}:</span
    >{{ " " }}
    <span v-if="!subEntryPages?.length" :style="{ color: theme.danger }">
      {{ JSON.stringify(value, Object.getOwnPropertyNames(Object(value))) }}
    </span>
  </div>
</template>
