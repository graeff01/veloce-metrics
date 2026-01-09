import { RelatorioMensal } from '@/types';
import { TrendingUp, Users, DollarSign, Target, Sparkles, Building2 } from 'lucide-react';
import { formatCurrency, formatNumber, calculateVariation, getMonthName } from '@/lib/utils';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SlideProps {
  relatorioAtual: RelatorioMensal;
  relatorioAnterior?: RelatorioMensal | null;
  relatorios?: RelatorioMensal[];
}

export function SlideIntro({ relatorioAtual }: SlideProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 p-12">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Veloce Metrics
        </h1>
        <p className="text-2xl text-muted-foreground">Dashboard de Performance</p>
      </div>
      
      <div className="space-y-2">
        <p className="text-4xl font-bold">
          {getMonthName(parseInt(relatorioAtual.mes))}/{relatorioAtual.ano}
        </p>
        <p className="text-xl text-muted-foreground">{relatorioAtual.cliente}</p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-8 w-full max-w-2xl">
        <div className="p-6 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <Users className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-sm text-muted-foreground">Leads Totais</p>
          <p className="text-3xl font-bold">{formatNumber(relatorioAtual.metricasGerais.leadsTotal)}</p>
        </div>
        <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/20">
          <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-sm text-muted-foreground">ROI Google Ads</p>
          <p className="text-3xl font-bold text-green-600">{relatorioAtual.googleAds.roi.toFixed(1)}x</p>
        </div>
      </div>
    </div>
  );
}

