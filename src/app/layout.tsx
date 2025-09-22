import './globals.css'

export const metadata = {
  title: 'RightTool',
  description: 'Find the right automotive tools for any job',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}