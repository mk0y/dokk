import {
  AnalysisPoller,
  AnalyzeResult,
  AnalyzedDocument,
} from "@azure/ai-form-recognizer";
import { AzDocsClient } from "./types";

const invoiceSimpleFields = [
  "BillingAddressRecipient",
  "CustomerAddressRecipient",
  "CustomerName",
  "CustomerTaxId",
  "DueDate",
  "InvoiceDate",
  "InvoiceId",
  "ServiceEndDate",
  "VendorAddressRecipient",
  "VendorName",
  "VendorTaxId",
];

const invoiceJsonValueFields = [
  "BillingAddress", // or
  "CustomerAddress", // or
  "InvoiceTotal",
  "SubTotal",
  "TotalTax",
  "VendorAddress",
];

export const analyzeSingleDoc = async ({
  doc,
  analyzerType,
  azClient,
}: {
  doc: File;
  analyzerType: string;
  azClient: AzDocsClient;
}) => {
  const arraybuffer = await doc.arrayBuffer();
  const buffer = Buffer.from(arraybuffer);
  const poller = (await azClient.beginAnalyzeDocument(
    analyzerType,
    buffer
  )) as AnalysisPoller<AnalyzeResult<AnalyzedDocument>>;
  return poller.pollUntilDone();
};
