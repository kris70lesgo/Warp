import { afterEach, describe, expect, it, vi } from "vitest";
import { gleifCountryCode, searchGleifLegalEntity } from "@/integrations/gleif/client";

afterEach(() => vi.unstubAllGlobals());

describe("GLEIF legal-entity client", () => {
  it("maps supplier locations to legal-address country codes", () => {
    expect(gleifCountryCode("Germany")).toBe("DE");
    expect(gleifCountryCode("Vietnam")).toBe("VN");
    expect(gleifCountryCode("Unknown")).toBeUndefined();
  });

  it("uses an exact legal-name and country filter, then maps a returned record", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      meta: { pagination: { total: 1 } },
      data: [{
        id: "529900T8BM49AURSDO55",
        attributes: {
          entity: {
            legalName: { name: "Example GmbH" },
            legalAddress: { addressLines: ["Example Strasse 1"], city: "Berlin", country: "DE", postalCode: "10115" },
            jurisdiction: "DE",
            status: "ACTIVE",
          },
          registration: { status: "ISSUED", nextRenewalDate: "2027-01-01T00:00:00Z" },
        },
      }],
    }), { status: 200 }));
    const result = await searchGleifLegalEntity("Example GmbH", "Germany", fetchMock);

    const url = new URL(fetchMock.mock.calls[0][0] as URL);
    expect(url.searchParams.get("filter[entity.legalName]")).toBe("Example GmbH");
    expect(url.searchParams.get("filter[entity.legalAddress.country]")).toBe("DE");
    expect(result.total).toBe(1);
    expect(result.entity).toMatchObject({ lei: "529900T8BM49AURSDO55", legalName: "Example GmbH", entityStatus: "ACTIVE" });
  });

  it("returns an honest no-match result", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      meta: { pagination: { total: 0 } }, data: [],
    }), { status: 200 }));

    await expect(searchGleifLegalEntity("No Such Supplier", "Vietnam", fetchMock)).resolves.toEqual({ total: 0, entity: undefined });
  });
});
