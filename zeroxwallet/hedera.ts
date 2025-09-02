import { Client, AccountBalanceQuery, PrivateKey } from "@hashgraph/sdk";

function hederaClient() {
  console.log("ENV CHECK:");
  console.log("HEDERA_ACCOUNT_ID =", process.env.HEDERA_ACCOUNT_ID);
  console.log("HEDERA_PRIVATE_KEY =", process.env.HEDERA_PRIVATE_KEY?.slice(0, 10) + "..."); // sirf start dikhana

  const accountId = process.env.HEDERA_ACCOUNT_ID;
  const privateKey = process.env.HEDERA_PRIVATE_KEY;

  if (!accountId || !privateKey) {
    throw new Error("Missing Hedera environment variables");
  }

  const client = Client.forTestnet();
  client.setOperator(accountId, PrivateKey.fromString(privateKey));
  return client;
}

export async function getBalance(accountId: string) {
  try {
    const client = hederaClient();
    const balance = await new AccountBalanceQuery()
      .setAccountId(accountId)
      .execute(client);

    return balance.hbars.toString();
  } catch (err) {
    console.error("Error fetching balance:", err);
    return null;
  }
}