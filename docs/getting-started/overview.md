[Vue Query](https://github.com/DamianOsipiuk/vue-query) package provides hooks for fetching, caching and updating asynchronous data in Vue.

Support for Vue 2.x and 3.x is provided via [vue-demi](https://github.com/vueuse/vue-demi) package

Based on [react-query](https://github.com/tannerlinsley/react-query).
All main concepts are inherited from the main package. Please also check the [react query docs](https://react-query.tanstack.com/overview)

---

### Motivation

Out of the box Vue does not provide optinionated way of interacting with server data. So developers end up building custom solutions that tend to end up either over-complicated, feature lacking or using global state management libraries that are not designed for this kind of usage.

While most traditional state management libraries are great for working with client state, they are **not so great at working with async or server state**. This is because **server state is totally different**. For starters, server state:

- Is persisted remotely in a location you do not control or own
- Requires asynchronous APIs for fetching and updating
- Implies shared ownership and can be changed by other people without your knowledge
- Can potentially become "out of date" in your applications if you're not careful

Once you grasp the nature of server state in your application, even more challenges will arise as you go, for example:

- Caching... (possibly the hardest thing to do in programming)
- Deduping multiple requests for the same data into a single request
- Updating "out of date" data in the background
- Knowing when data is "out of date"
- Reflecting updates to data as quickly as possible
- Performance optimizations like pagination and lazy loading data
- Managing memory and garbage collection of server state
- Memoizing query results with structural sharing

If you're not overwhelmed by that list, then that must mean that you've probably solved all of your server state problems already and deserve an award. However, if you are like a vast majority of people, you either have yet to tackle all or most of these challenges and we're only scratching the surface!

Vue Query is hands down one of the best libraries for managing server state. It works amazingly well **out-of-the-box, with zero-config, and can be customized** to your liking as your application grows.

Vue Query allows you to defeat and overcome the tricky challenges and hurdles of server state and control your app data before it starts to control you.

On a more technical note, Vue Query will likely:

- Help you remove many lines of complicated and misunderstood code from your application and replace with just a handful of lines of Vue Query logic.
- Make your application more maintainable and easier to build new features without worrying about wiring up new server state data sources
- Have a direct impact on your end-users by making your application feel faster and more responsive than ever before.
- Potentially help you save on bandwidth and increase memory performance
