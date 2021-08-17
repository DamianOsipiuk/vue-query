import type { Query } from "react-query/types/core";

export type ButtonProps = Partial<HTMLButtonElement>;

export type SortFn = (a: Query, b: Query) => number;

export interface Options {
  selectedQueryClientKey: string;
  filter: string;
  sortFn: SortFn;
  sortDesc: boolean;
}
export interface PanelProps {
  style?: Partial<CSSStyleDeclaration>;
  className?: string;
}
