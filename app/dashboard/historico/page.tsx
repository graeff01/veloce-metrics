'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { storageManager } from '@/lib/storage';
import { RelatorioMensal } from '@/types';
import { Calendar, TrendingUp, Users, Trash2, Eye } from 'lucide-react';
import { formatNumber, getMonthName } from '@/lib/utils';

export default function HistoricoPage() {
  const [relatorios, setRelatorios] = useState<RelatorioMensal[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadRelatorios();
  }, []);

  const loadRelatorios = () => {
    const dados = storageManager.getRelatorios();
    setRelatorios(dados.sort((a, b) => {
      if (a.ano !== b.ano) return b.ano - a.ano;
      return parseInt(b.mes) - parseInt(a.mes);
    }));
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este relatório?')) {
      storageManager.deleteRelatorio(id);
      loadRelatorios();
    }
  };

  const handleView = (id: string) => {
    // Por enquanto redireciona para dashboard, mas poderia ser uma página de visualização específica
    router.push('/dashboard');
  };

  if (relatorios.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Nenhum relatório encontrado</h2>
          <p className="text-muted-foreground mb-4">Crie seu primeiro relatório para começar</p>
          <Button onClick={() => router.push('/dashboard/novo')}>
            Criar Relatório
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Histórico de Relatórios</h1>
        <p className="text-muted-foreground">
          {relatorios.length} relatórios cadastrados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {relatorios.map((relatorio) => (
          <Card key={relatorio.id} className="animate-fade-in hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    {getMonthName(parseInt(relatorio.mes))} {relatorio.ano}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {relatorio.cliente}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleView(relatorio.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(relatorio.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {formatNumber(relatorio.metricasGerais.leadsTotal)}
                    </p>
                    <p className="text-xs text-muted-foreground">Leads Totais</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {relatorio.metricasGerais.taxaConversaoGeral}%
                    </p>
                    <p className="text-xs text-muted-foreground">Conversão</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <p className="text-sm font-semibold text-blue-500">
                    {formatNumber(relatorio.googleAds.leadsGerados)}
                  </p>
                  <p className="text-xs text-muted-foreground">Google Ads</p>
                </div>
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <p className="text-sm font-semibold text-purple-500">
                    {formatNumber(relatorio.ia.leadsQualificados)}
                  </p>
                  <p className="text-xs text-muted-foreground">IA</p>
                </div>
                <div className="p-2 rounded-lg bg-green-500/10">
                  <p className="text-sm font-semibold text-green-500">
                    {formatNumber(relatorio.portal.conversoes)}
                  </p>
                  <p className="text-xs text-muted-foreground">Portal</p>
                </div>
              </div>

              {relatorio.observacoes && (
                <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {relatorio.observacoes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
