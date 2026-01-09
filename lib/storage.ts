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
        cliente: 'Imobiliária Exemplo',
        googleAds: {
          leadsGerados: 85,
          conversoes: 12,
          verbaInvestida: 4500,
          cpa: 375.00,  // calculado: 4500 / 12
          roi: 7.6,     // calculado baseado no ticket médio
        },
        ia: {
          volumeInteracoes: 450,
          leadsQualificados: 32,
          satisfacaoUsuario: 92,
        },
        portal: {
          visitas: 2800,
          cadastros: 68,
          imoveisVisualizados: 5200,
          conversoes: 15,
        },
        metricasGerais: {
          leadsTotal: 132,  // 85 + 32 + 15
          taxaConversaoGeral: 9.1,
          ticketMedio: 285000,
          nps: 8.5,
        },
        observacoes: 'Dezembro com bom desempenho. Destaque para qualificação da IA que converteu 32 leads qualificados.',
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      };
      this.saveRelatorio(exemploRelatorio);
    }
  }
};