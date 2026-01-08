'use client';

import { useEffect, useState } from 'react';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard, LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from '@/components/dashboard/ChartCard';
import { PresentationMode } from '@/components/PresentationMode';
import { SlideIntro, SlideKPIs, SlideEvolution, SlideChannelPerformance, SlideHighlights } from '@/components/presentation/PresentationSlides';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { storageManager } from '@/lib/storage';
import { RelatorioMensal } from '@/types';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Sparkles, 
  Globe, 
  Maximize2, 
  AlertCircle, 
  ArrowRight,
  Clock,
  MessageSquare,
  Zap,
  Award,
  TrendingDown,
  Minus
} from 'lucide-react';
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

  // Cálculos
  const horasEconomizadas = Math.round((relatorioAtual.ia.volumeInteracoes * 
    (relatorioAtual.ia.taxaResolucao / 100) * 5) / 60);

  // Dados para os gráficos
  const leadsPorMes = relatorios.map(r => ({
    mes: `${r.mes}/${r.ano}`,
    'Google Ads': r.googleAds.leadsGerados,
    'IA Vellarys': r.ia.leadsQualificados,
    'Redes Sociais': r.redesSociais.leadsOrganicos,
    'Portal': r.portal.conversoes,
  }));

  const performanceCanais = [
    { nome: 'Google Ads', valor: relatorioAtual.googleAds.leadsGerados, cor: '#3b82f6' },
    { nome: 'IA Vellarys', valor: relatorioAtual.ia.leadsQualificados, cor: '#8b5cf6' },
    { nome: 'Portal', valor: relatorioAtual.portal.conversoes, cor: '#10b981' },
    { nome: 'Redes Sociais', valor: relatorioAtual.redesSociais.leadsOrganicos, cor: '#f59e0b' },
  ];

  const melhorCanal = [...performanceCanais].sort((a, b) => b.valor - a.valor)[0];

  const eficienciaIA = relatorios.slice(-3).map(r => ({
    mes: `${r.mes}/${r.ano}`,
    'Taxa Resolução': r.ia.taxaResolucao,
    'Satisfação': r.ia.satisfacaoUsuario,
    'Leads Qualificados': r.ia.leadsQualificados,
  }));

  const investimentoPorMes = relatorios.map(r => ({
    mes: `${r.mes}/${r.ano}`,
    'Verba': r.googleAds.verbaInvestida,
    'CPA': r.googleAds.cpa,
  }));

  // Alertas e Recomendações
  const alertas = [];
  if (relatorioAtual.googleAds.cpa > 80) {
    alertas.push({ 
      tipo: 'warning', 
      icone: AlertCircle,
      titulo: 'CPA Elevado',
      mensagem: `Custo por lead em R$ ${relatorioAtual.googleAds.cpa.toFixed(2)}. Recomendamos otimizar segmentação.` 
    });
  }
  if (relatorioAtual.ia.satisfacaoUsuario < 80) {
    alertas.push({ 
      tipo: 'warning', 
      icone: MessageSquare,
      titulo: 'Satisfação IA Abaixo do Ideal',
      mensagem: `${relatorioAtual.ia.satisfacaoUsuario}% de satisfação. Revisar respostas e treinar modelo.` 
    });
  }
  if (relatorioAtual.portal.taxaRejeicao > 50) {
    alertas.push({ 
      tipo: 'warning', 
      icone: Globe,
      titulo: 'Taxa de Rejeição Alta',
      mensagem: `${relatorioAtual.portal.taxaRejeicao}% de rejeição. Otimizar UX e velocidade do portal.` 
    });
  }
  if (relatorioAnterior && relatorioAtual.metricasGerais.leadsTotal < relatorioAnterior.metricasGerais.leadsTotal * 0.85) {
    alertas.push({ 
      tipo: 'danger', 
      icone: TrendingDown,
      titulo: 'Queda Significativa de Leads',
      mensagem: `Redução de ${Math.abs(calculateVariation(relatorioAtual.metricasGerais.leadsTotal, relatorioAnterior.metricasGerais.leadsTotal)).toFixed(0)}% vs mês anterior. Análise urgente necessária.` 
    });
  }

  // Destaques positivos
  const destaques = [];
  if (relatorioAtual.ia.taxaResolucao >= 80) {
    destaques.push({
      icone: Sparkles,
      cor: 'purple',
      titulo: 'Excelente Performance da IA',
      descricao: `${relatorioAtual.ia.taxaResolucao}% de resolução automática, economizando ~${horasEconomizadas}h de atendimento humano`
    });
  }
  if (relatorioAtual.googleAds.roi >= 3) {
    destaques.push({
      icone: TrendingUp,
      cor: 'green',
      titulo: 'ROI Excepcional em Anúncios',
      descricao: `Retorno de ${relatorioAtual.googleAds.roi.toFixed(1)}x sobre ${formatCurrency(relatorioAtual.googleAds.verbaInvestida)} investidos`
    });
  }
  if (melhorCanal.valor > relatorioAtual.metricasGerais.leadsTotal * 0.4) {
    destaques.push({
      icone: Award,
      cor: 'blue',
      titulo: `Destaque: ${melhorCanal.nome}`,
      descricao: `Responsável por ${((melhorCanal.valor / relatorioAtual.metricasGerais.leadsTotal) * 100).toFixed(0)}% dos leads totais do período`
    });
  }
  if (relatorioAnterior && relatorioAtual.metricasGerais.taxaConversaoGeral > relatorioAnterior.metricasGerais.taxaConversaoGeral * 1.1) {
    destaques.push({
      icone: Target,
      cor: 'emerald',
      titulo: 'Melhoria em Conversão',
      descricao: `Taxa de conversão subiu de ${relatorioAnterior.metricasGerais.taxaConversaoGeral}% para ${relatorioAtual.metricasGerais.taxaConversaoGeral}%`
    });
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral' | undefined) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral' | undefined) => {
    if (trend === 'up') return 'text-green-600 bg-green-500/10';
    if (trend === 'down') return 'text-red-600 bg-red-500/10';
    return 'text-muted-foreground bg-muted';
  };

  return (
    <div className="space-y-6">
      {/* Header Elegante */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Performance de Marketing
            </h1>
            <Badge variant="outline" className="text-xs">
              {getMonthName(parseInt(relatorioAtual.mes))} {relatorioAtual.ano}
            </Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            {relatorioAtual.cliente}
          </p>
        </div>
        <Button
          onClick={() => setIsPresentationMode(true)}
          size="lg"
          className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Maximize2 className="w-5 h-5" />
          Modo Apresentação
        </Button>
      </div>

      {/* Alertas e Recomendações */}
      {alertas.length > 0 && (
        <Card className={`border-2 animate-fade-in ${
          alertas.some(a => a.tipo === 'danger') 
            ? 'border-red-500/50 bg-red-500/5' 
            : 'border-yellow-500/50 bg-yellow-500/5'
        }`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="w-5 h-5" />
              Pontos de Atenção & Recomendações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {alertas.map((alerta, index) => {
                const Icon = alerta.icone;
                return (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border">
                    <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      alerta.tipo === 'danger' ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                    <div>
                      <p className="font-semibold text-sm">{alerta.titulo}</p>
                      <p className="text-sm text-muted-foreground mt-1">{alerta.mensagem}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPIs Principais - Grade Otimizada */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          title="CPA Médio"
          value={formatCurrency(relatorioAtual.googleAds.cpa)}
          subtitle="custo por aquisição"
          trend={
            relatorioAnterior
              ? relatorioAtual.googleAds.cpa < relatorioAnterior.googleAds.cpa
                ? 'up'
                : relatorioAtual.googleAds.cpa > relatorioAnterior.googleAds.cpa
                ? 'down'
                : 'neutral'
              : undefined
          }
          variation={
            relatorioAnterior
              ? calculateVariation(relatorioAtual.googleAds.cpa, relatorioAnterior.googleAds.cpa)
              : undefined
          }
          icon={<DollarSign className="w-6 h-6 text-green-500" />}
          valueColor={relatorioAtual.googleAds.cpa < 50 ? 'text-green-500' : relatorioAtual.googleAds.cpa > 80 ? 'text-red-500' : ''}
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
          title="ROI Campanhas"
          value={`${relatorioAtual.googleAds.roi.toFixed(1)}x`}
          subtitle="retorno sobre investimento"
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
          icon={<TrendingUp className="w-6 h-6 text-emerald-500" />}
          valueColor="text-emerald-500"
        />
      </div>

      {/* Performance da IA - Destaque */}
      <Card className="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/20 animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Performance da IA Vellarys
              </CardTitle>
              <CardDescription>Assistente virtual inteligente</CardDescription>
            </div>
            <Badge className="bg-purple-600 hover:bg-purple-700">
              {horasEconomizadas}h economizadas
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-background/50 border">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-muted-foreground">Volume</span>
              </div>
              <p className="text-2xl font-bold">{formatNumber(relatorioAtual.ia.volumeInteracoes)}</p>
              <p className="text-xs text-muted-foreground mt-1">interações no período</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 border">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-muted-foreground">Taxa Resolução</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{relatorioAtual.ia.taxaResolucao}%</p>
              <p className="text-xs text-muted-foreground mt-1">resolvidas automaticamente</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-muted-foreground">Tempo Médio</span>
              </div>
              <p className="text-2xl font-bold">{relatorioAtual.ia.tempoMedioResposta} min</p>
              <p className="text-xs text-muted-foreground mt-1">tempo de resposta</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 border">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-muted-foreground">Satisfação</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{relatorioAtual.ia.satisfacaoUsuario}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                {relatorioAnterior && (
                  <span className={getTrendColor(
                    relatorioAtual.ia.satisfacaoUsuario > relatorioAnterior.ia.satisfacaoUsuario ? 'up' : 
                    relatorioAtual.ia.satisfacaoUsuario < relatorioAnterior.ia.satisfacaoUsuario ? 'down' : 'neutral'
                  )}>
                    {relatorioAtual.ia.satisfacaoUsuario > relatorioAnterior.ia.satisfacaoUsuario ? '+' : ''}
                    {(relatorioAtual.ia.satisfacaoUsuario - relatorioAnterior.ia.satisfacaoUsuario).toFixed(1)}%
                  </span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparativo Mês a Mês */}
      {relatorioAnterior && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5" />
              Comparativo Mensal
            </CardTitle>
            <CardDescription>
              {getMonthName(parseInt(relatorioAnterior.mes))} vs {getMonthName(parseInt(relatorioAtual.mes))} {relatorioAtual.ano}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { 
                  label: 'Leads', 
                  anterior: relatorioAnterior.metricasGerais.leadsTotal, 
                  atual: relatorioAtual.metricasGerais.leadsTotal,
                  melhorMaior: true
                },
                { 
                  label: 'CPA', 
                  anterior: relatorioAnterior.googleAds.cpa, 
                  atual: relatorioAtual.googleAds.cpa,
                  melhorMaior: false,
                  format: formatCurrency
                },
                { 
                  label: 'Conversão', 
                  anterior: relatorioAnterior.metricasGerais.taxaConversaoGeral, 
                  atual: relatorioAtual.metricasGerais.taxaConversaoGeral,
                  melhorMaior: true,
                  suffix: '%'
                },
                { 
                  label: 'ROI', 
                  anterior: relatorioAnterior.googleAds.roi, 
                  atual: relatorioAtual.googleAds.roi,
                  melhorMaior: true,
                  suffix: 'x',
                  decimals: 1
                },
              ].map((item, index) => {
                const variacao = calculateVariation(item.atual, item.anterior);
                const melhorou = item.melhorMaior ? variacao > 0 : variacao < 0;
                const trend = variacao > 0 ? 'up' : variacao < 0 ? 'down' : 'neutral';
                const trendAjustado = item.melhorMaior ? trend : (trend === 'up' ? 'down' : trend === 'down' ? 'up' : 'neutral');
                
                return (
                  <div key={index} className="p-4 rounded-lg border bg-card">
                    <p className="text-sm text-muted-foreground mb-3">{item.label}</p>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-sm text-muted-foreground line-through">
                        {item.format ? item.format(item.anterior) : item.anterior.toFixed(item.decimals || 0)}{item.suffix || ''}
                      </span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xl font-bold">
                        {item.format ? item.format(item.atual) : item.atual.toFixed(item.decimals || 0)}{item.suffix || ''}
                      </span>
                    </div>
                    <div className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${getTrendColor(trendAjustado)}`}>
                      {getTrendIcon(trendAjustado)}
                      {Math.abs(variacao).toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Destaques Positivos */}
      {destaques.length > 0 && (
        <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Destaques do Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {destaques.map((destaque, index) => {
                const Icon = destaque.icone;
                const corClass = {
                  purple: 'bg-purple-500/10 border-purple-500/30 text-purple-600',
                  green: 'bg-green-500/10 border-green-500/30 text-green-600',
                  blue: 'bg-blue-500/10 border-blue-500/30 text-blue-600',
                  emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600',
                }[destaque.cor];

                return (
                  <div key={index} className={`flex items-start gap-3 p-4 rounded-lg border ${corClass}`}>
                    <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm mb-1">{destaque.titulo}</p>
                      <p className="text-sm opacity-80">{destaque.descricao}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Investimento Google Ads */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Investimento Google Ads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Verba do Mês</p>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(relatorioAtual.googleAds.verbaInvestida)}</p>
            </div>
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Impressões</span>
                <span className="font-semibold">{formatNumber(relatorioAtual.googleAds.impressoes)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cliques</span>
                <span className="font-semibold">{formatNumber(relatorioAtual.googleAds.cliques)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">CTR</span>
                <span className="font-semibold">{relatorioAtual.googleAds.ctr.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Conversões</span>
                <span className="font-semibold text-green-600">{relatorioAtual.googleAds.conversoes}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Canais Digitais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-cyan-500" />
                  <span className="text-sm text-muted-foreground">Portal</span>
                </div>
                <p className="text-2xl font-bold">{formatNumber(relatorioAtual.portal.visitas)}</p>
                <p className="text-xs text-muted-foreground">{relatorioAtual.portal.conversoes} conversões</p>
              </div>
              <div className="p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-muted-foreground">Redes Sociais</span>
                </div>
                <p className="text-2xl font-bold">{formatNumber(relatorioAtual.redesSociais.alcance)}</p>
                <p className="text-xs text-muted-foreground">{relatorioAtual.redesSociais.leadsOrganicos} leads orgânicos</p>
              </div>
              <div className="p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-muted-foreground">Engajamento</span>
                </div>
                <p className="text-2xl font-bold">{formatNumber(relatorioAtual.redesSociais.engajamento)}</p>
                <p className="text-xs text-muted-foreground">{relatorioAtual.redesSociais.interacoes} interações</p>
              </div>
              <div className="p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">NPS</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{relatorioAtual.metricasGerais.nps.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Net Promoter Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard
          title="Evolução de Leads por Canal"
          description="Performance ao longo dos meses"
        >
          <LineChart data={leadsPorMes}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
            <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="Google Ads" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="IA Vellarys" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Redes Sociais" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Portal" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ChartCard>

        <ChartCard
          title="Distribuição de Leads"
          description="Por canal no mês atual"
        >
          <BarChart data={performanceCanais}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="nome" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
            <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Bar dataKey="valor" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard
          title="Eficiência da IA"
          description="Taxa de resolução e satisfação"
        >
          <AreaChart data={eficienciaIA}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
            <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Area type="monotone" dataKey="Taxa Resolução" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
            <Area type="monotone" dataKey="Satisfação" stroke="#ec4899" fill="#ec4899" fillOpacity={0.3} />
          </AreaChart>
        </ChartCard>

        <ChartCard
          title="Investimento e CPA"
          description="Verba vs custo por aquisição"
        >
          <AreaChart data={investimentoPorMes}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
            <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Area type="monotone" dataKey="Verba" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            <Area type="monotone" dataKey="CPA" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
          </AreaChart>
        </ChartCard>
      </div>

      {/* Observações */}
      {relatorioAtual.observacoes && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-base">Observações do Período</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {relatorioAtual.observacoes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modo Apresentaçãoo */}
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