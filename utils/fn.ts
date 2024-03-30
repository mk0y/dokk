import * as R from "ramda";

export const maybe = (fn: Function) =>
  R.tryCatch(() => fn(), R.always(undefined))();

const validAnalyzers = ["invoice"];
export const getAnalyzerType = (analyzer: string) => {
  if (validAnalyzers.includes(analyzer)) {
    return `prebuilt-${analyzer}`;
  }
};

export const writeTestData = (analyzerType: string, data: Record<any, any>) => {
  Bun.write(
    `./test-data/${analyzerType}-result-${Array.from(
      { length: 4 },
      () => Math.random().toString(36)[2]
    ).join("")}.json`,
    JSON.stringify(data, null, 2)
  );
};
