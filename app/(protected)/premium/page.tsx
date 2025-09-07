// app/premium/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/insights-ui";

/* ============ CONFIG ============ */
const COLORS = ["#3b82f6","#ef4444","#22c55e","#a855f7","#f59e0b"]; // max 5 term
const MAX_TERMS = 5;
const PROVINSI = [
  "Aceh","Sumatera Utara","Sumatera Barat","Riau","Jambi","Sumatera Selatan","Bengkulu","Lampung",
  "DKI Jakarta","Jawa Barat","Jawa Tengah","DI Yogyakarta","Jawa Timur","Banten","Bali","NTB","NTT",
  "Kalimantan Barat","Kalimantan Timur","Sulawesi Selatan"
];
type Range = "7d"|"30d"|"90d"|"12m";

/* ============ MOCK DATA (deterministik dari teks) ============ */
/** buat angka yang konsisten per kata, tanpa server */
function seed(str:string){ let h=0; for (let i=0;i<str.length;i++) h=(h*31+str.charCodeAt(i))>>>0; return h||1; }
function rnd(seed:number){ // mulberry32
  return () => ( (seed = (seed + 0x6D2B79F5) | 0, ((seed ^ (seed >>> 15)) * (1 | seed)) >>> 0) / 2**32 );
}
/** bikin bulan/minggu label sesuai range */
function labels(range:Range){
  const now = new Date();
  const pts = range==="7d"?7:range==="30d"?30:range==="90d"?13:12; // 90d=13 minggu
  const arr:string[]=[];
  if(range==="90d"){ // minggu
    for(let i=pts-1;i>=0;i--) arr.push(`M-${i}`);
  }else if(range==="7d" || range==="30d"){ // hari
    for(let i=pts-1;i>=0;i--){
      const d=new Date(now); d.setDate(now.getDate()-i);
      arr.push(`${d.getMonth()+1}/${d.getDate()}`);
    }
  }else{ // 12m
    for(let i=11;i>=0;i--){
      const d=new Date(now); d.setMonth(now.getMonth()-i);
      arr.push(d.toLocaleString("id-ID",{month:"short"}));
    }
  }
  return arr;
}
/** interest over time: 0..100 skala like trends */
function seriesForTerm(term:string, range:Range){
  const r = rnd(seed(term+range));
  const xs = labels(range);
  let base = 40 + Math.floor(r()*40); // baseline
  return xs.map((label,i)=>{
    base = Math.max(10, Math.min(100, base + Math.floor(r()*14-7))); // random walk
    // sedikit musiman
    const seasonal = range==="12m" ? Math.round(8*Math.sin(i/2)) : 0;
    const value = Math.max(0, Math.min(100, base + seasonal));
    return { time: label, value };
  });
}
/** interest by region untuk 1 term (top 10) */
function regionsForTerm(term:string){
  const rand = rnd(seed("region-"+term));
  const data = PROVINSI.map(p=>({ region:p, value: Math.round(20 + rand()*80) }));
  return data.sort((a,b)=>b.value-a.value).slice(0,10);
}
/** related queries */
function relatedQueries(term:string){
  const base = term.toLowerCase().replace(/\s+/g,"-");
  const r = rnd(seed("rq-"+term));
  const mk = (i:number)=>({
    query: `${term} ${["adalah","tradisi","asal","sejarah","contoh","festival","lagu","makanan","tarian","musik"][i%10]}`,
    value: Math.round(50 + r()*50),
    growth: Math.round(30 + r()*160), // %
  });
  const top = Array.from({length:8},(_,i)=>mk(i)).sort((a,b)=>b.value-a.value);
  const rising = Array.from({length:8},(_,i)=>mk(i+8)).sort((a,b)=>b.growth-a.growth);
  return { top, rising };
}

/* ============ UI ============ */
type Term = { label:string; color:string };

