import { NextResponse } from "next/server";
import { Client, AccountBalanceQuery, PrivateKey } from "@hashgraph/sdk";

function hederaClient() {
  const accountId = process.env.HEDERA_ACCOUNT_ID;
  const privateKey = process.env.HEDERA_PRIVATE_KEY;

  if (!accountId || !privateKey) {
    throw new Error("Missing Hedera environment variables");
  }

  const client = Client.forTestnet();
  client.setOperator(accountId, PrivateKey.fromString(privateKey));
  return client;
}

export async function GET() {
  try {
    const accountId = process.env.HEDERA_ACCOUNT_ID!;
    const client = hederaClient();

    const balance = await new AccountBalanceQuery()
      .setAccountId(accountId)
      .execute(client);

    return NextResponse.json({ balance: balance.hbars.toString() });
  } catch (err) {
    console.error("Error fetching balance:", err);
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 });
  }
}