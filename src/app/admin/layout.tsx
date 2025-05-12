import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin - FurnitureFind',
  description: 'Manage FurnitureFind data.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/admin/furniture" className="flex items-center gap-2 text-xl font-semibold text-foreground hover:text-primary transition-colors">
            FurnitureFind Admin
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            <Home className="h-5 w-5 inline-block mr-1" />
            Back to Main Site
          </Link>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-md mb-6" role="alert">
          <div className="flex">
            <div className="py-1"><ShieldAlert className="h-6 w-6 text-yellow-500 mr-3" /></div>
            <div>
              <p className="font-bold">Admin Area Notice</p>
              <p className="text-sm">Changes made here are for the current session only and will not be saved permanently. Data will reset on page refresh or server restart.</p>
            </div>
          </div>
        </div>
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        &copy; {new Date().getFullYear()} FurnitureFind Admin.
      </footer>
    </div>
  );
}
