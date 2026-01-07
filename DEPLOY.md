# 🚀 Guia de Deploy - Veloce Metrics

## Opção 1: Vercel (Recomendado - Mais Fácil)

### Passo a Passo

1. **Criar conta na Vercel**
   - Acesse: https://vercel.com
   - Faça login com GitHub/GitLab/Bitbucket

2. **Fazer Push para Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Veloce Metrics MVP"
   git branch -M main
   git remote add origin <seu-repositorio>
   git push -u origin main
   ```

3. **Importar no Vercel**
   - No dashboard da Vercel, clique em "New Project"
   - Selecione seu repositório
   - Configure:
     - Framework Preset: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`
   - Clique em "Deploy"

4. **Acessar**
   - Seu app estará disponível em: `https://seu-projeto.vercel.app`
   - Você pode adicionar um domínio customizado depois

### Vantagens da Vercel
- Deploy automático a cada push
- SSL grátis
- CDN global
- Zero configuração
- Preview de branches

---

## Opção 2: Railway

### Passo a Passo

1. **Criar conta no Railway**
   - Acesse: https://railway.app
   - Faça login com GitHub

2. **Criar novo projeto**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha seu repositório

3. **Configurar**
   - Railway detecta Next.js automaticamente
   - Build Command: `npm run build`
   - Start Command: `npm start`

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build

5. **Acessar**
   - Clique em "Generate Domain"
   - Seu app estará disponível

---

## Opção 3: Render

### Passo a Passo

1. **Criar conta no Render**
   - Acesse: https://render.com
   - Faça login com GitHub

2. **Criar Web Service**
   - Dashboard > New > Web Service
   - Conecte seu repositório

3. **Configurar**
   - Name: veloce-metrics
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. **Deploy**
   - Clique em "Create Web Service"
   - Aguarde o deploy

---

## Opção 4: VPS Próprio (Linux)

### Requisitos
- Servidor com Node.js 18+
- Nginx
- PM2

### Passo a Passo

1. **Instalar Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Instalar PM2**
   ```bash
   sudo npm install -g pm2
   ```

3. **Clonar e Preparar**
   ```bash
   cd /var/www
   git clone <seu-repo> veloce-metrics
   cd veloce-metrics
   npm install
   npm run build
   ```

4. **Iniciar com PM2**
   ```bash
   pm2 start npm --name "veloce-metrics" -- start
   pm2 save
   pm2 startup
   ```

5. **Configurar Nginx**
   ```nginx
   server {
       listen 80;
       server_name seu-dominio.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **SSL com Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d seu-dominio.com
   ```

---

## Configurações de Produção

### Next.js Config
O arquivo `next.config.js` já está configurado para produção.

### Variáveis de Ambiente
Por enquanto não há variáveis necessárias. No futuro:
```bash
# .env.production
NODE_ENV=production
```

---

## Monitoramento

### Logs
- **Vercel**: Dashboard > Logs
- **Railway**: Dashboard > Logs
- **VPS**: `pm2 logs veloce-metrics`

### Analytics
Considere adicionar:
- Google Analytics
- Vercel Analytics
- Sentry (monitoramento de erros)

---

## Troubleshooting

### Build Falhou
```bash
# Limpar cache
rm -rf .next node_modules
npm install
npm run build
```

### Porta em Uso (VPS)
```bash
# Verificar porta 3000
sudo lsof -i :3000
# Matar processo
sudo kill -9 <PID>
```

### Memória Insuficiente
Adicione swap no servidor:
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## Backup e Segurança

### Backup Automático dos Dados
Como usa localStorage, os dados ficam no navegador. Para backup:
1. Use a função "Exportar Dados" em Configurações
2. Configure backup automático quando migrar para banco de dados

### SSL/HTTPS
- Vercel/Railway/Render: SSL automático ✅
- VPS: Use Let's Encrypt (veja passo 6 da Opção 4)

### Firewall (VPS)
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

---

## Domínio Customizado

### Vercel
1. Projeto > Settings > Domains
2. Adicione seu domínio
3. Configure DNS:
   - Tipo A: 76.76.21.21
   - ou CNAME: cname.vercel-dns.com

### Railway/Render
1. Gere o domínio no dashboard
2. Configure CNAME no seu provedor DNS

---

## Próximos Passos Após Deploy

1. ✅ Testar em diferentes dispositivos
2. ✅ Criar primeiro relatório real
3. ✅ Compartilhar URL com equipe
4. 📋 Coletar feedback
5. 🔄 Iterar e melhorar

---

**Precisa de ajuda?** Entre em contato com o time de dev!
