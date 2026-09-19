import "./globals.css";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "DPI HT 01 | Certified Review",
  description: "Financial crime scene assignment review dashboard.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
