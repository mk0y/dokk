import { describe, expect, test } from "bun:test";
import * as R from "ramda";
import app from "./docs";

describe(`POST "/docs/process"`, () => {
  test("no body = 400", async () => {
    const res = await app.request("/process", { method: "POST" });
    const message = await res.text();
    expect(res.status).toBe(400);
    expect(message).toBe("Unknown analyzer type");
  });

  test("single docs[]", async () => {
    const file = Bun.file(Bun.main);
    const formData = new FormData();
    formData.append("docs[]", file);
    formData.append("doctype", "invoice");
    const res = await app.request("/process", {
      method: "POST",
      body: formData,
    });
    const json = (await res.json()) as { docs: Array<Record<any, unknown>> };
    const docType = R.path([0, "docType"], json.docs[0].documents) as string;
    expect(docType).toBe("invoice");
    expect(json.docs.length).toBe(1);
    expect(R.path(["docs", 0, "documents"], json)).toBeArray();
    expect(res.status).toBe(200);
  });

  test("two docs[]", async () => {
    const file = Bun.file(Bun.main);
    const formData = new FormData();
    formData.append("docs[]", file);
    formData.append("docs[]", file);
    formData.append("doctype", "invoice");
    const res = await app.request("/process", {
      method: "POST",
      body: formData,
    });
    const json = (await res.json()) as { docs: Array<Record<any, unknown>> };
    expect(json.docs.length).toBe(2);
    expect(R.path(["docs", 0, "documents"], json)).toBeArray();
    expect(R.path(["docs", 1, "documents"], json)).toBeArray();
    expect(res.status).toBe(200);
  });
});

describe("test-data", () => {
  test("invoices", async () => {
    const bunfile = Bun.file("./test-data/invoice-result-7prq.json");
    const content = await bunfile.json();
    const fields: string[] = R.path(["documents", 0, "fields"], content);
    const fieldKeys = [
      "BillingAddress",
      "BillingAddressRecipient",
      "CustomerName",
      "CustomerTaxId",
      "DueDate",
      "InvoiceDate",
      "InvoiceId",
      "InvoiceTotal",
      "Items",
      "ServiceEndDate",
      "SubTotal",
      "TotalTax",
      "VendorAddress",
      "VendorAddressRecipient",
      "VendorName",
      "VendorTaxId",
    ];
    const keys = R.keys(fields) as string[];
    expect(fieldKeys).toEqual(keys);
  });
});
