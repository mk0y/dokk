import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
import * as R from "ramda";

export type DependenciesOpts = {
  azClient?: DocumentAnalysisClient;
};

export const prepAzClient = (cond: boolean) => {
  return R.ifElse(
    () => cond,
    () => {
      const endpoint = process.env.AZURE_DOCS_ENDPOINT as string;
      const azureKey = process.env.AZURE_KEY_CREDENTIAL as string;
      const azClient = new DocumentAnalysisClient(
        endpoint,
        new AzureKeyCredential(azureKey)
      );
      return azClient;
    },
    () => {
      return {
        beginAnalyzeDocument: async () => ({
          pollUntilDone: async () => {
            const testresult = Bun.file("./test-data/invoice-result-7prq.json");
            const filecontent = await testresult.text();
            return JSON.parse(filecontent);
          },
        }),
      };
    }
  );
};
