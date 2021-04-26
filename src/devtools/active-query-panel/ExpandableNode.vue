<script lang="ts">
import { defineComponent, h } from "vue-demi";

export default defineComponent({
  name: "ExpandableNode",
  props: {
    isExpanded: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: false,
    },
  },
  emits: ["click"],
  setup(_props, { emit }) {
    const onClick = () => {
      emit("click");
    };

    return {
      onClick,
    };
  },
  render() {
    const subtitle = this.subtitle
      ? h(
          "span",
          {
            class: "expandable-subtitle",
          },
          this.subtitle
        )
      : undefined;

    return h(
      "span",
      {
        class: "expandable",
        // Vue3
        onClick: this.onClick,
        // Vue2
        on: {
          click: this.onClick,
        },
      },
      [
        h(
          "span",
          {
            class: "expandable-arrow",
            style: {
              transform: `rotate(${this.$props.isExpanded ? 90 : 0}deg)`,
            },
          },
          "▶"
        ),
        this.title,
        subtitle,
      ]
    );
  },
});
</script>

<style>
.expandable {
  cursor: pointer;
  color: white;
}

.expandable-arrow {
  display: inline-block;
  margin-right: 10px;
  transition: all 0.1s ease;
}

.expandable-subtitle {
  color: grey;
  font-size: 0.7rem;
  margin-left: 10px;
}
</style>
