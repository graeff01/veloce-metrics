import { RelatorioMensal, Usuario } from '@/types';

const STORAGE_KEYS = {
  RELATORIOS: 'veloce_relatorios',
  USER: 'veloce_user',
  THEME: 'veloce_theme',
};

export const storageManager = {
  // Relatórios
  getRelatorios(): RelatorioMensal[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.RELATORIOS);
    return data ? JSON.parse(data) : [];
  },

  saveRelatorio(relatorio: RelatorioMensal): void {
    const relatorios = this.getRelatorios();
    const index = relatorios.findIndex(r => r.id === relatorio.id);
    
    if (index !== -1) {
      relatorios[index] = relatorio;
    } else {
      relatorios.push(relatorio);
    }
    
    localStorage.setItem(STORAGE_KEYS.RELATORIOS, JSON.stringify(relatorios));
  },

  deleteRelatorio(id: string): void {
    const relatorios = this.getRelatorios().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RELATORIOS, JSON.stringify(relatorios));
  },

  getRelatorioById(id: string): RelatorioMensal | null {
    const relatorios = this.getRelatorios();
    return relatorios.find(r => r.id === id) || null;
  },

  // Usuário
  getUser(): Usuario | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  saveUser(user: Usuario): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  clearUser(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Theme
  getTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'dark';
  },

  saveTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  // Seed inicial com dados de exemplo
  seedInitialData(): void {
    const relatorios = this.getRelatorios();
    if (relatorios.length === 0) {
      const exemploRelatorio: RelatorioMensal = {
        id: '1',
        mes: '12',
        ano: 2024,
        cliente: 'Cliente Exemplo',
        googleAds: {
          leadsGerados: 150,
          cpa: 45.50,
          ctr: 3.2,
          conversoes: 85,
          verbaInvestida: 6825,
          roi: 4.5,
          impressoes: 125000,
          cliques: 4000,
        },
        ia: {
          volumeInteracoes: 2500,
          taxaResolucao: 87.5,
          tempoMedioResposta: 2.3,
          satisfacaoUsuario: 92,
          leadsQualificados: 65,
          comparativoHumano: 35,
        },
        portal: {
          visitas: 8500,
          cadastros: 320,
          imoveisVisualizados: 15000,
          conversoes: 45,
          tempoMedioSite: 4.5,
          taxaRejeicao: 42,
        },
        redesSociais: {
          alcance: 45000,
          engajamento: 3200,
          leadsOrganicos: 28,
          custoPorLead: 0,
          seguidoresNovos: 450,
          interacoes: 5600,
        },
        metricasGerais: {
          leadsTotal: 243,
          taxaConversaoGeral: 14.2,
          ticketMedio: 285000,
          nps: 8.5,
        },
        observacoes: 'Mês com ótimo desempenho. Destaque para a IA que superou expectativas.',
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      };
      this.saveRelatorio(exemploRelatorio);
    }
  }
};
