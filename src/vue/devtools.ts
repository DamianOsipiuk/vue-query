/* istanbul ignore file */

import { CustomInspectorNode, setupDevtoolsPlugin } from "@vue/devtools-api";
import { matchSorter } from "match-sorter";
import { QueryClient } from "./queryClient";
import type { Query } from "react-query/core";

const pluginId = "vue-query";
const pluginName = "Vue Query";

enum QueryState {
  Fetching = 0,
  Fresh,
  Stale,
  Inactive,
}

function getQueryState(query: Query): QueryState {
  if (query.isFetching()) {
    return QueryState.Fetching;
  }
  if (!query.getObserversCount()) {
    return QueryState.Inactive;
  }
  if (query.isStale()) {
    return QueryState.Stale;
  }

  return QueryState.Fresh;
}

function getQueryStateLabel(query: Query): string {
  const queryState = getQueryState(query);

  if (queryState === QueryState.Fetching) {
    return "fetching";
  }
  if (queryState === QueryState.Stale) {
    return "stale";
  }
  if (queryState === QueryState.Inactive) {
    return "inactive";
  }

  return "fresh";
}

function getQueryStatusFg(query: Query): number {
  const queryState = getQueryState(query);

  if (queryState === QueryState.Stale) {
    return 0x000000;
  }

  return 0xffffff;
}

function getQueryStatusBg(query: Query): number {
  const queryState = getQueryState(query);

  if (queryState === QueryState.Fetching) {
    return 0x006bff;
  }
  if (queryState === QueryState.Stale) {
    return 0xffb200;
  }
  if (queryState === QueryState.Inactive) {
    return 0x3f4e60;
  }

  return 0x008327;
}

export function setupDevtools(app: any, queryClient: QueryClient) {
  setupDevtoolsPlugin(
    {
      id: pluginId,
      label: pluginName,
      packageName: "vue-query",
      homepage: "https://github.com/DamianOsipiuk/vue-query",
      logo: "https://vue-query.vercel.app/vue-query.svg",
      app,
    },
    (api) => {
      const queryCache = queryClient.getQueryCache();
      queryCache.subscribe((event) => {
        api.sendInspectorTree(pluginId);
        api.sendInspectorState(pluginId);

        if (
          event &&
          ["queryAdded", "queryRemoved", "queryUpdated"].includes(event.type)
        ) {
          api.addTimelineEvent({
            layerId: pluginId,
            event: {
              title: event.type,
              subtitle: event.query.queryHash,
              time: api.now(),
              data: {
                queryHash: event.query.queryHash,
                ...event,
              },
            },
          });
        }
      });

      api.addInspector({
        id: pluginId,
        label: pluginName,
        icon: "api",
        nodeActions: [
          {
            icon: "cloud_download",
            tooltip: "Refetch",
            action: (queryHash: string) => {
              queryCache.get(queryHash)?.fetch();
            },
          },
          {
            icon: "alarm",
            tooltip: "Invalidate",
            action: (queryHash: string) => {
              const query = queryCache.get(queryHash) as Query;
              queryClient.invalidateQueries(query.queryKey);
            },
          },
          {
            icon: "settings_backup_restore",
            tooltip: "Reset",
            action: (queryHash: string) => {
              queryCache.get(queryHash)?.reset();
            },
          },
          {
            icon: "delete",
            tooltip: "Remove",
            action: (queryHash: string) => {
              const query = queryCache.get(queryHash) as Query;
              queryCache.remove(query);
            },
          },
        ],
      });

      api.on.getInspectorTree((payload) => {
        if (payload.inspectorId === pluginId) {
          const queries: Query[] = queryCache.getAll();
          const filtered = matchSorter(queries, payload.filter, {
            keys: ["queryHash"],
            baseSort: (a, b) =>
              String(a.rankedValue).localeCompare(b.rankedValue), //  (* -1) for desc sort
          });

          const nodes: CustomInspectorNode[] = filtered.map((query) => {
            const stateLabel = getQueryStateLabel(query);

            return {
              id: query.queryHash,
              label: query.queryHash,
              tags: [
                {
                  label: `${stateLabel} [${query.getObserversCount()}]`,
                  textColor: getQueryStatusFg(query),
                  backgroundColor: getQueryStatusBg(query),
                },
              ],
            };
          });
          payload.rootNodes = nodes;
        }
      });

      api.on.getInspectorState((payload) => {
        if (payload.inspectorId === pluginId) {
          const query = queryCache.get(payload.nodeId) as Query;

          payload.state = {
            " Query Details": [
              {
                key: "Query key",
                value: query.queryHash as string,
              },
              {
                key: "Query status",
                value: getQueryStateLabel(query),
              },
              {
                key: "Observers",
                value: query.getObserversCount(),
              },
              {
                key: "Last Updated",
                value: new Date(query.state.dataUpdatedAt).toLocaleTimeString(),
              },
            ],
            "Data Explorer": [
              {
                key: "Data",
                value: query.state.data,
              },
            ],
            "Query Explorer": [
              {
                key: "Query",
                value: query,
              },
            ],
          };
        }
      });

      api.addTimelineLayer({
        id: pluginId,
        label: pluginName,
        color: 0xffd94c,
      });
    }
  );
}
