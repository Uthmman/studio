import { Home, Settings, History as HistoryIcon } from 'lucide-react'; 
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <Home className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">
            FurnitureFind
          </h1>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/history" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors" title="View Estimation History">
            <HistoryIcon className="h-5 w-5" />
            <span>History</span>
          </Link>
          <Link href="/admin/furniture" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors" title="Manage Furniture Data">
            <Settings className="h-5 w-5" />
            <span>Admin</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
