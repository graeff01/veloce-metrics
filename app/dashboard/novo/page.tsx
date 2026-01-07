'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { storageManager } from '@/lib/storage';
import { RelatorioMensal, GoogleAdsData, IAData, PortalData, RedesSociaisData, MetricasGerais } from '@/types';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NovoRelatorioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const relatorio: RelatorioMensal = {
      id: Date.now().toString(),
      mes: mesAno.mes,
      ano: mesAno.ano,
      cliente,
      googleAds,
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Novo Relatório Mensal</h1>
          <p className="text-muted-foreground">Preencha as métricas do mês</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
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

        {/* Google Ads */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Google Ads</CardTitle>
            <CardDescription>Métricas de campanhas pagas</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="leadsGerados">Leads Gerados</Label>
              <Input
                id="leadsGerados"
                type="number"
                value={googleAds.leadsGerados}
                onChange={(e) => setGoogleAds({ ...googleAds, leadsGerados: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="cpa">CPA (R$)</Label>
              <Input
                id="cpa"
                type="number"
                step="0.01"
                value={googleAds.cpa}
                onChange={(e) => setGoogleAds({ ...googleAds, cpa: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="ctr">CTR (%)</Label>
              <Input
                id="ctr"
                type="number"
                step="0.1"
                value={googleAds.ctr}
                onChange={(e) => setGoogleAds({ ...googleAds, ctr: parseFloat(e.target.value) || 0 })}
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
            <div>
              <Label htmlFor="verbaInvestida">Verba Investida (R$)</Label>
              <Input
                id="verbaInvestida"
                type="number"
                step="0.01"
                value={googleAds.verbaInvestida}
                onChange={(e) => setGoogleAds({ ...googleAds, verbaInvestida: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="roi">ROI (x)</Label>
              <Input
                id="roi"
                type="number"
                step="0.1"
                value={googleAds.roi}
                onChange={(e) => setGoogleAds({ ...googleAds, roi: parseFloat(e.target.value) || 0 })}
              />
            </div>
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
          </CardContent>
        </Card>

        {/* IA Vellarys */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>IA Vellarys</CardTitle>
            <CardDescription>Performance do assistente virtual</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="volumeInteracoes">Volume de Interações</Label>
              <Input
                id="volumeInteracoes"
                type="number"
                value={ia.volumeInteracoes}
                onChange={(e) => setIA({ ...ia, volumeInteracoes: parseFloat(e.target.value) || 0 })}
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
              <Label htmlFor="satisfacaoUsuario">Satisfação (%)</Label>
              <Input
                id="satisfacaoUsuario"
                type="number"
                step="0.1"
                value={ia.satisfacaoUsuario}
                onChange={(e) => setIA({ ...ia, satisfacaoUsuario: parseFloat(e.target.value) || 0 })}
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
        </Card>

        {/* Portal de Investimento */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Portal de Investimento</CardTitle>
            <CardDescription>Métricas do site e conversões</CardDescription>
          </CardHeader>
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
              <Label htmlFor="imoveisVisualizados">Imóveis Visualizados</Label>
              <Input
                id="imoveisVisualizados"
                type="number"
                value={portal.imoveisVisualizados}
                onChange={(e) => setPortal({ ...portal, imoveisVisualizados: parseFloat(e.target.value) || 0 })}
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
        </Card>

        {/* Redes Sociais */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Redes Sociais</CardTitle>
            <CardDescription>Performance nas mídias sociais</CardDescription>
          </CardHeader>
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
        </Card>

        {/* Métricas Gerais */}
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

        {/* Observações */}
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

        {/* Botões de ação */}
        <div className="flex justify-end gap-4">
          <Link href="/dashboard">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Relatório'}
          </Button>
        </div>
      </form>
    </div>
  );
}
