import { Inter } from 'next/font/google';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LOGIN | ADMIN WEB BCARE',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{ backgroundColor: '#A1A1A1' }}
        className={inter.className}
      >
        {children}
      </body>
    </html>
  );
}
