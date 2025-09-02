"use client";

import { useEffect, useState } from "react";
import { loginWithGoogle, logout, auth } from "../../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🦅 ZeroxWallet Login</h1>

      {user ? (
        <div>
          <p className="mb-4">✅ Logged in as: {user.email}</p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={loginWithGoogle}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Sign in with Google
        </button>
      )}
    </main>
  );
}