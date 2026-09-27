import { Building2, ExternalLink } from "lucide-react";
import { Incident, LegalEntityCheck } from "@/schemas/core";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isSafeNavigationUrl } from "@/lib/utils";

const variant = (status: LegalEntityCheck["status"]) =>
  status === "MATCH" ? "success" : status === "NO_MATCH" ? "muted" : "warning";

export function LegalEntityChecks({ incident }: { incident: Incident }) {
  const checks = incident.legalEntityChecks ?? [];
  if (checks.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base"><Building2 className="h-4 w-4 text-primary" /> Legal-entity evidence</CardTitle>
        <Badge variant="success">GLEIF · PUBLIC</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        {checks.map((check) => (
          <article key={check.supplierId} className="rounded-md border p-3 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium">{check.queryName}</p>
                <p className="mt-1 text-xs text-muted-foreground">{check.note}</p>
              </div>
              <Badge variant={variant(check.status)}>{check.status.replace("_", " ")}</Badge>
            </div>
            {check.status === "MATCH" && (
              <div className="mt-3 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                <p><span className="font-medium text-foreground">LEI:</span> {check.lei}</p>
                <p><span className="font-medium text-foreground">Entity:</span> {check.legalName}</p>
                {check.jurisdiction && <p><span className="font-medium text-foreground">Jurisdiction:</span> {check.jurisdiction}</p>}
                {check.registrationStatus && <p><span className="font-medium text-foreground">Registration:</span> {check.registrationStatus}</p>}
                {check.legalAddress && <p className="sm:col-span-2"><span className="font-medium text-foreground">Registered address:</span> {check.legalAddress}</p>}
              </div>
            )}
            {check.sourceUrl && isSafeNavigationUrl(check.sourceUrl) && (
              <a href={check.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                Open GLEIF record <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </article>
        ))}
        <p className="text-xs text-muted-foreground">A missing LEI is not a risk finding. Warp records it as neutral rather than inferring that a supplier is illegitimate.</p>
      </CardContent>
    </Card>
  );
}
