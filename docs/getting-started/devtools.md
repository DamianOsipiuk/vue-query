Wave your hands in the air and shout hooray because Vue Query comes with dedicated DevTools! 🥳

When you begin your Vue Query journey, you'll want these DevTools by your side. They help visualize all of the inner workings of Vue Query and will likely save you hours of debugging if you find yourself in a pinch!

## Import the Devtools

The DevTools are bundle split into the vue-query/devtools package. No need to install anything extra, just:

```
import { VueQueryDevTools } from "vue-query/devtools";
```

By default, Vue Query DevTools are not included in production bundles when `process.env.NODE_ENV === 'production'`, so you don't need to worry about excluding them during a production build.

---

## Floating Mode

Floating Mode will mount the DevTools as a fixed, floating element in your app and provide a toggle in the corner of the screen to show and hide the DevTools.

Place the following code as high in your Vue app as you can. The closer it is to the root of the page, the better it will work!

```
<script lang="ts">
import { defineComponent } from "vue";
import { VueQueryDevTools } from "vue-query/devtools";

export default defineComponent({
  name: "App",
  components: { VueQueryDevTools },
});
</script>

<template>
  <VueQueryDevTools />
</template>
```

### Options

- `initialIsOpen: Boolean`
  - Set this `true` if you want the dev tools to default to being open
- `panelProps: PropsObject`
  - Use this to add props to the panel. For example, you can add `className`, `style` (merge and override default style), etc.
- `closeButtonProps: PropsObject`
  - Use this to add props to the close button. For example, you can add `className`, `style` (merge and override default style), `onClick` (extend default handler), etc.
- `toggleButtonProps: PropsObject`
  - Use this to add props to the toggle button. For example, you can add `className`, `style` (merge and override default style), `onClick` (extend default handler), etc.
- `position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"`
  - Defaults to `bottom-left`
  - The position of the Vue Query logo to open and close the DevTools panel

---

## Embedded Mode

Embedded Mode will embed the DevTools as a regular component in your application. You can style it however you'd like after that!

```
<script lang="ts">
import { defineComponent } from "vue";
import { VueQueryDevToolsPanel } from "vue-query/devtools";

export default defineComponent({
  name: "App",
  components: { VueQueryDevTools },
});
</script>

<template>
  <VueQueryDevToolsPanel :style={styles} :className={className} />
</template>
```

### Options

Use these options to style the dev tools.

- `style: StyleObject`
  - The standard Vue style object used to style a component with inline styles
- `className: string`
  - The standard Vue className property used to style a component with classes
