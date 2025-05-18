import { Settings, History as HistoryIcon } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          {/* New Logo SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className="h-10 w-10" // Slightly larger for better visibility
            aria-label="ZenPrice Logo"
          >
            {/* Cabinet Body (Dark Teal) */}
            <rect x="20" y="40" width="60" height="45" rx="5" ry="5" fill="hsl(var(--primary))" />
            {/* Cabinet Top (Gold/Orange) */}
            <rect x="15" y="35" width="70" height="10" rx="3" ry="3" fill="hsl(var(--accent))" />

            {/* Drawers (Dark Teal with Gold/Orange Stripe) */}
            <rect x="25" y="45" width="50" height="15" rx="3" ry="3" fill="hsl(var(--primary))" />
            <rect x="25" y="52" width="50" height="3" fill="hsl(var(--accent))" /> {/* Stripe */}
            <circle cx="50" cy="53.5" r="3" fill="hsl(var(--accent))" /> {/* Handle 1 */}

            <rect x="25" y="65" width="50" height="15" rx="3" ry="3" fill="hsl(var(--primary))" />
            <circle cx="50" cy="72.5" r="3" fill="hsl(var(--accent))" /> {/* Handle 2 */}

            {/* Legs (Gold/Orange) */}
            <rect x="25" y="85" width="10" height="10" rx="2" ry="2" fill="hsl(var(--accent))" transform="rotate(-10 30 90)" />
            <rect x="65" y="85" width="10" height="10" rx="2" ry="2" fill="hsl(var(--accent))" transform="rotate(10 70 90)" />

            {/* Palm Tree Pot (Gold/Orange) */}
            <rect x="42" y="25" width="16" height="10" rx="2" ry="2" fill="hsl(var(--accent))" />
            {/* Palm Tree Trunk (Darker Gold/Orange) */}
            <rect x="47" y="20" width="6" height="5" fill="hsl(35 100% 45%)" />
            {/* Palm Tree Leaves (Primary Color - Dark Teal) */}
            <circle cx="50" cy="12" r="8" fill="hsl(var(--primary))" />
            <path d="M50 12 Q45 5 40 10 Q45 15 50 12Z" fill="hsl(var(--primary))" />
            <path d="M50 12 Q55 5 60 10 Q55 15 50 12Z" fill="hsl(var(--primary))" />
            <path d="M45 15 Q40 20 50 12 Q48 18 45 15Z" fill="hsl(var(--primary))" />
            <path d="M55 15 Q60 20 50 12 Q52 18 55 15Z" fill="hsl(var(--primary))" />
          </svg>
          <h1 className="text-2xl font-semibold tracking-tight">
            ZenPrice
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
