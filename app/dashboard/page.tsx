'use client';

import { useEffect, useState } from 'react';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard, LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from '@/components/dashboard/ChartCard';
import { PresentationMode } from '@/components/PresentationMode';
import { SlideIntro, SlideKPIs, SlideEvolution, SlideChannelPerformance, SlideHighlights } from '@/components/presentation/PresentationSlides';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { storageManager } from '@/lib/storage';
import { RelatorioMensal } from '@/types';
import { TrendingUp, Users, DollarSign, Target, Sparkles, Globe, Maximize2, AlertCircle, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { formatCurrency, formatNumber, calculateVariation, getMonthName } from '@/lib/utils';

export default function DashboardPage() {
  const [relatorios, setRelatorios] = useState<RelatorioMensal[]>([]);
  const [relatorioAtual, setRelatorioAtual] = useState<RelatorioMensal | null>(null);
  const [relatorioAnterior, setRelatorioAnterior] = useState<RelatorioMensal | null>(null);
  const [isPresentationMode, setIsPresentationMode] = useState(false);

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

  // Cálculos de retorno
  const retornoEstimado = relatorioAtual.googleAds.leadsGerados * 
    relatorioAtual.metricasGerais.ticketMedio * 
    (relatorioAtual.metricasGerais.taxaConversaoGeral / 100);
  const lucro = retornoEstimado - relatorioAtual.googleAds.verbaInvestida;
  const percentualLucro = ((relatorioAtual.googleAds.roi - 1) * 100);

  // Economia de tempo com IA (5 min por interação humana)
  const horasEconomizadas = Math.round((relatorioAtual.ia.volumeInteracoes * 
    (relatorioAtual.ia.taxaResolucao / 100) * 5) / 60);

  // Dados para os gráficos
  const leadsPorMes = relatorios.map(r => ({
    mes: `${r.mes}/${r.ano}`,
    'Google Ads': r.googleAds.leadsGerados,
    'IA': r.ia.leadsQualificados,
    'Redes Sociais': r.redesSociais.leadsOrganicos,
    'Total': r.metricasGerais.leadsTotal
  }));

  const performanceCanais = [
    { nome: 'Google Ads', valor: relatorioAtual.googleAds.leadsGerados, cor: '#3b82f6' },
    { nome: 'IA Vellarys', valor: relatorioAtual.ia.leadsQualificados, cor: '#8b5cf6' },
    { nome: 'Portal', valor: relatorioAtual.portal.conversoes, cor: '#10b981' },
    { nome: 'Redes Sociais', valor: relatorioAtual.redesSociais.leadsOrganicos, cor: '#f59e0b' },
  ];

  const melhorCanal = [...performanceCanais].sort((a, b) => b.valor - a.valor)[0];

  const metricsComparacao = relatorios.slice(-3).map(r => ({
    mes: `${r.mes}/${r.ano}`,
    'Taxa Conversão': r.metricasGerais.taxaConversaoGeral,
    'NPS': r.metricasGerais.nps * 10,
    'Satisfação IA': r.ia.satisfacaoUsuario
  }));

  // Alertas
  const alertas = [];
  if (relatorioAtual.googleAds.cpa > 80) {
    alertas.push({ tipo: 'warning', mensagem: `CPA elevado (R$ ${relatorioAtual.googleAds.cpa.toFixed(2)}) - Considere otimizar campanhas` });
  }
  if (relatorioAtual.ia.satisfacaoUsuario < 80) {
    alertas.push({ tipo: 'warning', mensagem: `Satisfação IA abaixo do ideal (${relatorioAtual.ia.satisfacaoUsuario}%) - Revisar respostas` });
  }
  if (relatorioAtual.portal.taxaRejeicao > 50) {
    alertas.push({ tipo: 'warning', mensagem: `Taxa de rejeição alta (${relatorioAtual.portal.taxaRejeicao}%) - Melhorar UX do portal` });
  }
  if (relatorioAtual.googleAds.roi < 2) {
    alertas.push({ tipo: 'warning', mensagem: `ROI baixo (${relatorioAtual.googleAds.roi.toFixed(1)}x) - Rever estratégia de anúncios` });
  }

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

      {/* Alertas */}
      {alertas.length > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-500/5 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="w-5 h-5" />
              Pontos de Atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alertas.map((alerta, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2"></div>
                  <p>{alerta.mensagem}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Investimento vs Retorno */}
      <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/30 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Investimento vs Retorno - {relatorioAtual.mes}/{relatorioAtual.ano}
          </CardTitle>
          <CardDescription>Retorno financeiro consolidado do período</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Investido</p>
              <p className="text-3xl font-bold">{formatCurrency(relatorioAtual.googleAds.verbaInvestida)}</p>
              <p className="text-xs text-muted-foreground mt-1">Google Ads</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Retorno Estimado</p>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(retornoEstimado)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{relatorioAtual.googleAds.leadsGerados} leads × conversão</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Lucro</p>
              <p className={`text-3xl font-bold ${lucro > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(lucro)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {lucro > 0 ? '+' : ''}{percentualLucro.toFixed(0)}% de retorno
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">ROI</p>
              <p className="text-3xl font-bold text-blue-600">
                {relatorioAtual.googleAds.roi.toFixed(1)}x
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Cada R$ 1 → R$ {relatorioAtual.googleAds.roi.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          icon={<TrendingUp className="w-6 h-6 text-green-500" />}
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
          icon={<Target className="w-6 h-6 text-purple-500" />}
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
          icon={<Sparkles className="w-6 h-6 text-yellow-500" />}
        />
      </div>

      {/* Insights Automáticos */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Insights Automáticos
          </CardTitle>
          <CardDescription>Análises geradas automaticamente dos seus dados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Melhor Canal */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-600 mb-1">Melhor Performance</p>
                  <p className="text-sm text-muted-foreground">
                    {melhorCanal.nome} gerou {melhorCanal.valor} leads 
                    ({((melhorCanal.valor / relatorioAtual.metricasGerais.leadsTotal) * 100).toFixed(0)}% do total)
                  </p>
                </div>
              </div>
            </div>

            {/* Eficiência IA */}
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-purple-600 mb-1">Economia com IA</p>
                  <p className="text-sm text-muted-foreground">
                    IA resolveu {relatorioAtual.ia.taxaResolucao}% das consultas, 
                    economizando ~{horasEconomizadas}h de atendimento humano
                  </p>
                </div>
              </div>
            </div>

            {/* ROI Destaque */}
            <div className={`p-4 border rounded-lg ${
              relatorioAtual.googleAds.roi > 3 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-yellow-500/10 border-yellow-500/30'
            }`}>
              <div className="flex items-start gap-3">
                <DollarSign className={`w-5 h-5 mt-1 flex-shrink-0 ${
                  relatorioAtual.googleAds.roi > 3 ? 'text-green-600' : 'text-yellow-600'
                }`} />
                <div>
                  <p className={`font-semibold mb-1 ${
                    relatorioAtual.googleAds.roi > 3 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {relatorioAtual.googleAds.roi > 3 ? 'ROI Excepcional' : 'ROI em Atenção'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Google Ads com ROI de {relatorioAtual.googleAds.roi.toFixed(1)}x - 
                    cada R$ 1 investido retorna R$ {relatorioAtual.googleAds.roi.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparativo Mês vs Mês */}
      {relatorioAnterior && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5" />
              Comparativo: {getMonthName(parseInt(relatorioAnterior.mes))} vs {getMonthName(parseInt(relatorioAtual.mes))}
            </CardTitle>
            <CardDescription>Evolução das principais métricas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Leads */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">Leads Totais</p>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div>
                    <p className="text-xl font-bold text-muted-foreground">
                      {relatorioAnterior.metricasGerais.leadsTotal}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xl font-bold">
                      {relatorioAtual.metricasGerais.leadsTotal}
                    </p>
                  </div>
                </div>
                <div className={`inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                  relatorioAtual.metricasGerais.leadsTotal > relatorioAnterior.metricasGerais.leadsTotal 
                    ? 'bg-green-500/10 text-green-600' 
                    : 'bg-red-500/10 text-red-600'
                }`}>
                  {relatorioAtual.metricasGerais.leadsTotal > relatorioAnterior.metricasGerais.leadsTotal 
                    ? <ArrowUp className="w-3 h-3" /> 
                    : <ArrowDown className="w-3 h-3" />
                  }
                  {Math.abs(calculateVariation(
                    relatorioAtual.metricasGerais.leadsTotal,
                    relatorioAnterior.metricasGerais.leadsTotal
                  )).toFixed(1)}%
                </div>
              </div>

              {/* ROI */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">ROI Google Ads</p>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div>
                    <p className="text-xl font-bold text-muted-foreground">
                      {relatorioAnterior.googleAds.roi.toFixed(1)}x
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xl font-bold">
                      {relatorioAtual.googleAds.roi.toFixed(1)}x
                    </p>
                  </div>
                </div>
                <div className={`inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                  relatorioAtual.googleAds.roi > relatorioAnterior.googleAds.roi 
                    ? 'bg-green-500/10 text-green-600' 
                    : 'bg-red-500/10 text-red-600'
                }`}>
                  {relatorioAtual.googleAds.roi > relatorioAnterior.googleAds.roi 
                    ? <ArrowUp className="w-3 h-3" /> 
                    : <ArrowDown className="w-3 h-3" />
                  }
                  {Math.abs(calculateVariation(
                    relatorioAtual.googleAds.roi,
                    relatorioAnterior.googleAds.roi
                  )).toFixed(1)}%
                </div>
              </div>

              {/* Conversão */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">Taxa Conversão</p>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div>
                    <p className="text-xl font-bold text-muted-foreground">
                      {relatorioAnterior.metricasGerais.taxaConversaoGeral}%
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xl font-bold">
                      {relatorioAtual.metricasGerais.taxaConversaoGeral}%
                    </p>
                  </div>
                </div>
                <div className={`inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                  relatorioAtual.metricasGerais.taxaConversaoGeral > relatorioAnterior.metricasGerais.taxaConversaoGeral 
                    ? 'bg-green-500/10 text-green-600' 
                    : 'bg-red-500/10 text-red-600'
                }`}>
                  {relatorioAtual.metricasGerais.taxaConversaoGeral > relatorioAnterior.metricasGerais.taxaConversaoGeral 
                    ? <ArrowUp className="w-3 h-3" /> 
                    : <ArrowDown className="w-3 h-3" />
                  }
                  {Math.abs(calculateVariation(
                    relatorioAtual.metricasGerais.taxaConversaoGeral,
                    relatorioAnterior.metricasGerais.taxaConversaoGeral
                  )).toFixed(1)}%
                </div>
              </div>

              {/* Satisfação IA */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">Satisfação IA</p>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div>
                    <p className="text-xl font-bold text-muted-foreground">
                      {relatorioAnterior.ia.satisfacaoUsuario}%
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xl font-bold">
                      {relatorioAtual.ia.satisfacaoUsuario}%
                    </p>
                  </div>
                </div>
                <div className={`inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                  relatorioAtual.ia.satisfacaoUsuario > relatorioAnterior.ia.satisfacaoUsuario 
                    ? 'bg-green-500/10 text-green-600' 
                    : 'bg-red-500/10 text-red-600'
                }`}>
                  {relatorioAtual.ia.satisfacaoUsuario > relatorioAnterior.ia.satisfacaoUsuario 
                    ? <ArrowUp className="w-3 h-3" /> 
                    : <ArrowDown className="w-3 h-3" />
                  }
                  {Math.abs(calculateVariation(
                    relatorioAtual.ia.satisfacaoUsuario,
                    relatorioAnterior.ia.satisfacaoUsuario
                  )).toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Segunda linha de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Verba Investida"
          value={formatCurrency(relatorioAtual.googleAds.verbaInvestida)}
          subtitle="Google Ads"
          icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
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
            <Line type="monotone" dataKey="IA" stroke="#8b5cf6" strokeWidth={2} />
            <Line type="monotone" dataKey="Redes Sociais" stroke="#f59e0b" strokeWidth={2} />
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
            {relatorioAtual.ia.taxaResolucao >= 80 && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p className="font-medium">Alta taxa de resolução da IA</p>
                  <p className="text-sm text-muted-foreground">
                    {relatorioAtual.ia.taxaResolucao}% das consultas resolvidas automaticamente
                  </p>
                </div>
              </div>
            )}
            {relatorioAtual.googleAds.roi >= 3 && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <p className="font-medium">ROI excepcional em Google Ads</p>
                  <p className="text-sm text-muted-foreground">
                    Retorno de {relatorioAtual.googleAds.roi.toFixed(1)}x sobre investimento de {formatCurrency(relatorioAtual.googleAds.verbaInvestida)}
                  </p>
                </div>
              </div>
            )}
            {relatorioAtual.portal.cadastros > 50 && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                <div>
                  <p className="font-medium">Crescimento no Portal</p>
                  <p className="text-sm text-muted-foreground">
                    {formatNumber(relatorioAtual.portal.cadastros)} novos cadastros com {relatorioAtual.portal.conversoes} conversões
                  </p>
                </div>
              </div>
            )}
            {melhorCanal.valor > relatorioAtual.metricasGerais.leadsTotal * 0.4 && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                <div>
                  <p className="font-medium">Destaque: {melhorCanal.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    Responsável por {((melhorCanal.valor / relatorioAtual.metricasGerais.leadsTotal) * 100).toFixed(0)}% dos leads totais
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