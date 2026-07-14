import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'Edemy 🎓 | Futuristic Cyber Learning Platform',
  description: 'A Next-Generation interactive LMS featuring AI components, live schedules, parent monitoring, and glowing neon aesthetics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="cyber-grid min-h-screen bg-background text-gray-100 antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
