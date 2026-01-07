# Veloce Metrics - Dashboard de Performance

Sistema interno de métricas e relatórios para acompanhamento de performance dos serviços da Veloce.

## 🚀 Funcionalidades

- **Dashboard Visual**: KPIs, gráficos e métricas consolidadas
- **Gestão de Relatórios**: Cadastro mensal de métricas por canal
- **Histórico**: Visualização e comparação de períodos anteriores
- **Temas**: Suporte para modo claro e escuro
- **Responsivo**: Funciona em desktop, tablet e mobile

## 📊 Métricas Acompanhadas

- **Google Ads**: Leads, CPA, CTR, ROI, Conversões
- **IA Vellarys**: Volume, Taxa de Resolução, Satisfação
- **Portal de Investimento**: Visitas, Cadastros, Conversões
- **Redes Sociais**: Alcance, Engajamento, Leads Orgânicos
- **Métricas Gerais**: Leads Totais, Taxa de Conversão, Ticket Médio, NPS

## 🛠️ Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos interativos
- **LocalStorage** - Persistência de dados (MVP)

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start
```

## 🌐 Acesso

1. Acesse `http://localhost:3000`
2. Faça login com:
   - **Email:** Douglas@velocebm.com
   - **Senha:** 14180218
   - *(Ou use qualquer email/senha para testes)*
3. O sistema irá criar dados de exemplo automaticamente

## 📁 Estrutura do Projeto

```
veloce-metrics/
├── app/
│   ├── dashboard/          # Páginas do dashboard
│   │   ├── page.tsx       # Dashboard principal
│   │   ├── novo/          # Criar novo relatório
│   │   ├── historico/     # Histórico de relatórios
│   │   └── configuracoes/ # Configurações
│   ├── login/             # Página de login
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── providers.tsx      # Providers (Tema, etc)
├── components/
│   ├── ui/                # Componentes base (Button, Card, Input...)
│   ├── dashboard/         # Componentes do dashboard (KPICard, ChartCard)
│   ├── Header.tsx         # Cabeçalho
│   └── Sidebar.tsx        # Menu lateral
├── lib/
│   ├── storage.ts         # Gerenciamento de dados
│   └── utils.ts           # Funções utilitárias
├── types/
│   └── index.ts           # Tipos TypeScript
└── package.json
```

## 🎨 Temas

O sistema suporta modo claro e escuro. Alterne clicando no ícone de sol/lua no header.

## 💾 Dados

- **MVP**: Usa LocalStorage do navegador
- **Futuro**: Migração para banco de dados (PostgreSQL/MongoDB)

## 📈 Roadmap

- [ ] Integração com APIs (Google Ads, Meta)
- [ ] Export para PDF/PowerPoint
- [ ] Modo apresentação fullscreen
- [ ] Comparações automáticas entre períodos
- [ ] Suporte multi-cliente
- [ ] Notificações e alertas
- [ ] Banco de dados real
- [ ] Autenticação robusta

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Railway / Render

1. Conecte seu repositório Git
2. Configure o build command: `npm run build`
3. Configure o start command: `npm start`

## 📝 Uso

### Criar Novo Relatório

1. Clique em "Novo Relatório" no menu
2. Preencha as métricas de cada canal
3. Adicione observações (opcional)
4. Clique em "Salvar Relatório"

### Visualizar Dashboard

- Dashboard principal mostra os dados do último relatório
- Gráficos mostram evolução ao longo dos meses
- KPIs com comparação vs mês anterior

### Exportar Dados

1. Vá em "Configurações"
2. Clique em "Exportar Dados"
3. Baixe o arquivo JSON com backup completo

## 🔒 Segurança

**IMPORTANTE**: Este é um MVP com autenticação simplificada. Para produção:

- Implementar autenticação real (JWT, OAuth)
- Adicionar validação de dados server-side
- Usar HTTPS
- Implementar rate limiting
- Adicionar logs de auditoria

## 🤝 Contribuindo

Este é um projeto interno da Veloce. Para sugestões ou melhorias, entre em contato com a equipe de desenvolvimento.

## 📄 Licença

Propriedade privada da Veloce - Uso interno apenas

---

**Desenvolvido com ❤️ para a Veloce**
