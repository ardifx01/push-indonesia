import { EndpointDoc } from "@/components/api/EndpointCard";

export const endpointDocs: EndpointDoc[] = [
  /* ---------- Categories ---------- */
  {
    method: "GET",
    path: "/api/budaya/categories",
    title: "List Categories",
    description: "Ambil semua kategori budaya (nama, warna, target, dll).",
    responseExample: {
      data: [
        { id: "seni-pertunjukan", category: "Seni Pertunjukan", sales: 8200, growth: 15.2, items: 450, target: 9000, color: "#60a5fa" }
      ]
    }
  },
  {
    method: "POST",
    path: "/api/budaya/categories",
    title: "Create Category",
    description: "Buat kategori baru.",
    bodyExample: { category: "Bahasa Daerah", sales: 0, growth: 0, items: 0, target: 100, color: "#22c55e" },
    responseExample: { data: { id: "bahasa-daerah", category: "Bahasa Daerah", sales: 0, growth: 0, items: 0, target: 100, color: "#22c55e" } }
  },
  {
    method: "PUT",
    path: "/api/budaya/categories/{id}",
    title: "Update Category",
    description: "Perbarui kategori berdasarkan ID (slug).",
    params: [{ name: "id", required: true, desc: "slug kategori", example: "seni-pertunjukan" }],
    bodyExample: { target: 12000, color: "#0ea5e9" },
    responseExample: { data: { id: "seni-pertunjukan", category: "Seni Pertunjukan", sales: 8200, growth: 15.2, items: 450, target: 12000, color: "#0ea5e9" } }
  },
  {
    method: "DELETE",
    path: "/api/budaya/categories/{id}",
    title: "Delete Category",
    description: "Hapus kategori.",
    params: [{ name: "id", required: true, desc: "slug kategori", example: "bahasa-daerah" }],
    responseExample: { ok: true }
  },

  /* ---------- Items (Primer) ---------- */
  {
    method: "GET",
    path: "/api/budaya/items",
    title: "List Items (Primer)",
    description: "Ambil item primer (bisa filter kategori / keyword).",
    query: [
      { name: "category", desc: "filter nama kategori", example: "Seni Pertunjukan" },
      { name: "q", desc: "pencarian bebas", example: "tari" }
    ],
    responseExample: {
      data: [
        { id: 1, category: "Seni Pertunjukan", item: "Tari Tradisional", value: 1450, region: "DIY", growth: 12.3 }
      ]
    }
  },
  {
    method: "POST",
    path: "/api/budaya/items",
    title: "Create Item",
    description: "Tambah satu item primer.",
    bodyExample: { category: "Seni Pertunjukan", item: "Wayang Kulit", value: 980, region: "DIY", growth: 10.5 },
    responseExample: { data: { id: 99, category: "Seni Pertunjukan", item: "Wayang Kulit", value: 980, region: "DIY", growth: 10.5 } }
  },
  {
    method: "PUT",
    path: "/api/budaya/items/{id}",
    title: "Update Item",
    description: "Perbarui item primer berdasarkan ID.",
    params: [{ name: "id", required: true, desc: "ID numeric", example: "99" }],
    bodyExample: { value: 1100, growth: 12.1 },
    responseExample: { data: { id: 99, category: "Seni Pertunjukan", item: "Wayang Kulit", value: 1100, region: "DIY", growth: 12.1 } }
  },
  {
    method: "DELETE",
    path: "/api/budaya/items/{id}",
    title: "Delete Item",
    description: "Hapus item primer.",
    params: [{ name: "id", required: true, desc: "ID numeric", example: "99" }],
    responseExample: { ok: true }
  },

  /* ---------- Contributions (Moderation) ---------- */
  {
    method: "GET",
    path: "/api/contributions",
    title: "List Contributions",
    description: "Ambil semua kontribusi komunitas untuk moderasi.",
    responseExample: {
      data: [
        { id: 101, title: "Upacara Adat Wiwitan", category: "Adat Istiadat", region: "DIY", contributor: "Komunitas Tani Sleman", status: "pending", attachments: 3, createdAt: "2025-08-19T00:00:00.000Z" }
      ]
    }
  },
  {
    method: "PATCH",
    path: "/api/contributions/{id}",
    title: "Set Contribution Status",
    description: "Setujui / tolak / pending kontribusi.",
    params: [{ name: "id", required: true, desc: "ID numeric", example: "101" }],
    bodyExample: { status: "approved" },
    responseExample: { data: { id: 101, status: "approved" } }
  }
];
