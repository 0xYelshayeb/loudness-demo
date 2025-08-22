import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loudness Demo",
  description: "AB listening test for loudness normalization",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
