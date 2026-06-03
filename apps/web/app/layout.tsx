import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qlidex Customer Support",
  description: "Qlidex customer support landing page implemented from the Figma design.",
  icons: {
    icon: "/assets/qlidex-mark.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
