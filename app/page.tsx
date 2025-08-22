// app/page.tsx (client area snippet)
"use client";
import useSWR from "swr";
import { ABTrial } from "../components/ABTrial";

type Candidate = { label: "Fitted" | "Lufs"; url: string };
type Test1Item = { n: number; reference: string; candidates: Candidate[] };
type Test2Item = { n: number; pairs: Candidate[] };
type Manifest = { test1: Test1Item[]; test2: Test2Item[] };


const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function HomePage() {
    const { data } = useSWR<Manifest>("/api/manifest", fetcher);

    if (!data) return <div className="p-8">Loading…</div>;

    return (
        <main className="max-w-4xl mx-auto p-6 space-y-10">
            <section>
                <h1 className="text-2xl font-bold mb-2">Test 1 · Loudness match</h1>
                <p className="text-gray-600 mb-4">Pick which one matches the reference loudness best.</p>
                {data.test1.map((item: Test1Item) => (
                    <div key={`t1-${item.n}`} className="mb-6">
                        <ABTrial mode="t1" item={item} />
                    </div>
                ))}
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-2">Test 2 · Vocal balance</h2>
                <p className="text-gray-600 mb-4">Pick which acapella feels more balanced in the mix.</p>
                {data.test2.map((item: Test2Item) => (
                    <div key={`t2-${item.n}`} className="mb-6">
                        <ABTrial mode="t2" item={item} />
                    </div>
                ))}
            </section>
        </main>
    );
}