export function SlideKPIs({ relatorioAtual, relatorioAnterior }: SlideProps) {
  const kpis = [
    {
      title: 'Leads Totais',
      value: formatNumber(relatorioAtual.metricasGerais.leadsTotal),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      variacao: relatorioAnterior ? calculateVariation(
        relatorioAtual.metricasGerais.leadsTotal,
        relatorioAnterior.metricasGerais.leadsTotal
      ) : null
    },
    {
      title: 'ROI Google Ads',
      value: `${relatorioAtual.googleAds.roi.toFixed(1)}x`,
      subtitle: `CPA: ${formatCurrency(relatorioAtual.googleAds.cpa)}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
      variacao: relatorioAnterior ? calculateVariation(
        relatorioAtual.googleAds.roi,
        relatorioAnterior.googleAds.roi
      ) : null
    },
    {
      title: 'Taxa de Conversão',
      value: `${relatorioAtual.metricasGerais.taxaConversaoGeral}%`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
      variacao: relatorioAnterior ? calculateVariation(
        relatorioAtual.metricasGerais.taxaConversaoGeral,
        relatorioAnterior.metricasGerais.taxaConversaoGeral
      ) : null
    },
    {
      title: 'Satisfação IA',
      value: `${relatorioAtual.ia.satisfacaoUsuario}%`,
      subtitle: `${formatNumber(relatorioAtual.ia.volumeInteracoes)} atendimentos`,
      icon: Sparkles,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10',
      variacao: relatorioAnterior ? calculateVariation(
        relatorioAtual.ia.satisfacaoUsuario,
        relatorioAnterior.ia.satisfacaoUsuario
      ) : null
    },
  ];

  return (
    <div className="h-full flex flex-col p-12">
      <h2 className="text-4xl font-bold mb-8">Principais Indicadores</h2>
      
      <div className="grid grid-cols-2 gap-6 flex-1">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={index}
              className={`${kpi.bgColor} border border-opacity-20 rounded-lg p-6 flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">{kpi.title}</p>
                  <p className={`text-4xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  {kpi.subtitle && (
                    <p className="text-sm text-muted-foreground mt-2">{kpi.subtitle}</p>
                  )}
                </div>
                <Icon className={`w-10 h-10 ${kpi.color}`} />
              </div>
              
              {kpi.variacao !== null && (
                <div className="mt-4 flex items-center gap-2">
                  {kpi.variacao > 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingUp className="w-5 h-5 text-red-600 rotate-180" />
                  )}
                  <span className={`text-lg font-semibold ${
                    kpi.variacao > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.variacao > 0 ? '+' : ''}{kpi.variacao.toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs mês anterior</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SlideEvolution({ relatorios }: { relatorios: RelatorioMensal[] }) {
  // ✅ APENAS GOOGLE ADS, IA E PORTAL
  const data = relatorios.map(r => ({
    mes: `${r.mes}/${r.ano}`,
    'Google Ads': r.googleAds.leadsGerados,
    'IA Vellarys': r.ia.leadsQualificados,
    'Portal': r.portal.conversoes,
  }));

  return (
    <div className="h-full flex flex-col p-12">
      <h2 className="text-4xl font-bold mb-8">Evolução de Leads por Canal</h2>
      
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="mes" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '14px' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '14px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '14px' }}
            />
            <Line 
              type="monotone" 
              dataKey="Google Ads" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="IA Vellarys" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="Portal" 
              stroke="#06b6d4" 
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function SlideChannelPerformance({ relatorioAtual }: SlideProps) {
  const data = [
    { 
      nome: 'Google Ads', 
      valor: relatorioAtual.googleAds.leadsGerados,
      cor: '#3b82f6'
    },
    { 
      nome: 'IA Vellarys', 
      valor: relatorioAtual.ia.leadsQualificados,
      cor: '#8b5cf6'
    },
    { 
      nome: 'Portal', 
      valor: relatorioAtual.portal.conversoes,
      cor: '#06b6d4'
    },
  ];

  return (
    <div className="h-full flex flex-col p-12">
      <h2 className="text-4xl font-bold mb-8">Performance por Canal</h2>
      
      <div className="flex-1 grid grid-cols-2 gap-8">
        <div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="nome" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '14px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '14px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="valor" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col justify-center space-y-6">
          {data.map((canal, index) => (
            <div key={index} className="p-6 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground mb-1">{canal.nome}</p>
              <p className="text-4xl font-bold" style={{ color: canal.cor }}>
                {formatNumber(canal.valor)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">leads gerados</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SlideHighlights({ relatorioAtual }: SlideProps) {
  const destaques = [];

  // ✅ ROI Google Ads (campo que existe)
  if (relatorioAtual.googleAds.roi >= 5) {
    destaques.push({
      icon: TrendingUp,
      title: 'ROI excepcional em Google Ads',
      description: `Retorno de ${relatorioAtual.googleAds.roi.toFixed(1)}x sobre investimento de ${formatCurrency(relatorioAtual.googleAds.verbaInvestida)}`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10'
    });
  }

  // ✅ Satisfação IA (campo que existe)
  if (relatorioAtual.ia.satisfacaoUsuario >= 85) {
    destaques.push({
      icon: Sparkles,
      title: 'Alta satisfação com a IA',
      description: `${relatorioAtual.ia.satisfacaoUsuario}% de satisfação em ${formatNumber(relatorioAtual.ia.volumeInteracoes)} atendimentos`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10'
    });
  }

  // ✅ Leads qualificados pela IA (campo que existe)
  if (relatorioAtual.ia.leadsQualificados >= 20) {
    destaques.push({
      icon: Sparkles,
      title: 'IA com alta performance',
      description: `${relatorioAtual.ia.leadsQualificados} leads qualificados pela IA Vellarys`,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10'
    });
  }

  // ✅ Portal - Conversões (campo que existe)
  if (relatorioAtual.portal.conversoes >= 10) {
    destaques.push({
      icon: Building2,
      title: 'Conversões no Portal',
      description: `${relatorioAtual.portal.conversoes} conversões com ${formatNumber(relatorioAtual.portal.cadastros)} novos cadastros`,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-500/10'
    });
  }

  // ✅ Taxa de conversão geral (campo que existe)
  if (relatorioAtual.metricasGerais.taxaConversaoGeral >= 8) {
    destaques.push({
      icon: Target,
      title: 'Excelente Taxa de Conversão',
      description: `${relatorioAtual.metricasGerais.taxaConversaoGeral}% de conversão geral`,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10'
    });
  }

  return (
    <div className="h-full flex flex-col p-12">
      <h2 className="text-4xl font-bold mb-8">Destaques do Mês</h2>
      
      <div className="flex-1 grid grid-cols-2 gap-6">
        {destaques.length > 0 ? (
          destaques.map((destaque, index) => {
            const Icon = destaque.icon;
            return (
              <div 
                key={index}
                className={`${destaque.bgColor} border border-opacity-20 rounded-lg p-8 flex flex-col`}
              >
                <Icon className={`w-12 h-12 ${destaque.color} mb-4`} />
                <h3 className="text-2xl font-bold mb-3">{destaque.title}</h3>
                <p className="text-lg text-muted-foreground">{destaque.description}</p>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 flex items-center justify-center">
            <p className="text-xl text-muted-foreground">Nenhum destaque especial este mês</p>
          </div>
        )}

        {relatorioAtual.observacoes && (
          <div className="col-span-2 bg-secondary/50 rounded-lg p-8 mt-4">
            <h3 className="text-xl font-bold mb-3">Observações</h3>
            <p className="text-lg text-muted-foreground">{relatorioAtual.observacoes}</p>
          </div>
        )}
      </div>
    </div>
  );
}