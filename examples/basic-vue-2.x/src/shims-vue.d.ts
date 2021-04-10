declare module "*.vue" {
  import { DefineComponent } from "@vue/composition-api";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
