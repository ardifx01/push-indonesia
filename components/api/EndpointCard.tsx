"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/insights-ui";
import CodeBlock from "./CodeBlock";
import { Loader2, Play, ChevronDown } from "lucide-react";

type Param = { name: string; required?: boolean; desc?: string; example?: string };
export type EndpointDoc = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;                     // ex: /api/budaya/items
  title: string;
  description?: string;
  query?: Param[];
  params?: Param[];                 // path params
  bodyExample?: any;                // JSON example
  responseExample?: any;            // JSON example
};

function substitutePath(path: string, values: Record<string, string>) {
  return path.replace(/\{(\w+)\}/g, (_, k) => encodeURIComponent(values[k] ?? ""));
}

export default function EndpointCard({
  doc,
  baseUrl,
  defaultHeaders,
}: {
  doc: EndpointDoc;
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);

  // form state
  const [pathVals, setPathVals] = useState<Record<string, string>>(
    Object.fromEntries((doc.params ?? []).map((p) => [p.name, p.example ?? ""]))
  );
  const [queryVals, setQueryVals] = useState<Record<string, string>>(
    Object.fromEntries((doc.query ?? []).map((q) => [q.name, q.example ?? ""]))
  );
  const [body, setBody] = useState<string>(doc.bodyExample ? JSON.stringify(doc.bodyExample, null, 2) : "");
  const [sending, setSending] = useState(false);
  const [resp, setResp] = useState<{ status: number; ms: number; json?: any; error?: string }>();

  const fullPath = useMemo(() => substitutePath(doc.path, pathVals), [doc.path, pathVals]);
  const queryString = useMemo(() => {
    const entries = Object.entries(queryVals).filter(([, v]) => v !== "" && v != null);
    if (!entries.length) return "";
    const usp = new URLSearchParams(entries as any).toString();
    return `?${usp}`;
  }, [queryVals]);

  const url = `${baseUrl}${fullPath}${queryString}`;

  const curl = (() => {
    const method = doc.method;
    let c = `curl -X ${method} '${url}'`;
    const headers = defaultHeaders ?? {};
    for (const [k, v] of Object.entries(headers)) {
      c += ` \\\n  -H '${k}: ${v}'`;
    }
    if (doc.bodyExample && body.trim()) {
      c += ` \\\n  -H 'Content-Type: application/json' \\\n  -d '${body.replaceAll("'", `'"'"'`)}'`;
    }
    return c;
  })();

  const fetchTs = `await fetch("${url}", {
  method: "${doc.method}",
  headers: { "Content-Type": "application/json"${Object.entries(defaultHeaders ?? {})
    .map(([k, v]) => `, "${k}": "${v}"`)
    .join("")} },
  ${doc.bodyExample && body.trim() ? `body: ${body.replace(/\n/g, "\n  ")}` : ""}
}).then(r => r.json());`;

  const send = async () => {
    setSending(true);
    setResp(undefined);
    const t0 = performance.now();
    try {
      const init: RequestInit = {
        method: doc.method,
        headers: {
          ...(doc.bodyExample ? { "Content-Type": "application/json" } : {}),
          ...(defaultHeaders ?? {}),
        },
      };
      if (doc.bodyExample && body.trim() && doc.method !== "GET") {
        init.body = body;
      }
      const r = await fetch(url, init);
      const ms = Math.round(performance.now() - t0);
      let json: any = undefined;
      try {
        json = await r.json();
      } catch {
        // ignore non-JSON
      }
      setResp({ status: r.status, ms, json });
    } catch (e: any) {
      const ms = Math.round(performance.now() - t0);
      setResp({ status: 0, ms, error: e?.message ?? "Network error" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
              doc.method === "GET"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                : doc.method === "POST"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                : doc.method === "PUT"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                : doc.method === "PATCH"
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
            }`}
          >
            {doc.method}
          </span>
          <CardTitle className="text-sm">{doc.title}</CardTitle>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500">{doc.path}</p>
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition ${open ? "rotate-180" : ""}`} />
            {open ? "Sembunyikan Try it" : "Buka Try it"}
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-5">
        {doc.description && (
          <p className="text-sm text-gray-700 dark:text-gray-300">{doc.description}</p>
        )}

        {/* Parameters */}
        {(doc.params?.length || doc.query?.length) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doc.params?.length ? (
              <div>
                <h4 className="text-xs font-semibold mb-2 text-gray-600 dark:text-gray-300">Path Params</h4>
                <div className="space-y-2">
                  {doc.params.map((p) => (
                    <div key={p.name} className="text-sm">
                      <label className="block text-xs text-gray-500 mb-1">
                        {p.name} {p.required && <span className="text-rose-500">*</span>}
                      </label>
                      <input
                        value={pathVals[p.name] ?? ""}
                        onChange={(e) => setPathVals((s) => ({ ...s, [p.name]: e.target.value }))}
                        placeholder={p.example ?? ""}
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                      />
                      {p.desc && <div className="text-xs text-gray-500 mt-1">{p.desc}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {doc.query?.length ? (
              <div>
                <h4 className="text-xs font-semibold mb-2 text-gray-600 dark:text-gray-300">Query</h4>
                <div className="space-y-2">
                  {doc.query.map((q) => (
                    <div key={q.name} className="text-sm">
                      <label className="block text-xs text-gray-500 mb-1">
                        {q.name} {q.required && <span className="text-rose-500">*</span>}
                      </label>
                      <input
                        value={queryVals[q.name] ?? ""}
                        onChange={(e) => setQueryVals((s) => ({ ...s, [q.name]: e.target.value }))}
                        placeholder={q.example ?? ""}
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                      />
                      {q.desc && <div className="text-xs text-gray-500 mt-1">{q.desc}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Try it */}
        {open && (
          <div className="space-y-4">
            {doc.bodyExample !== undefined && (
              <div>
                <h4 className="text-xs font-semibold mb-2 text-gray-600 dark:text-gray-300">Request Body (JSON)</h4>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={8}
                  className="w-full font-mono text-xs rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 p-3"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={send}
                disabled={sending}
                className="inline-flex items-center gap-2 px-3 py-2 rounded border border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-60"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Send {doc.method}
              </button>
              <span className="text-xs text-gray-500 break-all">{url}</span>
            </div>

            {resp && (
              <div className="space-y-2">
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  Status: <b>{resp.status}</b> · {resp.ms} ms
                  {resp.error && <span className="text-rose-500"> — {resp.error}</span>}
                </div>
                {resp.json && <CodeBlock code={JSON.stringify(resp.json, null, 2)} lang="json" />}
              </div>
            )}
          </div>
        )}

        {/* Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CodeBlock code={curl} lang="curl" />
          <CodeBlock code={fetchTs} lang="ts" />
        </div>

        {doc.responseExample && (
          <>
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-300">Contoh Response</h4>
            <CodeBlock code={JSON.stringify(doc.responseExample, null, 2)} lang="json" />
          </>
        )}
      </CardContent>
    </Card>
  );
}
