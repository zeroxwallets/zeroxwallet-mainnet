"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function Home() {
  // 👉 States
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);

  // ✅ Balance check
  const checkBalance = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/balance");
      const data = await res.json();
      setBalance(data.balance);
      setMessage(`Balance: ${data.balance} ℏ`);
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

  // ✅ Load Transaction History
  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/history");
      const data = await res.json();
      setHistory(data.history || []);
    } catch (err) {
      setMessage("❌ Error loading history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">🚀 ZeroxWallet Testnet</h1>

      {/* Balance */}
      <button
        onClick={checkBalance}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded mt-4"
      >
        {loading ? "Checking..." : "Check Balance"}
      </button>
      <p className="mt-2">Balance: {balance} ℏ</p>

      {/* Send HBAR */}
      <h2 className="text-lg font-semibold mt-6">Send HBAR</h2>
      <input
        type="text"
        placeholder="Receiver Account ID"
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        className="border p-2 w-full mt-2"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="border p-2 w-full mt-2"
      />
      <button
        onClick={sendHBAR}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded mt-4"
      >
        {loading ? "Sending..." : `Send ${amount} ℏ`}
      </button>

      {/* Receive HBAR */}
      <h2 className="text-lg font-semibold mt-6">Receive HBAR</h2>
      <p>Your Account ID: {process.env.HEDERA_ACCOUNT_ID}</p>
      <QRCodeCanvas value={process.env.HEDERA_ACCOUNT_ID || ""} />

      {/* Transaction History */}
      <h2 className="text-lg font-semibold mt-6">📜 Transaction History</h2>
      <button
        onClick={loadHistory}
        disabled={loading}
        className="px-4 py-2 bg-purple-600 text-white rounded mt-2"
      >
        {loading ? "Loading..." : "Load History"}
      </button>

      <ul className="list-disc pl-5 space-y-2 mt-2">
        {history.map((txn: any, idx: number) => (
          <li key={idx} className="border p-2 rounded">
            <p>🆔 {txn.transaction_id}</p>
            <p>⏰ {txn.consensus_timestamp}</p>
            <p>
              Transfers:{" "}
              {txn.transfers
                .map((t: any) => `${t.account} (${t.amount}ℏ)`)
                .join(", ")}
            </p>
          </li>
        ))}
      </ul>

      {/* Message */}
      {message && <p className="mt-4 font-semibold">{message}</p>}
    </div>
  );
}