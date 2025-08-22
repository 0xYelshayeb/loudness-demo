// app/api/stats/route.ts
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";
import { currentVersion, k } from "../_lib/exp"; // add

export async function GET() {
    const v = await currentVersion();
    const keys = [
        k(v, "t1", "1"), k(v, "t1", "2"), k(v, "t1", "tie"),
        k(v, "t2", "1"), k(v, "t2", "2"), k(v, "t2", "tie"),
        k(v, "t1", "label", "Fitted"), k(v, "t1", "label", "Lufs"),
        k(v, "t2", "label", "Fitted"), k(v, "t2", "label", "Lufs"),
    ];
    // keep keys as-is
    const vals = (await kv.mget(...keys)) as Array<number | null>;
    const toNum = (x: number | null | undefined) => (typeof x === "number" ? x : 0);

    const data = {
        t1: { one: toNum(vals[0]), two: toNum(vals[1]), tie: toNum(vals[2]) },
        t2: { one: toNum(vals[3]), two: toNum(vals[4]), tie: toNum(vals[5]) },
        pickedUnderlying: {
            t1: { Fitted: toNum(vals[6]), Lufs: toNum(vals[7]) },
            t2: { Fitted: toNum(vals[8]), Lufs: toNum(vals[9]) },
        }
    };
    return NextResponse.json(data);
}
