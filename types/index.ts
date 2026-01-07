export interface GoogleAdsData {
  leadsGerados: number;
  cpa: number;
  ctr: number;
  conversoes: number;
  verbaInvestida: number;
  roi: number;
  impressoes: number;
  cliques: number;
}

export interface IAData {
  volumeInteracoes: number;
  taxaResolucao: number;
  tempoMedioResposta: number;
  satisfacaoUsuario: number;
  leadsQualificados: number;
  comparativoHumano: number;
}

export interface PortalData {
  visitas: number;
  cadastros: number;
  imoveisVisualizados: number;
  conversoes: number;
  tempoMedioSite: number;
  taxaRejeicao: number;
}

export interface RedesSociaisData {
  alcance: number;
  engajamento: number;
  leadsOrganicos: number;
  custoPorLead: number;
  seguidoresNovos: number;
  interacoes: number;
}

export interface MetricasGerais {
  leadsTotal: number;
  taxaConversaoGeral: number;
  ticketMedio: number;
  nps: number;
}

export interface RelatorioMensal {
  id: string;
  mes: string;
  ano: number;
  cliente: string;
  googleAds: GoogleAdsData;
  ia: IAData;
  portal: PortalData;
  redesSociais: RedesSociaisData;
  metricasGerais: MetricasGerais;
  observacoes: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: 'admin' | 'user';
}
