const BASE_URL = "https://api.gleif.org/api/v1";
export const GLEIF_LEI_RECORDS_ENDPOINT = `${BASE_URL}/lei-records`;

export interface GleifLegalEntity {
  lei: string;
  legalName: string;
  legalAddress?: string;
  jurisdiction?: string;
  entityStatus?: string;
  registrationStatus?: string;
  nextRenewalDate?: string;
  sourceUrl: string;
}

type GleifResponse = {
  data?: Array<{
    id?: string;
    attributes?: {
      entity?: {
        legalName?: { name?: string };
        legalAddress?: { addressLines?: string[]; city?: string; region?: string; country?: string; postalCode?: string };
        jurisdiction?: string;
        status?: string;
      };
      registration?: { status?: string; nextRenewalDate?: string };
    };
  }>;
};

const countryCodes: Record<string, string> = {
  china: "CN",
  germany: "DE",
  vietnam: "VN",
  "united kingdom": "GB",
  "united states": "US",
  usa: "US",
};

export function gleifCountryCode(location: string): string | undefined {
  return countryCodes[location.trim().toLowerCase()];
}

function toLegalEntity(record: NonNullable<GleifResponse["data"]>[number]): GleifLegalEntity | null {
  const lei = record.id;
  const entity = record.attributes?.entity;
  const legalName = entity?.legalName?.name;
  if (!lei || !legalName) return null;

  const address = entity.legalAddress;
  const legalAddress = [
    ...(address?.addressLines ?? []),
    address?.city,
    address?.region,
    address?.country,
    address?.postalCode,
  ].filter((part): part is string => Boolean(part)).join(", ") || undefined;

  return {
    lei,
    legalName,
    legalAddress,
    jurisdiction: entity.jurisdiction,
    entityStatus: entity.status,
    registrationStatus: record.attributes?.registration?.status,
    nextRenewalDate: record.attributes?.registration?.nextRenewalDate,
    sourceUrl: `${GLEIF_LEI_RECORDS_ENDPOINT}/${encodeURIComponent(lei)}`,
  };
}

/** Search GLEIF's public LEI registry. It requires neither credentials nor a client-side key. */
export async function searchGleifLegalEntity(
  name: string,
  location: string,
  fetchImpl?: typeof fetch
): Promise<{ total: number; entity?: GleifLegalEntity }> {
  // Tests must inject a response rather than make a real public-network call.
  if (process.env.VITEST && !fetchImpl) throw new Error("GLEIF network disabled in tests");
  const url = new URL(GLEIF_LEI_RECORDS_ENDPOINT);
  url.searchParams.set("filter[entity.legalName]", name);
  const country = gleifCountryCode(location);
  if (country) url.searchParams.set("filter[entity.legalAddress.country]", country);
  url.searchParams.set("page[size]", "1");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await (fetchImpl ?? fetch)(url, { signal: controller.signal, cache: "no-store" });
    if (!response.ok) throw new Error(`GLEIF HTTP ${response.status}`);
    const body = await response.json() as GleifResponse & { meta?: { pagination?: { total?: number } } };
    return {
      total: body.meta?.pagination?.total ?? body.data?.length ?? 0,
      entity: body.data?.map(toLegalEntity).find((entity): entity is GleifLegalEntity => entity !== null),
    };
  } finally {
    clearTimeout(timeout);
  }
}
