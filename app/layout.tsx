import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "인천공항 시간대별 예상 승객 수",
  description: "인천국제공항 제1·2여객터미널 시간대별 예상 승객 수 조회 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}


