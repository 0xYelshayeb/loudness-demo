// app/api/manifest/route.ts
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

type Test1Item = {
  n: number;
  reference: string;
  candidates: { label: "Fitted" | "Lufs"; url: string }[];
};
type Test2Item = {
  n: number;
  pairs: { label: "Fitted" | "Lufs"; url: string }[];
};

export async function GET() {
  const audioDir = path.join(process.cwd(), "public", "audio");
  const files = new Set(fs.readdirSync(audioDir));

  const test1: Test1Item[] = [];
  const test2: Test2Item[] = [];

  // Find all n by pattern presence
  const ns = new Set<number>();
  for (const f of files) {
    const m1 = f.match(/^Reference_(\d+)\.wav$/i);
    const m2 = f.match(/^Fitted_(\d+)\.wav$/i);
    const m3 = f.match(/^Lufs_(\d+)\.wav$/i);
    const m4 = f.match(/^Loop_(\d+)_Fitted\.wav$/i);
    const m5 = f.match(/^Loop_(\d+)_Lufs\.wav$/i);
    [m1, m2, m3, m4, m5].forEach(m => { if (m) ns.add(Number(m[1])); });
  }

  // Build items only if a set is complete
  for (const n of Array.from(ns).sort((a,b)=>a-b)) {
    const ref = `Reference_${n}.wav`;
    const fit = `Fitted_${n}.wav`;
    const luf = `Lufs_${n}.wav`;
    if (files.has(ref) && files.has(fit) && files.has(luf)) {
      test1.push({
        n,
        reference: `/audio/${ref}`,
        candidates: [
          { label: "Fitted", url: `/audio/${fit}` },
          { label: "Lufs",   url: `/audio/${luf}` },
        ],
      });
    }
    const loopF = `Loop_${n}_Fitted.wav`;
    const loopL = `Loop_${n}_Lufs.wav`;
    if (files.has(loopF) && files.has(loopL)) {
      test2.push({
        n,
        pairs: [
          { label: "Fitted", url: `/audio/${loopF}` },
          { label: "Lufs",   url: `/audio/${loopL}` },
        ],
      });
    }
  }

  return NextResponse.json({ test1, test2 });
}
