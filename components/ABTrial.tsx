// components/ABTrial.tsx
"use client";
import { useRef, useState } from "react";

type Candidate = { label: "Fitted" | "Lufs"; url: string };
type Test1Item = { n: number; reference: string; candidates: Candidate[] };
type Test2Item = { n: number; pairs: Candidate[] };

export function ABTrial({
    mode,
    item,
}: {
    mode: "t1" | "t2";
    item: Test1Item | Test2Item;
}) {
    const [mapping] = useState(() => {
        // Randomize which is "1" vs "2"
        const [a, b] = mode === "t1" ? (item as Test1Item).candidates : (item as Test2Item).pairs;
        return Math.random() < 0.5
            ? { one: a, two: b }
            : { one: b, two: a };
    });

    // Simple preload
    const audioRefs = {
        ref: useRef<HTMLAudioElement>(null),
        one: useRef<HTMLAudioElement>(null),
        two: useRef<HTMLAudioElement>(null),
    };

    const [played, setPlayed] = useState({ one: false, two: false });
    const canVote = played.one && played.two;

    const play = (which: "ref" | "one" | "two") => {
        const el = audioRefs[which].current;
        if (el) { el.currentTime = 0; el.play(); }
        if (which === "one") setPlayed(p => ({ ...p, one: true }));
        if (which === "two") setPlayed(p => ({ ...p, two: true }));
    };

    const vote = async (choice: "1" | "2" | "tie") => {
        await fetch("/api/vote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                test: mode,
                n: item.n, // <-- was (item as any).n
                choice,
                mapping: { one: mapping.one.label, two: mapping.two.label },
            }),
        });
        alert("Thanks! Vote recorded.");
    };

    return (
        <div className="space-y-4 p-4 rounded-2xl shadow">
            {mode === "t1" && (
                <div className="space-y-2">
                    <div className="font-medium">Reference</div>
                    <audio ref={audioRefs.ref} src={(item as Test1Item).reference} controls preload="auto" />
                    <button className="px-3 py-2 rounded bg-gray-200" onClick={() => play("ref")}>▶ Play reference</button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <div className="font-medium">1</div>
                    <audio ref={audioRefs.one} src={mapping.one.url} controls preload="auto" />
                    <button className="px-3 py-2 rounded bg-gray-200" onClick={() => play("one")}>▶ Play 1</button>
                </div>
                <div className="space-y-2">
                    <div className="font-medium">2</div>
                    <audio ref={audioRefs.two} src={mapping.two.url} controls preload="auto" />
                    <button className="px-3 py-2 rounded bg-gray-200" onClick={() => play("two")}>▶ Play 2</button>
                </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
                <button disabled={!canVote} className="px-3 py-2 rounded bg-black text-white disabled:opacity-50" onClick={() => vote("1")}>1 better</button>
                <button disabled={!canVote} className="px-3 py-2 rounded bg-black text-white disabled:opacity-50" onClick={() => vote("2")}>2 better</button>
                <button disabled={!canVote} className="px-3 py-2 rounded bg-gray-800 text-white disabled:opacity-50" onClick={() => vote("tie")}>no difference</button>
                {!canVote && <span className="text-sm text-gray-500">play both 1 & 2 to enable voting</span>}
            </div>

            <div className="text-xs text-gray-500">
                (Under the hood: 1 = {mapping.one.label}, 2 = {mapping.two.label})
            </div>
        </div>
    );
}
