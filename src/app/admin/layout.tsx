
"use client";

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Home, ShieldAlert, LogOut, Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase'; // Import Firebase auth
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Metadata would ideally be moved to a higher level or handled differently
// if the entire layout becomes client-side. For now, we keep it but acknowledge this.
// export const metadata: Metadata = {
// title: 'Admin - FurnitureFind',
// description: 'Manage FurnitureFind data.',
// };

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
      if (!currentUser && pathname !== '/admin/login') {
        router.replace('/admin/login');
      } else if (currentUser && pathname === '/admin/login') {
        router.replace('/admin/furniture');
      }
    });
    return () => unsubscribe();
  }, [router, pathname]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Signed Out', description: 'You have been successfully signed out.' });
      // onAuthStateChanged will handle redirect to /admin/login
    } catch (error) {
      console.error('Sign out error:', error);
      toast({ title: 'Error', description: 'Failed to sign out.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading Admin Area...</p>
      </div>
    );
  }

  // If not authenticated and not on the login page, show minimal layout or redirect (handled by useEffect)
  if (!user && pathname !== '/admin/login') {
     // This state should ideally be brief due to redirection logic in useEffect.
     // You might show a minimal loader here as well, or just null.
    return (
         <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg">Redirecting to login...</p>
        </div>
    );
  }
  
  // If user is authenticated or on the login page itself
  if (user || pathname === '/admin/login') {
    // Do not render the admin layout for the login page itself
    if (pathname === '/admin/login') {
      return <>{children}</>;
    }

    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-card border-b shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/admin/furniture" className="flex items-center gap-2 text-xl font-semibold text-foreground hover:text-primary transition-colors">
              FurnitureFind Admin
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                <Home className="h-5 w-5 inline-block mr-1" />
                Back to Main Site
              </Link>
              {user && (
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-md mb-6" role="alert">
            <div className="flex">
              <div className="py-1"><ShieldAlert className="h-6 w-6 text-yellow-500 mr-3" /></div>
              <div>
                <p className="font-bold">Admin Area Notice</p>
                <p className="text-sm">Changes made here are currently for the current session only (data is in-memory). Data migration to Firebase Firestore is a next step.</p>
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
  
  // Fallback for scenarios where routing hasn't caught up or state is unexpected.
  return null; 
}
