// app/api/openapi/route.ts
import { NextResponse } from "next/server";
import { endpointDocs } from "@/lib/api-docs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const paths: any = {};

  for (const e of endpointDocs) {
    const path = e.path.replace(/\{(\w+)\}/g, "{$1}");
    paths[path] ??= {};
    const op: any = {
      summary: e.title,
      description: e.description,
      parameters: [],
      responses: {
        200: {
          description: "OK",
          content: { "application/json": { example: e.responseExample ?? { ok: true } } },
        },
      },
    };
    if (e.params) {
      for (const p of e.params) {
        op.parameters.push({
          name: p.name,
          in: "path",
          required: p.required ?? true,
          schema: { type: "string" },
          description: p.desc,
          example: p.example,
        });
      }
    }
    if (e.query) {
      for (const q of e.query) {
        op.parameters.push({
          name: q.name,
          in: "query",
          required: q.required ?? false,
          schema: { type: "string" },
          description: q.desc,
          example: q.example,
        });
      }
    }
    if (e.bodyExample) {
      op.requestBody = {
        required: true,
        content: { "application/json": { example: e.bodyExample } },
      };
    }
    paths[path][e.method.toLowerCase()] = op;
  }

  const spec = {
    openapi: "3.0.3",
    info: {
      title: "PUSH API",
      version: "1.0.0",
      description: "Dokumentasi OpenAPI untuk endpoint demo PUSH.",
    },
    servers: [{ url: "" }],
    paths,
  };

  return NextResponse.json(spec);
}
