// ✅ VERSÃO ENXUTA - FOCO IMOBILIÁRIA
// Apenas campos estratégicos que agregam valor

export interface GoogleAdsData {
  leadsGerados: number;
  conversoes: number;
  verbaInvestida: number;
  // Calculados automaticamente:
  cpa: number;
  roi: number;
}

export interface IAData {
  volumeInteracoes: number;      // Total de atendimentos
  leadsQualificados: number;     // Leads que a IA qualificou
  satisfacaoUsuario: number;     // % de satisfação
}

export interface PortalData {
  visitas: number;               // Visitantes únicos
  cadastros: number;             // Novos cadastros
  imoveisVisualizados: number;   // Total de imóveis visualizados
  conversoes: number;            // Propostas/Agendamentos
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