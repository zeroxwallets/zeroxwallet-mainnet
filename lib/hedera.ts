import { Client } from "@hashgraph/sdk";

const accountId = process.env.HEDERA_ACCOUNT_ID;
const privateKey = process.env.HEDERA_PRIVATE_KEY;

if (!accountId || !privateKey) {
  throw new Error("Missing Hedera environment variables");
}

const client = Client.forTestnet();
client.setOperator(accountId, privateKey);

export default client;