import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PF Loan Application Generator',
  description: 'Generate Non-Refundable PF Loan Withdrawal letters',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="appHeader">PF Loan Application Generator</header>
          {children}
          <footer className="appFooter">? {new Date().getFullYear()} Anglo India Jute & Textile Industries Pvt. Ltd.</footer>
        </div>
      </body>
    </html>
  );
}
