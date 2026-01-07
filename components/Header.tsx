'use client';

import { Moon, Sun, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { storageManager } from '@/lib/storage';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const user = typeof window !== 'undefined' ? storageManager.getUser() : null;

  const handleLogout = () => {
    storageManager.clearUser();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Veloce Metrics</h1>
            <p className="text-xs text-muted-foreground">Dashboard de Performance</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{user.nome}</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-lg"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="rounded-lg"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
