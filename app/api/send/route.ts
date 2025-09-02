import { NextResponse } from "next/server";
import { TransferTransaction, AccountId, Hbar } from "@hashgraph/sdk";
import client from "../../../lib/hedera";

export async function POST(req: Request) {
  try {
    const { to, amount } = await req.json();

    if (!to || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 🟢 Transaction create karo
    const transaction = new TransferTransaction()
      .addHbarTransfer(client.operatorAccountId!, new Hbar(-amount)) // sender
      .addHbarTransfer(AccountId.fromString(to), new Hbar(amount)); // receiver

    // 🟢 Execute karo
    const txResponse = await transaction.execute(client);

    // 🟢 Receipt lao
    const receipt = await txResponse.getReceipt(client);

    return NextResponse.json({
      status: receipt.status.toString(),
      transactionId: txResponse.transactionId.toString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}