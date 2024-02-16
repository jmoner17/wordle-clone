import './globals.css'
import SupabaseProvider from '@/utils/supabase-provider'
import Providers from '@/utils/providers'

export const metadata = {
  title: 'wordle',
  description: 'wordle website',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
      (function() {
        var theme = localStorage.getItem('theme');
        if (!theme) {
          theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
      })()
    `,
          }}
        />
      </head>
      <Providers>
        <body className="bg-primary dark:bg-dark-primary">
          <SupabaseProvider>{children}</SupabaseProvider>
        </body>
      </Providers>
    </html>
  )
}