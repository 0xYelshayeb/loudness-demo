// app/stats/page.tsx (client component snippet)
"use client";
import useSWR from "swr";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const fetcher = (u:string)=>fetch(u).then(r=>r.json());

export default function StatsPage() {
  const { data } = useSWR("/api/stats", fetcher);
  if (!data) return <div className="p-8">Loading…</div>;

  const rows = [
    { test: "Test 1", one: data.t1.one, two: data.t1.two, tie: data.t1.tie },
    { test: "Test 2", one: data.t2.one, two: data.t2.two, tie: data.t2.tie },
  ];

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Live Results</h1>
      <BarChart width={700} height={360} data={rows}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="test" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="one" name="1 better" />
        <Bar dataKey="two" name="2 better" />
        <Bar dataKey="tie" name="no difference" />
      </BarChart>

      <div className="text-sm text-gray-600">
        Underlying picks so far: T1(Fitted {data.pickedUnderlying.t1.Fitted}, Lufs {data.pickedUnderlying.t1.Lufs}) ·
        T2(Fitted {data.pickedUnderlying.t2.Fitted}, Lufs {data.pickedUnderlying.t2.Lufs})
      </div>
    </main>
  );
}
