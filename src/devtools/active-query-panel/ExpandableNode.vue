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
            class: "subtitle",
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
            class: "arrow",
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

<style scoped>
.expandable {
  cursor: pointer;
  color: white;
}

.arrow {
  display: inline-block;
  margin-right: 10px;
  transition: all 0.1s ease;
}

.subtitle {
  color: grey;
  font-size: 0.7rem;
  margin-left: 10px;
}
</style>
