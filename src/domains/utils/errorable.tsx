export type Errorable<T> =
  | { data: T; error: null }
  | { data: null; error: string };
