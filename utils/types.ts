import { DocumentAnalysisClient } from "@azure/ai-form-recognizer";

type FakeDocumentAnalysisClient = { beginAnalyzeDocument: Function };
export type AzDocsClient = {
  azClient: DocumentAnalysisClient | FakeDocumentAnalysisClient;
};
