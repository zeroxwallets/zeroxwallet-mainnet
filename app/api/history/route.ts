import { NextResponse } from "next/server";
import admin from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { uid } = await req.json();
    if (!uid) {
      return NextResponse.json({ error: "Missing fields: uid" }, { status: 400 });
    }

    const snap = await admin.firestore().collection("users").doc(uid).get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    const { accountId } = snap.data() as { accountId: string; privateKey: string };

    const url = `https://testnet.mirrornode.hedera.com/api/v1/transactions?account.id=${accountId}&order=desc&limit=10`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Mirror node error: ${res.status}`);
    }

    const json = await res.json();
    const history =
      (json.transactions ?? []).map((t: any) => ({
        id: t.transaction_id,
        consensusTimestamp: t.consensus_timestamp,
        transfers: (t.transfers ?? []).map((tr: any) => ({
          account: tr.account,
          amount: tr.amount, // still in tinybars
        })),
      })) ?? [];

    return NextResponse.json({ history });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}