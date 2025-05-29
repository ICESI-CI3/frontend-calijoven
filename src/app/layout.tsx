import { Poppins } from 'next/font/google';
import { Providers } from '@/providers';
import '@/styles/globals.css';
import { SessionValidator } from '@/components/SessionValidator';

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
        <div className="pt-10">
          <Providers>
            <SessionValidator />
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
