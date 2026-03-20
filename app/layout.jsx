// app/layout.jsx
import './globals.css'

export const metadata = {
  title: 'AI Clarity & Structuring Tool',
  description:
    'Convert your raw, vague ideas into structured, actionable plans with AI-powered clarity scoring.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
