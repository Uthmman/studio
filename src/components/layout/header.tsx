import { Home } from 'lucide-react'; // Using Home as a generic app icon
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <Home className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">
            FurnitureFind
          </h1>
        </Link>
      </div>
    </header>
  );
}
