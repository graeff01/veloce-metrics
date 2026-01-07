'use client';

import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard, LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from '@/components/dashboard/ChartCard';
import { RelatorioMensal } from '@/types';
import { formatCurrency, formatNumber, calculateVariation, getMonthName } from '@/lib/utils';
import { TrendingUp, Users, DollarSign, Target, Sparkles, Globe } from 'lucide-react';

interface PresentationSlideProps {
  relatorioAtual: RelatorioMensal;
  relatorioAnterior: RelatorioMensal | null;
  relatorios: RelatorioMensal[];
}

// Slide 1: Capa
export function SlideIntro({ relatorioAtual }: { relatorioAtual: RelatorioMensal }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8">
        <span className="text-white font-bold text-5xl">V</span>
      </div>
      <h1 className="text-6xl font-bold text-white mb-4">
        Relatório de Performance
      </h1>
      <p className="text-3xl text-white/60 mb-12">
        {getMonthName(parseInt(relatorioAtual.mes))} {relatorioAtual.ano}
      </p>
      <div className="text-xl text-white/40">
        {relatorioAtual.cliente}
      </div>
    </div>
  );
}

// Slide 2: KPIs Principais
export function SlideKPIs({ relatorioAtual, relatorioAnterior }: PresentationSlideProps) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-4xl font-bold text-white mb-8">Métricas Principais</h2>
      
      <div className="grid grid-cols-2 gap-8 flex-1">
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
          icon={<Users className="w-8 h-8 text-blue-500" />}
        />
        
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
          icon={<TrendingUp className="w-8 h-8 text-green-500" />}
          valueColor="text-green-500"
        />
        
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
          icon={<Target className="w-8 h-8 text-purple-500" />}
        />
        
        <KPICard
          title="Satisfação IA"
          value={`${relatorioAtual.ia.satisfacaoUsuario}%`}
          subtitle={`${formatNumber(relatorioAtual.ia.volumeInteracoes)} interações`}
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
          icon={<Sparkles className="w-8 h-8 text-yellow-500" />}
        />
      </div>
    </div>
  );
}

// Slide 3: Evolução de Leads
export function SlideEvolution({ relatorios }: { relatorios: RelatorioMensal[] }) {
  const leadsPorMes = relatorios.map(r => ({
    mes: `${r.mes}/${r.ano}`,
    'Google Ads': r.googleAds.leadsGerados,
    'IA': r.ia.leadsQualificados,
    'Redes Sociais': r.redesSociais.leadsOrganicos,
  }));

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-4xl font-bold text-white mb-8">Evolução de Leads</h2>
      
      <div className="flex-1">
        <ChartCard
          title="Comparação por Canal"
          description="Performance ao longo dos meses"
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
            <Line type="monotone" dataKey="Google Ads" stroke="#3b82f6" strokeWidth={3} />
            <Line type="monotone" dataKey="IA" stroke="#8b5cf6" strokeWidth={3} />
            <Line type="monotone" dataKey="Redes Sociais" stroke="#f59e0b" strokeWidth={3} />
          </LineChart>
        </ChartCard>
      </div>
    </div>
  );
}

// Slide 4: Performance por Canal
export function SlideChannelPerformance({ relatorioAtual }: { relatorioAtual: RelatorioMensal }) {
  const performanceCanais = [
    { nome: 'Google Ads', valor: relatorioAtual.googleAds.leadsGerados },
    { nome: 'IA Vellarys', valor: relatorioAtual.ia.leadsQualificados },
    { nome: 'Portal', valor: relatorioAtual.portal.conversoes },
    { nome: 'Redes Sociais', valor: relatorioAtual.redesSociais.leadsOrganicos },
  ];

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-4xl font-bold text-white mb-8">Performance por Canal</h2>
      
      <div className="flex-1">
        <ChartCard
          title="Distribuição de Leads"
          description="Mês atual"
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
      </div>
    </div>
  );
}

// Slide 5: Destaques e Observações
export function SlideHighlights({ relatorioAtual }: { relatorioAtual: RelatorioMensal }) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-4xl font-bold text-white mb-8">Destaques do Mês</h2>
      
      <div className="flex-1 space-y-6">
        <div className="bg-gradient-to-r from-green-500/20 to-green-500/5 border border-green-500/30 rounded-lg p-8">
          <div className="flex items-start gap-4">
            <div className="w-3 h-3 rounded-full bg-green-500 mt-2"></div>
            <div>
              <p className="text-2xl font-semibold text-white mb-2">Alta taxa de resolução da IA</p>
              <p className="text-xl text-white/60">
                {relatorioAtual.ia.taxaResolucao}% das consultas resolvidas automaticamente, 
                economizando tempo significativo da equipe
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-lg p-8">
          <div className="flex items-start gap-4">
            <div className="w-3 h-3 rounded-full bg-blue-500 mt-2"></div>
            <div>
              <p className="text-2xl font-semibold text-white mb-2">ROI positivo em Google Ads</p>
              <p className="text-xl text-white/60">
                Retorno de {relatorioAtual.googleAds.roi}x sobre investimento de {formatCurrency(relatorioAtual.googleAds.verbaInvestida)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500/20 to-purple-500/5 border border-purple-500/30 rounded-lg p-8">
          <div className="flex items-start gap-4">
            <div className="w-3 h-3 rounded-full bg-purple-500 mt-2"></div>
            <div>
              <p className="text-2xl font-semibold text-white mb-2">Crescimento no Portal</p>
              <p className="text-xl text-white/60">
                {formatNumber(relatorioAtual.portal.cadastros)} novos cadastros realizados com 
                {relatorioAtual.portal.conversoes} conversões efetivas
              </p>
            </div>
          </div>
        </div>
        
        {relatorioAtual.observacoes && (
          <div className="mt-8 p-8 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-xl font-medium text-white mb-3">Observações Adicionais</p>
            <p className="text-lg text-white/70">{relatorioAtual.observacoes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
