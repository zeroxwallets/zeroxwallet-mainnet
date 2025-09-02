import "./globals.css";

export const metadata = {
  title: "ZeroxWallet",
  description: "Testnet build",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}