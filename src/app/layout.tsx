import { GlobalAuthGuard } from '@/modules/auth/components/GlobalAuthGuard';
import { Providers } from '@/providers';
import '@/styles/globals.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata = {
  title: 'Cali Joven',
  description: 'Portal de la Alcaldía de Cali para jóvenes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={poppins.variable} suppressHydrationWarning>
      <body className={poppins.className}>
        <Providers>
          <GlobalAuthGuard>
            {children}
          </GlobalAuthGuard>
        </Providers>
      </body>
    </html>
  );
}
