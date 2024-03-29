import * as R from "ramda";

export const maybe = (fn: Function) =>
  R.tryCatch(() => fn(), R.always(undefined))();
