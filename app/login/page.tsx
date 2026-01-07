'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { storageManager } from '@/lib/storage';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Importar função de validação
    const { validateLogin } = require('@/lib/auth');
    const result = validateLogin(email, senha);

    if (result.success) {
      storageManager.saveUser(result.user);
      storageManager.seedInitialData();
      router.push('/dashboard');
    } else {
      setError(result.error || 'Erro ao fazer login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">V</span>
          </div>
          <CardTitle className="text-2xl font-bold">Veloce Metrics</CardTitle>
          <CardDescription>
            Faça login para acessar o dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p className="font-semibold text-primary mb-1">👤 Usuário Principal:</p>
            <p>Douglas@velocebm.com</p>
            <p className="text-xs mt-2 opacity-60">Ou use qualquer email/senha para testes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
