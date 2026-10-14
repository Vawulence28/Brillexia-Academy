import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'Brillexia Academy LMS',
  description: 'Individual One-on-One Tutoring Management Platform'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}