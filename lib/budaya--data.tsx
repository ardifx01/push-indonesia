export type Category = { category: string; sales: number; growth: number; items: number; target: number; color: string };
export type Trafik = { name: string; value: number };
export type DetailedItem = { id: number; category: string; item: string; value: number; region: string; growth: number; revenue?: number };

export const kategoriBudaya: Category[] = [
  { category: "Tari Tradisional", sales: 1200, growth: 18.6, items: 58, target: 1500, color: "#60a5fa" },
  { category: "Musik Daerah",    sales: 950,  growth: 12.1, items: 47, target: 1100, color: "#a855f7" },
  { category: "Kuliner Heritage", sales: 1780, growth: 21.4, items: 76, target: 1800, color: "#f59e0b" },
  { category: "Batik & Tenun",   sales: 1420, growth: 9.8,  items: 64, target: 1600, color: "#22c55e" },
  { category: "Upacara Adat",    sales: 840,  growth: 7.2,  items: 33, target: 1000, color: "#ef4444" },
];

export const kunjunganBulanan = [
  { month: "Jan", value: 12000 }, { month: "Feb", value: 14300 }, { month: "Mar", value: 16250 },
  { month: "Apr", value: 15100 }, { month: "May", value: 17750 }, { month: "Jun", value: 19880 },
  { month: "Jul", value: 21320 }, { month: "Aug", value: 22990 }, { month: "Sep", value: 24200 },
  { month: "Oct", value: 25080 }, { month: "Nov", value: 26310 }, { month: "Dec", value: 29120 },
];

export const sumberDataSekunder = [
  { id: 1, title: "BPS: Indeks Pembangunan Kebudayaan 2023", org: "BPS", url: "#", summary: "Tren IPK nasional & provinsi, komponen literasi dan ketahanan budaya." },
  { id: 2, title: "UNESCO: Heritage Sites Indonesia", org: "UNESCO", url: "#", summary: "Daftar situs warisan dunia & status pelestarian." },
  { id: 3, title: "Kemendikbudristek: Data Cagar Budaya", org: "Kemendikbudristek", url: "#", summary: "Registrasi cagar budaya & persebaran." },
];

export const tabelDetail: DetailedItem[] = [
  { id: 1, category: "Kuliner Heritage", item: "Rawon",          value: 520, region: "Jatim", growth: 14.2, revenue: 78000000 },
  { id: 2, category: "Batik & Tenun",    item: "Batik Madura",   value: 310, region: "Jatim", growth: 9.1,  revenue: 46500000 },
  { id: 3, category: "Tari Tradisional", item: "Reog Ponorogo",  value: 260, region: "Jatim", growth: 17.3 },
  { id: 4, category: "Musik Daerah",     item: "Gamelan Jawa",   value: 440, region: "DIY",   growth: 12.6 },
  { id: 5, category: "Upacara Adat",     item: "Kasada",         value: 180, region: "Jatim", growth: 6.5 },
];

export const trafikSumber: Trafik[] = [
  { name: "Organic",   value: 52 },
  { name: "Referensi", value: 19 },
  { name: "Sosial",    value: 17 },
  { name: "Berbayar",  value: 12 },
];
