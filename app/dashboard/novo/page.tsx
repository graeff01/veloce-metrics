'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { storageManager } from '@/lib/storage';
import { RelatorioMensal, GoogleAdsData, IAData, PortalData, RedesSociaisData, MetricasGerais } from '@/types';
import { ArrowLeft, Save, ChevronDown, ChevronUp, FileText, Copy, Sparkles } from 'lucide-react';
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

  const [expandedSections, setExpandedSections] = useState({
    googleAds: true,
    ia: true,
    portal: false,
    redesSociais: false,
    avancado: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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
    cpa: 0,
    ctr: 0,
    conversoes: 0,
    verbaInvestida: 0,
    roi: 0,
    impressoes: 0,
    cliques: 0,
  });

  const [ia, setIA] = useState<IAData>({
    volumeInteracoes: 0,
    taxaResolucao: 0,
    tempoMedioResposta: 0,
    satisfacaoUsuario: 0,
    leadsQualificados: 0,
    comparativoHumano: 0,
  });

  const [portal, setPortal] = useState<PortalData>({
    visitas: 0,
    cadastros: 0,
    imoveisVisualizados: 0,
    conversoes: 0,
    tempoMedioSite: 0,
    taxaRejeicao: 0,
  });

  const [redesSociais, setRedesSociais] = useState<RedesSociaisData>({
    alcance: 0,
    engajamento: 0,
    leadsOrganicos: 0,
    custoPorLead: 0,
    seguidoresNovos: 0,
    interacoes: 0,
  });

  const [metricasGerais, setMetricasGerais] = useState<MetricasGerais>({
    leadsTotal: 0,
    taxaConversaoGeral: 0,
    ticketMedio: 0,
    nps: 0,
  });

  const [observacoes, setObservacoes] = useState('');

  const cpaCalculado = googleAds.conversoes > 0 ? googleAds.verbaInvestida / googleAds.conversoes : 0;
  const ctrCalculado = googleAds.impressoes > 0 ? (googleAds.cliques / googleAds.impressoes) * 100 : 0;
  const roiCalculado = googleAds.verbaInvestida > 0 && metricasGerais.ticketMedio > 0
    ? ((googleAds.leadsGerados * metricasGerais.ticketMedio * (metricasGerais.taxaConversaoGeral / 100)) / googleAds.verbaInvestida)
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
      setRedesSociais(ultimoRelatorio.redesSociais);
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
        ctr: ctrCalculado,
        roi: roiCalculado,
      },
      ia,
      portal,
      redesSociais,
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
                Comece com um formulário em branco e preencha todos os campos manualmente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>• Controle total sobre os dados</li>
                <li>• Ideal para primeiro relatório</li>
                <li>• ~5-10 minutos para preencher</li>
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
                  Começe com os dados de {getMonthName(parseInt(ultimoRelatorio.mes))}/{ultimoRelatorio.ano} e ajuste apenas o que mudou
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li>• Economiza ~80% do tempo ⚡</li>
                  <li>• Mantém consistência dos dados</li>
                  <li>• ~1-2 minutos para ajustar</li>
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
                  Nenhum relatório anterior encontrado. Crie o primeiro!
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
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
              : 'Preencha as métricas do mês'
            }
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Período e cliente do relatório</CardDescription>
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

        <Card className="animate-fade-in">
          <CardHeader 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => toggleSection('googleAds')}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Google Ads
                  <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full font-normal">
                    Essencial
                  </span>
                </CardTitle>
                <CardDescription>Métricas de campanhas pagas</CardDescription>
              </div>
              {expandedSections.googleAds ? <ChevronUp /> : <ChevronDown />}
            </div>
          </CardHeader>
          
          {expandedSections.googleAds && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leadsGerados">
                    Leads Gerados
                    {relatorioOrigem && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        💭 {relatorioOrigem.googleAds.leadsGerados} anterior
                      </span>
                    )}
                  </Label>
                  <Input
                    id="leadsGerados"
                    type="number"
                    value={googleAds.leadsGerados}
                    onChange={(e) => setGoogleAds({ ...googleAds, leadsGerados: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="verbaInvestida">
                    Verba Investida (R$)
                    {relatorioOrigem && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        💭 R$ {relatorioOrigem.googleAds.verbaInvestida.toFixed(2)} anterior
                      </span>
                    )}
                  </Label>
                  <Input
                    id="verbaInvestida"
                    type="number"
                    step="0.01"
                    value={googleAds.verbaInvestida}
                    onChange={(e) => setGoogleAds({ ...googleAds, verbaInvestida: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="conversoes">Conversões</Label>
                  <Input
                    id="conversoes"
                    type="number"
                    value={googleAds.conversoes}
                    onChange={(e) => setGoogleAds({ ...googleAds, conversoes: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Calculado Automaticamente</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">CPA:</span>
                    <p className="font-semibold">R$ {cpaCalculado.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CTR:</span>
                    <p className="font-semibold">{ctrCalculado.toFixed(2)}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ROI:</span>
                    <p className="font-semibold">{roiCalculado.toFixed(1)}x</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('avancado')}
                  className="text-xs"
                >
                  {expandedSections.avancado ? 'Ocultar' : 'Mostrar'} Detalhes Avançados
                  {expandedSections.avancado ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                </Button>
                
                {expandedSections.avancado && (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <Label htmlFor="impressoes">Impressões</Label>
                      <Input
                        id="impressoes"
                        type="number"
                        value={googleAds.impressoes}
                        onChange={(e) => setGoogleAds({ ...googleAds, impressoes: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cliques">Cliques</Label>
                      <Input
                        id="cliques"
                        type="number"
                        value={googleAds.cliques}
                        onChange={(e) => setGoogleAds({ ...googleAds, cliques: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="animate-fade-in">
          <CardHeader 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => toggleSection('ia')}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  IA Vellarys
                  <span className="text-xs bg-purple-500/10 text-purple-600 px-2 py-1 rounded-full font-normal">
                    Essencial
                  </span>
                </CardTitle>
                <CardDescription>Performance do assistente virtual</CardDescription>
              </div>
              {expandedSections.ia ? <ChevronUp /> : <ChevronDown />}
            </div>
          </CardHeader>
          
          {expandedSections.ia && (
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="volumeInteracoes">
                  Volume de Interações
                  {relatorioOrigem && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      💭 {relatorioOrigem.ia.volumeInteracoes} anterior
                    </span>
                  )}
                </Label>
                <Input
                  id="volumeInteracoes"
                  type="number"
                  value={ia.volumeInteracoes}
                  onChange={(e) => setIA({ ...ia, volumeInteracoes: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="satisfacaoUsuario">
                  Satisfação (%)
                  {relatorioOrigem && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      💭 {relatorioOrigem.ia.satisfacaoUsuario}% anterior
                    </span>
                  )}
                </Label>
                <Input
                  id="satisfacaoUsuario"
                  type="number"
                  step="0.1"
                  value={ia.satisfacaoUsuario}
                  onChange={(e) => setIA({ ...ia, satisfacaoUsuario: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="taxaResolucao">Taxa de Resolução (%)</Label>
                <Input
                  id="taxaResolucao"
                  type="number"
                  step="0.1"
                  value={ia.taxaResolucao}
                  onChange={(e) => setIA({ ...ia, taxaResolucao: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="leadsQualificados">Leads Qualificados</Label>
                <Input
                  id="leadsQualificados"
                  type="number"
                  value={ia.leadsQualificados}
                  onChange={(e) => setIA({ ...ia, leadsQualificados: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="tempoMedioResposta">Tempo Médio Resposta (min)</Label>
                <Input
                  id="tempoMedioResposta"
                  type="number"
                  step="0.1"
                  value={ia.tempoMedioResposta}
                  onChange={(e) => setIA({ ...ia, tempoMedioResposta: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="comparativoHumano">vs Humano (%)</Label>
                <Input
                  id="comparativoHumano"
                  type="number"
                  step="0.1"
                  value={ia.comparativoHumano}
                  onChange={(e) => setIA({ ...ia, comparativoHumano: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="animate-fade-in">
          <CardHeader 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => toggleSection('portal')}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Portal de Investimento</CardTitle>
                <CardDescription>Métricas do site e conversões</CardDescription>
              </div>
              {expandedSections.portal ? <ChevronUp /> : <ChevronDown />}
            </div>
          </CardHeader>
          
          {expandedSections.portal && (
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="visitas">Visitas</Label>
                <Input
                  id="visitas"
                  type="number"
                  value={portal.visitas}
                  onChange={(e) => setPortal({ ...portal, visitas: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="cadastros">Cadastros</Label>
                <Input
                  id="cadastros"
                  type="number"
                  value={portal.cadastros}
                  onChange={(e) => setPortal({ ...portal, cadastros: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="conversoes">Conversões</Label>
                <Input
                  id="conversoes"
                  type="number"
                  value={portal.conversoes}
                  onChange={(e) => setPortal({ ...portal, conversoes: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="imoveisVisualizados">Imóveis Visualizados</Label>
                <Input
                  id="imoveisVisualizados"
                  type="number"
                  value={portal.imoveisVisualizados}
                  onChange={(e) => setPortal({ ...portal, imoveisVisualizados: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="tempoMedioSite">Tempo Médio (min)</Label>
                <Input
                  id="tempoMedioSite"
                  type="number"
                  step="0.1"
                  value={portal.tempoMedioSite}
                  onChange={(e) => setPortal({ ...portal, tempoMedioSite: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="taxaRejeicao">Taxa de Rejeição (%)</Label>
                <Input
                  id="taxaRejeicao"
                  type="number"
                  step="0.1"
                  value={portal.taxaRejeicao}
                  onChange={(e) => setPortal({ ...portal, taxaRejeicao: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="animate-fade-in">
          <CardHeader 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => toggleSection('redesSociais')}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Redes Sociais</CardTitle>
                <CardDescription>Performance nas mídias sociais</CardDescription>
              </div>
              {expandedSections.redesSociais ? <ChevronUp /> : <ChevronDown />}
            </div>
          </CardHeader>
          
          {expandedSections.redesSociais && (
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="alcance">Alcance</Label>
                <Input
                  id="alcance"
                  type="number"
                  value={redesSociais.alcance}
                  onChange={(e) => setRedesSociais({ ...redesSociais, alcance: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="engajamento">Engajamento</Label>
                <Input
                  id="engajamento"
                  type="number"
                  value={redesSociais.engajamento}
                  onChange={(e) => setRedesSociais({ ...redesSociais, engajamento: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="leadsOrganicos">Leads Orgânicos</Label>
                <Input
                  id="leadsOrganicos"
                  type="number"
                  value={redesSociais.leadsOrganicos}
                  onChange={(e) => setRedesSociais({ ...redesSociais, leadsOrganicos: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="custoPorLead">Custo por Lead (R$)</Label>
                <Input
                  id="custoPorLead"
                  type="number"
                  step="0.01"
                  value={redesSociais.custoPorLead}
                  onChange={(e) => setRedesSociais({ ...redesSociais, custoPorLead: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="seguidoresNovos">Novos Seguidores</Label>
                <Input
                  id="seguidoresNovos"
                  type="number"
                  value={redesSociais.seguidoresNovos}
                  onChange={(e) => setRedesSociais({ ...redesSociais, seguidoresNovos: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="interacoes">Interações</Label>
                <Input
                  id="interacoes"
                  type="number"
                  value={redesSociais.interacoes}
                  onChange={(e) => setRedesSociais({ ...redesSociais, interacoes: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Métricas Gerais</CardTitle>
            <CardDescription>Indicadores consolidados</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="leadsTotal">Total de Leads</Label>
              <Input
                id="leadsTotal"
                type="number"
                value={metricasGerais.leadsTotal}
                onChange={(e) => setMetricasGerais({ ...metricasGerais, leadsTotal: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="taxaConversaoGeral">Taxa de Conversão (%)</Label>
              <Input
                id="taxaConversaoGeral"
                type="number"
                step="0.1"
                value={metricasGerais.taxaConversaoGeral}
                onChange={(e) => setMetricasGerais({ ...metricasGerais, taxaConversaoGeral: parseFloat(e.target.value) || 0 })}
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
              />
            </div>
            <div>
              <Label htmlFor="nps">NPS</Label>
              <Input
                id="nps"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={metricasGerais.nps}
                onChange={(e) => setMetricasGerais({ ...metricasGerais, nps: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Observações</CardTitle>
            <CardDescription>Notas adicionais sobre o período</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Adicione observações sobre o desempenho, destaques, pontos de atenção..."
              rows={4}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 sticky bottom-4 bg-background/95 backdrop-blur p-4 rounded-lg border">
          <Button type="button" variant="outline" onClick={() => setEtapa('escolher')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Relatório'}
          </Button>
        </div>
      </form>
    </div>
  );
}