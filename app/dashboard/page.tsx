'use client';

import { useEffect, useState } from 'react';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard, LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from '@/components/dashboard/ChartCard';
import { PresentationMode } from '@/components/PresentationMode';
import { SlideIntro, SlideKPIs, SlideEvolution, SlideChannelPerformance, SlideHighlights } from '@/components/presentation/PresentationSlides';
import { ImpactAnalysis } from '@/components/dashboard/ImpactAnalysis';
import { Button } from '@/components/ui/button';
import { storageManager } from '@/lib/storage';
import { RelatorioMensal } from '@/types';
import { analisarImpacto, AnaliseImpacto } from '@/lib/impactAnalysis';
import { TrendingUp, Users, DollarSign, Target, Sparkles, Globe, Maximize2, Search } from 'lucide-react';
import { formatCurrency, formatNumber, calculateVariation, getMonthName } from '@/lib/utils';

export default function DashboardPage() {
  const [relatorios, setRelatorios] = useState<RelatorioMensal[]>([]);
  const [relatorioAtual, setRelatorioAtual] = useState<RelatorioMensal | null>(null);
  const [relatorioAnterior, setRelatorioAnterior] = useState<RelatorioMensal | null>(null);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [analiseAtual, setAnaliseAtual] = useState<AnaliseImpacto | null>(null);

  useEffect(() => {
    const dados = storageManager.getRelatorios();
    setRelatorios(dados);
    if (dados.length > 0) {
      setRelatorioAtual(dados[dados.length - 1]);
      if (dados.length > 1) {
        setRelatorioAnterior(dados[dados.length - 2]);
      }
    }
  }, []);

  const handleAnalisar = (metrica: 'leads' | 'cpa' | 'conversao' | 'roi') => {
    if (relatorioAtual && relatorioAnterior) {
      const analise = analisarImpacto(metrica, relatorioAtual, relatorioAnterior);
      if (analise) {
        setAnaliseAtual(analise);
      }
    }
  };

  if (!relatorioAtual) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Nenhum relatório encontrado</h2>
          <p className="text-muted-foreground">Crie seu primeiro relatório para começar</p>
        </div>
      </div>
    );
  }

  // Dados para os gráficos
  const leadsPorMes = relatorios.map(r => ({
    mes: `${r.mes}/${r.ano}`,
    'Google Ads': r.googleAds.leadsGerados,
    'IA Vellarys': r.ia.leadsQualificados,
    'Portal': r.portal.conversoes,
    'Total': r.metricasGerais.leadsTotal
  }));

  const performanceCanais = [
    { nome: 'Google Ads', valor: relatorioAtual.googleAds.leadsGerados, cor: '#3b82f6' },
    { nome: 'IA Vellarys', valor: relatorioAtual.ia.leadsQualificados, cor: '#8b5cf6' },
    { nome: 'Portal', valor: relatorioAtual.portal.conversoes, cor: '#06b6d4' },
  ];

  const metricsComparacao = relatorios.slice(-3).map(r => ({
    mes: `${r.mes}/${r.ano}`,
    'Taxa Conversão': r.metricasGerais.taxaConversaoGeral,
    'NPS': r.metricasGerais.nps * 10,
    'Satisfação IA': r.ia.satisfacaoUsuario
  }));

  const temAnalise = relatorioAnterior !== null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard de Performance</h1>
          <p className="text-muted-foreground">
            Relatório de {relatorioAtual.mes}/{relatorioAtual.ano} - {relatorioAtual.cliente}
          </p>
        </div>
        <Button
          onClick={() => setIsPresentationMode(true)}
          size="lg"
          className="gap-2"
        >
          <Maximize2 className="w-5 h-5" />
          Modo Apresentação
        </Button>
      </div>

      {/* Destaque - Análise de Impacto */}
      {temAnalise && (
        <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-2 border-blue-500/20 rounded-lg p-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Análise de Causa Raiz
              </h2>
              <p className="text-sm text-muted-foreground">
                Clique em 🔍 para entender o que causou mudanças nas suas métricas
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Comparando com</p>
              <p className="font-semibold">
                {getMonthName(parseInt(relatorioAnterior.mes))}/{relatorioAnterior.ano}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPIs Principais com Análise */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* LEADS */}
        <KPICard
          title="Leads Totais"
          value={formatNumber(relatorioAtual.metricasGerais.leadsTotal)}
          subtitle="leads gerados no período"
          trend={
            relatorioAnterior
              ? relatorioAtual.metricasGerais.leadsTotal > relatorioAnterior.metricasGerais.leadsTotal
                ? 'up'
                : relatorioAtual.metricasGerais.leadsTotal < relatorioAnterior.metricasGerais.leadsTotal
                ? 'down'
                : 'neutral'
              : undefined
          }
          variation={
            relatorioAnterior
              ? calculateVariation(
                  relatorioAtual.metricasGerais.leadsTotal,
                  relatorioAnterior.metricasGerais.leadsTotal
                )
              : undefined
          }
          icon={<Users className="w-6 h-6 text-blue-500" />}
          showAnalyzeButton={
            temAnalise && 
            Math.abs(calculateVariation(
              relatorioAtual.metricasGerais.leadsTotal,
              relatorioAnterior.metricasGerais.leadsTotal
            )) > 5
          }
          onAnalyze={() => handleAnalisar('leads')}
        />

        {/* ROI GOOGLE ADS */}
        <KPICard
          title="ROI Google Ads"
          value={`${relatorioAtual.googleAds.roi.toFixed(1)}x`}
          subtitle={`CPA: ${formatCurrency(relatorioAtual.googleAds.cpa)}`}
          trend={
            relatorioAnterior
              ? relatorioAtual.googleAds.roi > relatorioAnterior.googleAds.roi
                ? 'up'
                : relatorioAtual.googleAds.roi < relatorioAnterior.googleAds.roi
                ? 'down'
                : 'neutral'
              : undefined
          }
          variation={
            relatorioAnterior
              ? calculateVariation(relatorioAtual.googleAds.roi, relatorioAnterior.googleAds.roi)
              : undefined
          }
          icon={<TrendingUp className="w-6 h-6 text-green-500" />}
          valueColor="text-green-500"
          showAnalyzeButton={
            temAnalise && 
            Math.abs(calculateVariation(
              relatorioAtual.googleAds.roi,
              relatorioAnterior.googleAds.roi
            )) > 5
          }
          onAnalyze={() => handleAnalisar('roi')}
        />

        {/* TAXA DE CONVERSÃO */}
        <KPICard
          title="Taxa de Conversão"
          value={`${relatorioAtual.metricasGerais.taxaConversaoGeral}%`}
          subtitle="conversão geral"
          trend={
            relatorioAnterior
              ? relatorioAtual.metricasGerais.taxaConversaoGeral > relatorioAnterior.metricasGerais.taxaConversaoGeral
                ? 'up'
                : relatorioAtual.metricasGerais.taxaConversaoGeral < relatorioAnterior.metricasGerais.taxaConversaoGeral
                ? 'down'
                : 'neutral'
              : undefined
          }
          variation={
            relatorioAnterior
              ? calculateVariation(
                  relatorioAtual.metricasGerais.taxaConversaoGeral,
                  relatorioAnterior.metricasGerais.taxaConversaoGeral
                )
              : undefined
          }
          icon={<Target className="w-6 h-6 text-purple-500" />}
          showAnalyzeButton={
            temAnalise && 
            Math.abs(calculateVariation(
              relatorioAtual.metricasGerais.taxaConversaoGeral,
              relatorioAnterior.metricasGerais.taxaConversaoGeral
            )) > 5
          }
          onAnalyze={() => handleAnalisar('conversao')}
        />

        {/* SATISFAÇÃO IA */}
        <KPICard
          title="Satisfação IA"
          value={`${relatorioAtual.ia.satisfacaoUsuario}%`}
          subtitle={`${formatNumber(relatorioAtual.ia.volumeInteracoes)} atendimentos`}
          trend={
            relatorioAnterior
              ? relatorioAtual.ia.satisfacaoUsuario > relatorioAnterior.ia.satisfacaoUsuario
                ? 'up'
                : relatorioAtual.ia.satisfacaoUsuario < relatorioAnterior.ia.satisfacaoUsuario
                ? 'down'
                : 'neutral'
              : undefined
          }
          variation={
            relatorioAnterior
              ? calculateVariation(
                  relatorioAtual.ia.satisfacaoUsuario,
                  relatorioAnterior.ia.satisfacaoUsuario
                )
              : undefined
          }
          icon={<Sparkles className="w-6 h-6 text-yellow-500" />}
        />
      </div>

      {/* Segunda linha de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Verba Investida"
          value={formatCurrency(relatorioAtual.googleAds.verbaInvestida)}
          subtitle="Google Ads"
          icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
          trend={
            relatorioAnterior
              ? relatorioAtual.googleAds.verbaInvestida > relatorioAnterior.googleAds.verbaInvestida
                ? 'up'
                : relatorioAtual.googleAds.verbaInvestida < relatorioAnterior.googleAds.verbaInvestida
                ? 'down'
                : 'neutral'
              : undefined
          }
          variation={
            relatorioAnterior
              ? calculateVariation(relatorioAtual.googleAds.verbaInvestida, relatorioAnterior.googleAds.verbaInvestida)
              : undefined
          }
        />
        <KPICard
          title="Visitas ao Portal"
          value={formatNumber(relatorioAtual.portal.visitas)}
          subtitle={`${relatorioAtual.portal.conversoes} conversões`}
          trend={
            relatorioAnterior
              ? relatorioAtual.portal.visitas > relatorioAnterior.portal.visitas
                ? 'up'
                : relatorioAtual.portal.visitas < relatorioAnterior.portal.visitas
                ? 'down'
                : 'neutral'
              : undefined
          }
          variation={
            relatorioAnterior
              ? calculateVariation(relatorioAtual.portal.visitas, relatorioAnterior.portal.visitas)
              : undefined
          }
          icon={<Globe className="w-6 h-6 text-cyan-500" />}
        />
        <KPICard
          title="NPS"
          value={relatorioAtual.metricasGerais.nps.toFixed(1)}
          subtitle="Net Promoter Score"
          trend={
            relatorioAnterior
              ? relatorioAtual.metricasGerais.nps > relatorioAnterior.metricasGerais.nps
                ? 'up'
                : relatorioAtual.metricasGerais.nps < relatorioAnterior.metricasGerais.nps
                ? 'down'
                : 'neutral'
              : undefined
          }
          variation={
            relatorioAnterior
              ? calculateVariation(relatorioAtual.metricasGerais.nps, relatorioAnterior.metricasGerais.nps)
              : undefined
          }
          valueColor="text-blue-500"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Evolução de Leads"
          description="Comparação por canal ao longo dos meses"
        >
          <LineChart data={leadsPorMes}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="Google Ads" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="IA Vellarys" stroke="#8b5cf6" strokeWidth={2} />
            <Line type="monotone" dataKey="Portal" stroke="#06b6d4" strokeWidth={2} />
          </LineChart>
        </ChartCard>

        <ChartCard
          title="Performance por Canal"
          description="Distribuição de leads no mês atual"
        >
          <BarChart data={performanceCanais}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="nome" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="valor" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard
          title="Qualidade dos Serviços"
          description="Métricas de satisfação e performance"
        >
          <AreaChart data={metricsComparacao}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="Taxa Conversão" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            <Area type="monotone" dataKey="Satisfação IA" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
          </AreaChart>
        </ChartCard>

        <div className="bg-card rounded-lg border p-6 animate-fade-in">
          <h3 className="text-lg font-semibold mb-4">Destaques do Mês</h3>
          <div className="space-y-4">
            {relatorioAtual.googleAds.roi >= 5 && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p className="font-medium">ROI excepcional em Google Ads</p>
                  <p className="text-sm text-muted-foreground">
                    Retorno de {relatorioAtual.googleAds.roi.toFixed(1)}x sobre investimento de {formatCurrency(relatorioAtual.googleAds.verbaInvestida)}
                  </p>
                </div>
              </div>
            )}
            {relatorioAtual.ia.leadsQualificados >= 20 && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                <div>
                  <p className="font-medium">Alta performance da IA</p>
                  <p className="text-sm text-muted-foreground">
                    {relatorioAtual.ia.leadsQualificados} leads qualificados com {relatorioAtual.ia.satisfacaoUsuario}% de satisfação
                  </p>
                </div>
              </div>
            )}
            {relatorioAtual.portal.conversoes > 10 && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2"></div>
                <div>
                  <p className="font-medium">Crescimento no Portal</p>
                  <p className="text-sm text-muted-foreground">
                    {formatNumber(relatorioAtual.portal.cadastros)} novos cadastros e {relatorioAtual.portal.conversoes} conversões
                  </p>
                </div>
              </div>
            )}
            {relatorioAtual.observacoes && (
              <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm font-medium mb-1">Observações</p>
                <p className="text-sm text-muted-foreground">{relatorioAtual.observacoes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Análise de Impacto */}
      {analiseAtual && (
        <ImpactAnalysis
          analise={analiseAtual}
          onClose={() => setAnaliseAtual(null)}
        />
      )}

      {/* Modo Apresentação */}
      <PresentationMode
        isOpen={isPresentationMode}
        onClose={() => setIsPresentationMode(false)}
      >
        {[
          <SlideIntro key="intro" relatorioAtual={relatorioAtual} />,
          <SlideKPIs key="kpis" relatorioAtual={relatorioAtual} relatorioAnterior={relatorioAnterior} relatorios={relatorios} />,
          <SlideEvolution key="evolution" relatorios={relatorios} />,
          <SlideChannelPerformance key="channels" relatorioAtual={relatorioAtual} />,
          <SlideHighlights key="highlights" relatorioAtual={relatorioAtual} />,
        ]}
      </PresentationMode>
    </div>
  );
}