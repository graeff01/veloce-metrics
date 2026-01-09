'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { storageManager } from '@/lib/storage';
import { RelatorioMensal, GoogleAdsData, IAData, PortalData, MetricasGerais } from '@/types';
import { ArrowLeft, Save, TrendingUp, Sparkles, Building2, Target, FileText, Copy } from 'lucide-react';
import Link from 'next/link';
import { getMonthName } from '@/lib/utils';

export default function NovoRelatorioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [etapa, setEtapa] = useState<'escolher' | 'preencher'>('escolher');
  const [modoCopia, setModoCopia] = useState(false);
  const [relatorioOrigem, setRelatorioOrigem] = useState<RelatorioMensal | null>(null);

  const relatorios = storageManager.getRelatorios();
  const ultimoRelatorio = relatorios.length > 0 ? relatorios[relatorios.length - 1] : null;

  const [mesAno, setMesAno] = useState(() => {
    const now = new Date();
    return {
      mes: (now.getMonth() + 1).toString(),
      ano: now.getFullYear()
    };
  });

  const [cliente, setCliente] = useState('');

  const [googleAds, setGoogleAds] = useState<GoogleAdsData>({
    leadsGerados: 0,
    conversoes: 0,
    verbaInvestida: 0,
    cpa: 0,
    roi: 0,
  });

  const [ia, setIA] = useState<IAData>({
    volumeInteracoes: 0,
    leadsQualificados: 0,
    satisfacaoUsuario: 0,
  });

  const [portal, setPortal] = useState<PortalData>({
    visitas: 0,
    cadastros: 0,
    imoveisVisualizados: 0,
    conversoes: 0,
  });

  const [metricasGerais, setMetricasGerais] = useState<MetricasGerais>({
    leadsTotal: 0,
    taxaConversaoGeral: 0,
    ticketMedio: 0,
    nps: 0,
  });

  const [observacoes, setObservacoes] = useState('');

  // Cálculos automáticos
  const cpaCalculado = googleAds.conversoes > 0 ? googleAds.verbaInvestida / googleAds.conversoes : 0;
  const roiCalculado = googleAds.verbaInvestida > 0 && metricasGerais.ticketMedio > 0
    ? ((googleAds.conversoes * metricasGerais.ticketMedio) / googleAds.verbaInvestida)
    : 0;

  const handleDoZero = () => {
    setModoCopia(false);
    setEtapa('preencher');
  };

  const handleCopiar = () => {
    if (ultimoRelatorio) {
      setModoCopia(true);
      setRelatorioOrigem(ultimoRelatorio);
      setCliente(ultimoRelatorio.cliente);
      setGoogleAds(ultimoRelatorio.googleAds);
      setIA(ultimoRelatorio.ia);
      setPortal(ultimoRelatorio.portal);
      setMetricasGerais(ultimoRelatorio.metricasGerais);
      setObservacoes('');
      setEtapa('preencher');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const relatorio: RelatorioMensal = {
      id: Date.now().toString(),
      mes: mesAno.mes,
      ano: mesAno.ano,
      cliente,
      googleAds: {
        ...googleAds,
        cpa: cpaCalculado,
        roi: roiCalculado,
      },
      ia,
      portal,
      metricasGerais,
      observacoes,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    storageManager.saveRelatorio(relatorio);
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  if (etapa === 'escolher') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Novo Relatório Mensal</h1>
            <p className="text-muted-foreground">Como deseja começar?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary group"
            onClick={handleDoZero}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Preencher do Zero</CardTitle>
              <CardDescription>
                Comece com um formulário em branco (15 campos essenciais)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>• Apenas métricas estratégicas</li>
                <li>• Ideal para primeiro relatório</li>
                <li>• ~3-5 minutos para preencher</li>
              </ul>
              <Button className="w-full" variant="outline">
                Começar do Zero
              </Button>
            </CardContent>
          </Card>

          {ultimoRelatorio ? (
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all border-2 border-green-500/50 hover:border-green-500 bg-green-500/5 group"
              onClick={handleCopiar}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                  <Copy className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="flex items-center gap-2">
                  Copiar Mês Anterior
                  <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded-full font-normal">
                    Recomendado
                  </span>
                </CardTitle>
                <CardDescription>
                  Começar com dados de {getMonthName(parseInt(ultimoRelatorio.mes))}/{ultimoRelatorio.ano}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li>• Economiza 80% do tempo ⚡</li>
                  <li>• Mantém consistência</li>
                  <li>• ~1 minuto para ajustar</li>
                </ul>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Copiar e Ajustar
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="opacity-50 cursor-not-allowed">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <Copy className="w-6 h-6 text-muted-foreground" />
                </div>
                <CardTitle>Copiar Mês Anterior</CardTitle>
                <CardDescription>
                  Nenhum relatório anterior encontrado
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setEtapa('escolher')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {modoCopia ? 'Ajustar Relatório' : 'Novo Relatório'}
          </h1>
          <p className="text-muted-foreground">
            {modoCopia 
              ? `Copiado de ${getMonthName(parseInt(relatorioOrigem!.mes))}/${relatorioOrigem!.ano} - Ajuste o que mudou`
              : 'Preencha as métricas estratégicas do mês'
            }
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Período e cliente</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="mes">Mês</Label>
              <Input
                id="mes"
                type="number"
                min="1"
                max="12"
                value={mesAno.mes}
                onChange={(e) => setMesAno({ ...mesAno, mes: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="ano">Ano</Label>
              <Input
                id="ano"
                type="number"
                min="2020"
                max="2030"
                value={mesAno.ano}
                onChange={(e) => setMesAno({ ...mesAno, ano: parseInt(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <Input
                id="cliente"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Nome do cliente"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Google Ads */}
        <Card className="animate-fade-in border-blue-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <CardTitle>Google Ads</CardTitle>
            </div>
            <CardDescription>Investimento e retorno em tráfego pago</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="leadsGerados">
                  Leads Gerados
                  {relatorioOrigem && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (anterior: {relatorioOrigem.googleAds.leadsGerados})
                    </span>
                  )}
                </Label>
                <Input
                  id="leadsGerados"
                  type="number"
                  value={googleAds.leadsGerados}
                  onChange={(e) => setGoogleAds({ ...googleAds, leadsGerados: parseFloat(e.target.value) || 0 })}
                  placeholder="Ex: 85"
                />
              </div>
              <div>
                <Label htmlFor="conversoes">
                  Conversões
                  {relatorioOrigem && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (anterior: {relatorioOrigem.googleAds.conversoes})
                    </span>
                  )}
                </Label>
                <Input
                  id="conversoes"
                  type="number"
                  value={googleAds.conversoes}
                  onChange={(e) => setGoogleAds({ ...googleAds, conversoes: parseFloat(e.target.value) || 0 })}
                  placeholder="Ex: 12"
                />
              </div>
              <div>
                <Label htmlFor="verbaInvestida">
                  Verba Investida (R$)
                  {relatorioOrigem && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (anterior: R$ {relatorioOrigem.googleAds.verbaInvestida.toFixed(2)})
                    </span>
                  )}
                </Label>
                <Input
                  id="verbaInvestida"
                  type="number"
                  step="0.01"
                  value={googleAds.verbaInvestida}
                  onChange={(e) => setGoogleAds({ ...googleAds, verbaInvestida: parseFloat(e.target.value) || 0 })}
                  placeholder="Ex: 4500.00"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Calculado Automaticamente</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">CPA (Custo por Conversão):</span>
                  <p className="font-semibold text-lg">R$ {cpaCalculado.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">ROI (Retorno sobre Investimento):</span>
                  <p className="font-semibold text-lg text-green-600">{roiCalculado.toFixed(1)}x</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* IA Vellarys */}
        <Card className="animate-fade-in border-purple-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <CardTitle>IA Vellarys</CardTitle>
            </div>
            <CardDescription>Assistente virtual e qualificação de leads</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="volumeInteracoes">
                Atendimentos Realizados
                {relatorioOrigem && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    (anterior: {relatorioOrigem.ia.volumeInteracoes})
                  </span>
                )}
              </Label>
              <Input
                id="volumeInteracoes"
                type="number"
                value={ia.volumeInteracoes}
                onChange={(e) => setIA({ ...ia, volumeInteracoes: parseFloat(e.target.value) || 0 })}
                placeholder="Ex: 450"
              />
            </div>
            <div>
              <Label htmlFor="leadsQualificados">
                Leads Qualificados
                {relatorioOrigem && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    (anterior: {relatorioOrigem.ia.leadsQualificados})
                  </span>
                )}
              </Label>
              <Input
                id="leadsQualificados"
                type="number"
                value={ia.leadsQualificados}
                onChange={(e) => setIA({ ...ia, leadsQualificados: parseFloat(e.target.value) || 0 })}
                placeholder="Ex: 32"
              />
            </div>
            <div>
              <Label htmlFor="satisfacaoUsuario">
                Satisfação (%)
                {relatorioOrigem && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    (anterior: {relatorioOrigem.ia.satisfacaoUsuario}%)
                  </span>
                )}
              </Label>
              <Input
                id="satisfacaoUsuario"
                type="number"
                step="0.1"
                max="100"
                value={ia.satisfacaoUsuario}
                onChange={(e) => setIA({ ...ia, satisfacaoUsuario: parseFloat(e.target.value) || 0 })}
                placeholder="Ex: 92"
              />
            </div>
          </CardContent>
        </Card>

        {/* Portal de Imóveis */}
        <Card className="animate-fade-in border-cyan-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-600" />
              <CardTitle>Portal de Imóveis</CardTitle>
            </div>
            <CardDescription>Tráfego orgânico e conversões do portal</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="visitas">
                Visitas ao Portal
                {relatorioOrigem && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    (anterior: {relatorioOrigem.portal.visitas})
                  </span>
                )}
              </Label>
              <Input
                id="visitas"
                type="number"
                value={portal.visitas}
                onChange={(e) => setPortal({ ...portal, visitas: parseFloat(e.target.value) || 0 })}
                placeholder="Ex: 2800"
              />
            </div>
            <div>
              <Label htmlFor="cadastros">
                Novos Cadastros
                {relatorioOrigem && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    (anterior: {relatorioOrigem.portal.cadastros})
                  </span>
                )}
              </Label>
              <Input
                id="cadastros"
                type="number"
                value={portal.cadastros}
                onChange={(e) => setPortal({ ...portal, cadastros: parseFloat(e.target.value) || 0 })}
                placeholder="Ex: 68"
              />
            </div>
            <div>
              <Label htmlFor="imoveisVisualizados">
                Imóveis Visualizados
                {relatorioOrigem && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    (anterior: {relatorioOrigem.portal.imoveisVisualizados})
                  </span>
                )}
              </Label>
              <Input
                id="imoveisVisualizados"
                type="number"
                value={portal.imoveisVisualizados}
                onChange={(e) => setPortal({ ...portal, imoveisVisualizados: parseFloat(e.target.value) || 0 })}
                placeholder="Ex: 5200"
              />
            </div>
            <div>
              <Label htmlFor="conversoes">
                Conversões (Propostas/Agendamentos)
                {relatorioOrigem && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    (anterior: {relatorioOrigem.portal.conversoes})
                  </span>
                )}
              </Label>
              <Input
                id="conversoes"
                type="number"
                value={portal.conversoes}
                onChange={(e) => setPortal({ ...portal, conversoes: parseFloat(e.target.value) || 0 })}
                placeholder="Ex: 15"
              />
            </div>
          </CardContent>
        </Card>

        {/* Métricas Gerais */}
        <Card className="animate-fade-in border-green-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              <CardTitle>Métricas Consolidadas</CardTitle>
            </div>
            <CardDescription>Indicadores gerais de performance</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="leadsTotal">Total de Leads</Label>
              <Input
                id="leadsTotal"
                type="number"
                value={metricasGerais.leadsTotal}
                onChange={(e) => setMetricasGerais({ ...metricasGerais, leadsTotal: parseFloat(e.target.value) || 0 })}
                placeholder="Ex: 132"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Soma de todos os canais
              </p>
            </div>
            <div>
              <Label htmlFor="taxaConversaoGeral">Taxa de Conversão (%)</Label>
              <Input
                id="taxaConversaoGeral"
                type="number"
                step="0.1"
                max="100"
                value={metricasGerais.taxaConversaoGeral}
                onChange={(e) => setMetricasGerais({ ...metricasGerais, taxaConversaoGeral: parseFloat(e.target.value) || 0 })}
                placeholder="Ex: 9.1"
              />
            </div>
            <div>
              <Label htmlFor="ticketMedio">Ticket Médio (R$)</Label>
              <Input
                id="ticketMedio"
                type="number"
                step="0.01"
                value={metricasGerais.ticketMedio}
                onChange={(e) => setMetricasGerais({ ...metricasGerais, ticketMedio: parseFloat(e.target.value) || 0 })}
                placeholder="Ex: 285000"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Usado para calcular ROI
              </p>
            </div>
            <div>
              <Label htmlFor="nps">NPS (0-10)</Label>
              <Input
                id="nps"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={metricasGerais.nps}
                onChange={(e) => setMetricasGerais({ ...metricasGerais, nps: parseFloat(e.target.value) || 0 })}
                placeholder="Ex: 8.5"
              />
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Observações</CardTitle>
            <CardDescription>Destaques, insights e pontos de atenção do mês</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Campanha focada em lançamento do novo empreendimento X. IA apresentou melhora significativa na qualificação..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Botões */}
        <div className="flex justify-end gap-4 sticky bottom-4 bg-background/95 backdrop-blur p-4 rounded-lg border">
          <Button type="button" variant="outline" onClick={() => setEtapa('escolher')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} size="lg">
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Relatório'}
          </Button>
        </div>
      </form>
    </div>
  );
}