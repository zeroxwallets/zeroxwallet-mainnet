import { NextResponse } from "next/server";
import { TransferTransaction, AccountId, Hbar } from "@hashgraph/sdk";
import client from "../../../lib/hedera";

export async function POST(req: Request) {
  try {
    const { accountId, amount } = await req.json();

    if (!accountId || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // ✅ Create transaction
    const transaction = new TransferTransaction()
      .addHbarTransfer(client.operatorAccountId, new Hbar(-amount)) // sender
      .addHbarTransfer(AccountId.fromString(accountId), new Hbar(amount)); // receiver

    // ✅ Execute karo
    const txResponse = await transaction.execute(client);

    // ✅ Receipt lao
    const receipt = await txResponse.getReceipt(client);

    return NextResponse.json({
      status: receipt.status.toString(),
      transactionId: txResponse.transactionId.toString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}