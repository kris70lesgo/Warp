import { LegalEntityCheck, Incident } from "@/schemas/core";
import { GLEIF_LEI_RECORDS_ENDPOINT, searchGleifLegalEntity } from "@/integrations/gleif/client";
import type { ActivityLedger } from "@/lib/integrations/ledger";

export interface LegalEntityReport {
  checks: LegalEntityCheck[];
  matchCount: number;
}

/**
 * GLEIF has strong coverage of organisations with LEIs, but an organisation
 * without an LEI is not automatically suspect. A no-match is therefore neutral
 * evidence, while a returned record is positive legal-entity corroboration.
 */
export async function runLegalEntityIntelligence(
  incident: Incident,
  ledger?: ActivityLedger
): Promise<LegalEntityReport> {
  const observedAt = new Date().toISOString();
  const checks = await Promise.all(incident.alternativeSuppliers.map(async (supplier) => {
    const start = Date.now();
    const request = { legalName: supplier.name, country: supplier.location };
    try {
      const result = await searchGleifLegalEntity(supplier.name, supplier.location);
      const entity = result.entity;
      const check: LegalEntityCheck = entity
        ? {
            supplierId: supplier.id,
            queryName: supplier.name,
            country: supplier.location,
            status: "MATCH",
            observedAt,
            ...entity,
            note: "Exact legal-name record returned by GLEIF's public LEI registry.",
          }
        : {
            supplierId: supplier.id,
            queryName: supplier.name,
            country: supplier.location,
            status: "NO_MATCH",
            observedAt,
            note: "No matching LEI record was returned. This is neutral: many legitimate suppliers do not hold an LEI.",
          };
      ledger?.record({
        sponsor: "GLEIF",
        operation: "legal-entity lookup · LEI registry",
        method: "GET",
        endpoint: GLEIF_LEI_RECORDS_ENDPOINT,
        request,
        response: entity ? { total: result.total, entity } : { total: result.total },
        mode: "LIVE",
        status: "ok",
        ms: Date.now() - start,
        note: check.note,
      });
      return check;
    } catch (error) {
      const note = "GLEIF lookup was unavailable; no legal-entity conclusion was made.";
      ledger?.record({
        sponsor: "GLEIF",
        operation: "legal-entity lookup · LEI registry",
        method: "GET",
        endpoint: GLEIF_LEI_RECORDS_ENDPOINT,
        request,
        response: { error: error instanceof Error ? error.message : "unknown error" },
        mode: "LOCAL",
        status: "error",
        ms: Date.now() - start,
        note,
      });
      const check: LegalEntityCheck = {
        supplierId: supplier.id,
        queryName: supplier.name,
        country: supplier.location,
        status: "UNAVAILABLE",
        observedAt,
        note,
      };
      return check;
    }
  }));
  return { checks, matchCount: checks.filter((check) => check.status === "MATCH").length };
}