export default function TrendsOverview() {
  const [terms, setTerms] = useState<Term[]>([
    { label:"kuliner khas", color: COLORS[0] },
    { label:"adat istiadat", color: COLORS[1] },
  ]);
  const [input, setInput] = useState("");
  const [range, setRange] = useState<Range>("12m");
  const [active, setActive] = useState(0); // index term yang dipakai untuk "region" + "related"

  const canAdd = input.trim().length>0 && terms.length<MAX_TERMS && !terms.some(t=>t.label.toLowerCase()===input.trim().toLowerCase());

  const timeData = useMemo(()=>{
    const xs = labels(range);
    // gabung semua term ke satu dataset utk LineChart (field per term)
    const rows = xs.map(x=>({ time:x } as any));
    terms.forEach((t)=>{
      const s = seriesForTerm(t.label, range);
      s.forEach((p,i)=> rows[i][t.label] = p.value);
    });
    return rows;
  },[terms,range]);

  const regionData = useMemo(()=> regionsForTerm(terms[active]?.label ?? "all"),[terms,active]);
  const rq = useMemo(()=> relatedQueries(terms[active]?.label ?? "all"),[terms,active]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle>Overview · Google-Trends-style</CardTitle>
          <p className="text-xs text-gray-500 dark:text-gray-400">Bandingkan minat pencarian beberapa topik, lihat wilayah teratas, dan kueri terkait.</p>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {terms.map((t,i)=>(
                <span key={t.label} className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs border cursor-pointer ${i===active?"border-blue-500":"border-gray-300"}`}
                      onClick={()=>setActive(i)}>
                  <span className="w-2.5 h-2.5 rounded-sm" style={{background:t.color}} />
                  {t.label}
                  <button className="ml-1 text-gray-400 hover:text-red-500"
                          onClick={(e)=>{e.stopPropagation(); setTerms(s=>s.filter(x=>x.label!==t.label)); setActive(0);}}>
                    ×
                  </button>
                </span>
              ))}
              <form
                onSubmit={(e)=>{ e.preventDefault(); if(canAdd){ setTerms(s=>[...s,{label:input.trim(), color: COLORS[s.length%COLORS.length]}]); setInput(""); }}}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e)=>setInput(e.target.value)}
                  placeholder={terms.length>=MAX_TERMS ? "Maks 5 kata kunci" : "Tambah kata kunci…"}
                  disabled={terms.length>=MAX_TERMS}
                  className="h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm px-2"
                />
                <button
                  type="submit"
                  disabled={!canAdd}
                  className={`h-8 px-3 rounded-md text-xs ${canAdd?"bg-blue-600 text-white":"bg-gray-200 text-gray-500"}`}
                >
                  Tambah
                </button>
              </form>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600 dark:text-gray-400">Rentang</label>
              <select
                value={range}
                onChange={(e)=>setRange(e.target.value as Range)}
                className="h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs px-2"
              >
                <option value="7d">7 hari</option>
                <option value="30d">30 hari</option>
                <option value="90d">90 hari</option>
                <option value="12m">12 bulan</option>
              </select>
            </div>
          </div>

          {/* Interest over time */}
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tickLine={false} axisLine={false} />
                <YAxis width={40} domain={[0,100]} />
                {terms.map((t)=>(
                  <Line key={t.label} type="monotone" dataKey={t.label} stroke={t.color} strokeWidth={2.5} dot={false}
                        activeDot={{ r:5, fill:t.color, stroke:"#fff", strokeWidth:2 }} />
                ))}
                <Tooltip<number,string> formatter={(v,n)=>[`${v}`, String(n)]} />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Interest by region + Related queries */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle>Interest by region · <span className="text-blue-600">{terms[active]?.label ?? "-"}</span></CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionData} layout="vertical" margin={{ left: 12, right: 12 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0,100]} />
                      <YAxis type="category" dataKey="region" width={160} />
                      <Tooltip<number,string> formatter={(v)=>[`${v}`, "Skor"]} />
                      <Bar dataKey="value" fill={terms[active]?.color ?? COLORS[0]} radius={[4,4,4,4]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle>Related queries · <span className="text-blue-600">{terms[active]?.label ?? "-"}</span></CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <TabsRQ top={rq.top} rising={rq.rising} />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ===== Related Queries Tabs ===== */
function TabsRQ({ top, rising }:{ top:{query:string;value:number}[]; rising:{query:string;growth:number}[]; }){
  const [tab,setTab] = useState<"top"|"rising">("top");
  return (
    <div>
      <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
        <button onClick={()=>setTab("top")}
          className={`px-3 py-1 text-xs ${tab==="top"?"bg-gray-100":"bg-white"}`}>Top</button>
        <button onClick={()=>setTab("rising")}
          className={`px-3 py-1 text-xs ${tab==="rising"?"bg-gray-100":"bg-white"}`}>Rising</button>
      </div>

      {tab==="top" ? (
        <table className="mt-3 w-full text-sm">
          <thead className="text-xs text-gray-500">
            <tr><th className="text-left py-1">Query</th><th className="text-right py-1 pr-2">Skor</th></tr>
          </thead>
          <tbody>
            {top.map((r,i)=>(
              <tr key={i} className="border-t">
                <td className="py-2">{r.query}</td>
                <td className="py-2 text-right pr-2">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="mt-3 w-full text-sm">
          <thead className="text-xs text-gray-500">
            <tr><th className="text-left py-1">Query</th><th className="text-right py-1 pr-2">Rising</th></tr>
          </thead>
          <tbody>
            {rising.map((r,i)=>(
              <tr key={i} className="border-t">
                <td className="py-2">{r.query}</td>
                <td className="py-2 text-right pr-2">+{r.growth}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
