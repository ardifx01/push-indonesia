"use client";

import { useEffect, useMemo, useState } from "react";
import EndpointCard from "./EndpointCard";
import { endpointDocs } from "@/lib/api-docs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/insights-ui";

export default function ApiDocs() {
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setBaseUrl(window.location.origin);
  }, []);

  const headers = useMemo(() => {
    return apiKey ? { "X-API-Key": apiKey } : undefined;
  }, [apiKey]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle>API Documentation · PUSH</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500">Base URL</label>
              <input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">
                X-API-Key <span className="text-gray-400">(opsional)</span>
              </label>
              <input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="isi kalau nanti auth diaktifkan"
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Semua request di “Try it” akan memakai Base URL & header di atas. OpenAPI JSON tersedia di{" "}
            <code className="px-1 rounded bg-gray-100 dark:bg-gray-800">/api/openapi</code>.
          </p>
        </CardContent>
      </Card>

      {endpointDocs.map((doc) => (
        <EndpointCard key={`${doc.method}-${doc.path}`} doc={doc} baseUrl={baseUrl} defaultHeaders={headers} />
      ))}
    </div>
  );
}
