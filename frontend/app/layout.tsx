import type { Metadata } from "next"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "SGEO Дашборд - Мониторинг и аналитика LLM",
  description: "Мониторинг и анализ представления Казахстана в основных LLM системах",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
