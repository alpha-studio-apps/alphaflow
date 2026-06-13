import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AlphaFlow — CRM interno Alpha',
  description: 'Sistema comercial interno del ecosistema Alpha',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full bg-[#050505] text-white antialiased">{children}</body>
    </html>
  )
}
