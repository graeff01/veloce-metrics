'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { storageManager } from '@/lib/storage';
import { Settings, Download, Trash2, AlertTriangle } from 'lucide-react';

export default function ConfiguracoesPage() {
  const [user, setUser] = useState<any>(null);
  const [relatoriosCount, setRelatoriosCount] = useState(0);

  useEffect(() => {
    const userData = storageManager.getUser();
    setUser(userData);
    const relatorios = storageManager.getRelatorios();
    setRelatoriosCount(relatorios.length);
  }, []);

  const handleExportData = () => {
    const relatorios = storageManager.getRelatorios();
    const dataStr = JSON.stringify(relatorios, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `veloce-metrics-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('ATENÇÃO: Isso irá apagar TODOS os relatórios. Esta ação não pode ser desfeita. Tem certeza?')) {
      if (confirm('Última confirmação: Todos os dados serão perdidos. Continuar?')) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-8 h-8" />
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Gerencie sua conta e dados</p>
        </div>
      </div>

      {/* Informações da Conta */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
          <CardDescription>Seus dados de acesso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{user.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Função</p>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Estatísticas de Uso</CardTitle>
          <CardDescription>Resumo dos seus dados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-primary/10">
              <p className="text-3xl font-bold text-primary">{relatoriosCount}</p>
              <p className="text-sm text-muted-foreground">Relatórios criados</p>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10">
              <p className="text-3xl font-bold text-green-500">
                {new Date().getMonth() + 1}
              </p>
              <p className="text-sm text-muted-foreground">Meses de uso</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10">
              <p className="text-3xl font-bold text-purple-500">100%</p>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gerenciamento de Dados */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Gerenciamento de Dados</CardTitle>
          <CardDescription>Exporte ou limpe seus dados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <p className="font-medium">Exportar Dados</p>
              <p className="text-sm text-muted-foreground">
                Baixe todos os seus relatórios em formato JSON
              </p>
            </div>
            <Button onClick={handleExportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/50 bg-destructive/5">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <p className="font-medium text-destructive">Limpar Todos os Dados</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Remove todos os relatórios e faz logout. Ação irreversível!
              </p>
            </div>
            <Button onClick={handleClearData} variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Sistema */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
          <CardDescription>Detalhes técnicos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Versão</span>
            <span className="font-medium">1.0.0 MVP</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Armazenamento</span>
            <span className="font-medium">LocalStorage</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Framework</span>
            <span className="font-medium">Next.js 14</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium text-green-500">● Operacional</span>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Próximas Funcionalidades</CardTitle>
          <CardDescription>O que está por vir</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Integração com APIs do Google Ads e Meta</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span>Export para PDF/PowerPoint</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Modo apresentação fullscreen</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>Comparações automáticas entre períodos</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>Suporte multi-cliente</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
