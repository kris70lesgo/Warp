import { describe, expect, it } from "vitest";
import { fixture } from "./fixtures";
import { buildEvidenceGraph } from "@/lib/sanity/evidence-graph";

describe("Sanity evidence graph", () => {
  it("keeps every supplier claim linked to its supplier and provenance", () => {
    const incident = fixture();
    incident.documentsProcessed = [{ id: "doc-1", name: "Registration", type: "Business Registration", supplierId: "SUP-C", fieldCount: 4, mode: "LOCAL", url: "/docs/registration.pdf" }];
    incident.legalEntityChecks = [{
      supplierId: "SUP-A", queryName: "Apex Electronics", country: "Germany", status: "MATCH",
      observedAt: "2026-09-27T00:00:00Z", lei: "529900T8BM49AURSDO55", legalName: "Apex Electronics GmbH",
      sourceUrl: "https://api.gleif.org/api/v1/lei-records/529900T8BM49AURSDO55", note: "Registry match",
    }];
    const graph = buildEvidenceGraph(incident);

    expect(graph.incidentId).toBe("INC-1042");
    expect(graph.suppliers).toHaveLength(3);
    expect(graph.claims).toHaveLength(6);
    expect(graph.claims.find((claim) => claim.id === "c6")).toMatchObject({ supplierId: "SUP-C", status: "CONFLICT" });
    expect(graph.documents[0]).toMatchObject({ supplierId: "SUP-C", documentType: "Business Registration" });
    expect(graph.legalEntityChecks[0]).toMatchObject({ supplierId: "SUP-A", status: "MATCH", lei: "529900T8BM49AURSDO55" });
  });
});
