import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
