If a user leaves your application and returns to stale data, **Vue Query automatically requests fresh data for you in the background**. You can disable this globally or per-query using the `refetchOnWindowFocus` option:

### Disabling globally

```ts
import { createApp } from "vue";
import { VueQueryPlugin, VueQueryPluginOptions } from "vue-query";

import App from "./App.vue";

const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  },
};

createApp(App).use(VueQueryPlugin, vueQueryPluginOptions).mount("#app");
```

### Disabling Per-Query

```js
useQuery(["todos"], fetchTodos, { refetchOnWindowFocus: false });
```

## Custom Window Focus Event

In rare circumstances, you may want to manage your own window focus events that trigger Vue Query to revalidate.  
To do this, Vue Query provides a `focusManager.setEventListener` function that supplies you the callback that should be fired when the window is focused and allows you to set up your own events.  
When calling `focusManager.setEventListener`, the previously set handler is removed (which in most cases will be the default handler) and your new handler is used instead.  
For example, this is the default handler:

```js
focusManager.setEventListener((handleFocus) => {
  // Listen to visibillitychange and focus
  if (typeof window !== "undefined" && window.addEventListener) {
    window.addEventListener("visibilitychange", handleFocus, false);
    window.addEventListener("focus", handleFocus, false);
  }

  return () => {
    // Be sure to unsubscribe if a new handler is set
    window.removeEventListener("visibilitychange", handleFocus);
    window.removeEventListener("focus", handleFocus);
  };
});
```

## Ignoring Iframe Focus Events

A great use-case for replacing the focus handler is that of iframe events.  
Iframes present problems with detecting window focus by both double-firing events and also firing false-positive events when focusing or using iframes within your app.  
If you experience this, you should use an event handler that ignores these events as much as possible. We recommend [this one!](https://gist.github.com/tannerlinsley/1d3a2122332107fcd8c9cc379be10d88) It can be set up in the following way:

```js
import { focusManager } from "vue-query";
import onWindowFocus from "./onWindowFocus"; // The gist above

focusManager.setEventListener(onWindowFocus);
```

## Managing focus state

```js
import { focusManager } from "vue-query";

// Override the default focus state
focusManager.setFocused(true);

// Fallback to the default focus check
focusManager.setFocused(undefined);
```

### Pitfalls & Caveats

Some browser internal dialogue windows, such as spawned by `alert()` or file upload dialogues (as created by `<input type="file" />`) might also trigger focus refetching after they close. This can result in unwanted side effects, as the refetching might trigger component unmounts or remounts before your file upload handler is executed.