"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function Home() {
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  // ✅ Balance check
  const checkBalance = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/balance");
      const data = await res.json();
      setMessage(`💰 Balance: ${data.balance} ℏ`);
    } catch (err) {
      setMessage("❌ Error fetching balance");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Send HBAR
  const sendHBAR = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId, amount }),
      });
      const data = await res.json();
      if (data.status) {
        setMessage(`✅ Success! Status: ${data.status}`);
      } else {
        setMessage(`❌ Failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      setMessage("❌ Transaction error!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load transaction history
  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/history");
      const data = await res.json();
      setHistory(data.transactions || []);
    } catch (err) {
      setMessage("❌ Error loading history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🚀 ZeroxWallet Testnet</h1>

      {/* ✅ Balance Section */}
      <div>
        <button
          onClick={checkBalance}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {loading ? "Loading..." : "Check Balance"}
        </button>
      </div>

      {/* ✅ Send HBAR Section */}
      <div>
        <h2 className="text-lg font-semibold">Send HBAR</h2>
        <input
          type="text"
          placeholder="Receiver Account ID (0.0.x)"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Amount (ℏ)"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border px-3 py-2 rounded w-full mt-2"
        />
        <button
          onClick={sendHBAR}
          disabled={loading || !accountId || amount <= 0}
          className="px-4 py-2 mt-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Processing..." : `Send ${amount} ℏ`}
        </button>
      </div>

      {/* ✅ Receive Section with QR */}
      <div>
        <h2 className="text-lg font-semibold">Receive HBAR</h2>
        <p className="break-words">
          Your Account ID: {process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID}
        </p>
        <button
          onClick={() =>
            navigator.clipboard.writeText(
              process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID || ""
            )
          }
          className="px-4 py-2 bg-gray-600 text-white rounded mt-2"
        >
          📋 Copy Account ID
        </button>
        <div className="flex justify-center mt-4">
          <QRCodeCanvas
            value={process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID || ""}
            size={150}
            bgColor="#ffffff"
            fgColor="#000000"
            includeMargin={true}
          />
        </div>
      </div>

      {/* ✅ Transaction History */}
      <div>
        <h2 className="text-lg font-semibold">📜 Transaction History</h2>
        <button
          onClick={loadHistory}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded mt-2"
        >
          {loading ? "Loading..." : "Load History"}
        </button>
        <ul className="list-disc pl-5 space-y-2 mt-4">
          {history.map((txn, idx) => (
            <li key={idx} className="border p-2 rounded">
              <p>🆔 {txn.transaction_id}</p>
              <p>⏱ {txn.consensus_timestamp}</p>
              <p>
                Transfers:{" "}
                {txn.transfers
                  ?.map((t: any) => `${t.account} (${t.amount} ℏ)`)
                  .join(", ")}
              </p>
              <a
                href={`https://hashscan.io/testnet/transaction/${txn.transaction_id}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline"
              >
                🔗 View on Explorer
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ Messages */}
      {message && <p className="mt-4 font-semibold">{message}</p>}
    </main>
  );
}