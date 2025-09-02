import { NextResponse } from "next/server";
import {
  AccountBalanceQuery,
  Client,
  AccountId,
  TransferTransaction,
  TransactionId,
  AccountRecordsQuery,
} from "@hashgraph/sdk";

export async function GET() {
  try {
    const client = Client.forTestnet().setOperator(
      process.env.HEDERA_ACCOUNT_ID!,
      process.env.HEDERA_PRIVATE_KEY!
    );

    const records = await new AccountRecordsQuery()
      .setAccountId(process.env.HEDERA_ACCOUNT_ID!)
      .execute(client);

    const txns = records.slice(0, 5).map((record: any) => ({
      transactionId: record.transactionId.toString(),
      consensusTimestamp: record.consensusTimestamp.toDate().toISOString(),
      transfers: record.transfers.map((t: any) => ({
        account: t.accountId.toString(),
        amount: t.amount.toString(),
      })),
    }));

    return NextResponse.json({ history: txns });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}