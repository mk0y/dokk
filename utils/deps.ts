import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";

export type DependenciesOpts = {
  azClient?: DocumentAnalysisClient
}

export const prepAzClient = () => {
  const endpoint = process.env.AZURE_DOCS_ENDPOINT as string;
  const azureKey = process.env.AZURE_KEY_CREDENTIAL as string;
  const azClient = new DocumentAnalysisClient(
    endpoint,
    new AzureKeyCredential(azureKey)
  );
  return () => azClient;
};
