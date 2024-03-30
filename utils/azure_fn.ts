import {
  AnalysisPoller,
  AnalyzeResult,
  AnalyzedDocument,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";

export const analyzeSingleDoc = async ({
  doc,
  analyzerType,
  azClient,
}: {
  doc: File;
  analyzerType: string;
  azClient: DocumentAnalysisClient;
}) => {
  const arraybuffer = await doc.arrayBuffer();
  const buffer = Buffer.from(arraybuffer);
  const poller = (await azClient.beginAnalyzeDocument(
    analyzerType,
    buffer
  )) as AnalysisPoller<AnalyzeResult<AnalyzedDocument>>;
  return poller.pollUntilDone();
};
