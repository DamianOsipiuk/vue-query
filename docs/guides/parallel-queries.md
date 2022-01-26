"Parallel" queries are queries that are executed in parallel, or at the same time so as to maximize fetching concurrency.

## Manual Parallel Queries

When the number of parallel queries does not change, there is **no extra effort** to use parallel queries. Just use any number of Vue Query's `useQuery` and `useInfiniteQuery` hooks side-by-side!

```js
// The following queries will execute in parallel
const usersQuery = useQuery('users', fetchUsers)
const teamsQuery = useQuery('teams', fetchTeams)
const projectsQuery = useQuery('projects', fetchProjects)
...
```

> When using Vue Query in suspense mode, this pattern of parallelism does not work, since the first query would suspend the setup function before the other queries run. To get around this, you'll either need to use the `useQueries` hook (which is suggested) or orchestrate your own parallelism with separate components for each `useQuery` instance (which is lame).

## Dynamic Parallel Queries with `useQueries`

If the number of queries you need to execute is changing over the lifetime of a component, you cannot use manual querying since that would violate the rules of Composables - they should be executed synchronously in `<script setup>` or the `setup()` function. Instead, Vue Query provides a `useQueries` hook, which you can use to dynamically execute as many queries in parallel as you'd like.

`useQueries` accepts an **array of query options objects** and returns a **reactive array of query results**:

```js
const users = computed(...)
const usersQueriesOptions = computed(() => users.value.map(user => {
    return {
      queryKey: ['user', user.id],
      queryFn: () => fetchUserById(user.id),
    }
  })
);
const userQueries = useQueries(usersQueriesOptions)
```
