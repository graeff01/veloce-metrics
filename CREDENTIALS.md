# 🔐 Credenciais e Personalizações - Veloce Metrics

## 👤 Usuário Principal

**Email:** Douglas@velocebm.com  
**Senha:** 14180218  
**Nome:** Douglas  
**Role:** Admin (acesso total)

---

## 🔑 Como Funciona o Login

### Seu Usuário Específico
- Email: `Douglas@velocebm.com` (case-insensitive)
- Senha: `14180218`
- Quando você faz login com essas credenciais, o sistema reconhece como usuário principal

### Login Genérico (para testes)
- Qualquer outro email/senha ainda funciona
- Útil para testar com outras contas
- Ideal para demonstrações

---

## 🎨 Personalizações Recomendadas

### 1. Logo da Veloce
Substitua o ícone "V" no header:

**Arquivo:** `components/Header.tsx` (linha 19-23)

**Trocar de:**
```tsx
<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
  <span className="text-white font-bold text-xl">V</span>
</div>
```

**Para (com sua logo):**
```tsx
<Image src="/logo-veloce.png" alt="Veloce" width={40} height={40} />
```

### 2. Cores da Veloce
Se quiser usar as cores da marca:

**Arquivo:** `app/globals.css` (linha 6-20)

Ajuste os valores de `--primary`, `--secondary` conforme sua identidade visual.

### 3. Nome do Cliente Padrão
Quando criar relatórios, pode querer um cliente padrão:

**Arquivo:** `app/dashboard/novo/page.tsx` (linha 29)

**Alterar:**
```tsx
const [cliente, setCliente] = useState('Nome do Cliente Principal');
```

---

## 🔒 Desabilitar Login Genérico (Produção)

Quando subir para produção e quiser apenas seu usuário:

**Arquivo:** `lib/auth.ts` (linha 13)

**Alterar:**
```tsx
allowGenericLogin: false,  // Mude de true para false
```

Depois disso, apenas `Douglas@velocebm.com` com senha correta vai funcionar.

---

## 👥 Adicionar Mais Usuários (Futuro)

Para adicionar mais usuários da equipe:

**Arquivo:** `lib/auth.ts`

```tsx
export const AUTH_CONFIG = {
  users: [
    {
      email: 'Douglas@velocebm.com',
      senha: '14180218',
      nome: 'Douglas',
      role: 'admin',
    },
    {
      email: 'colaborador@velocebm.com',
      senha: 'senha123',
      nome: 'João',
      role: 'user',
    },
  ],
  allowGenericLogin: false,
};
```

E atualizar a função `validateLogin` para iterar sobre o array de usuários.

---

## 🚀 Quando Migrar para Banco de Dados

No futuro, quando implementar backend real:

1. **Hash de senhas** (bcrypt)
2. **JWT tokens** para sessões
3. **PostgreSQL/MongoDB** para armazenar usuários
4. **Roles e permissões** granulares
5. **Recuperação de senha** por email

Por enquanto, o sistema atual é perfeito para MVP e uso interno! 🎯

---

## 📝 Observações Importantes

- ✅ Senha está no código (OK para MVP interno)
- ✅ LocalStorage armazena sessão (OK para MVP)
- ❌ **NÃO** compartilhar o código com credenciais em repositórios públicos
- ❌ **NÃO** usar essas credenciais em produção sem HTTPS
- ✅ Trocar para sistema robusto quando tiver múltiplos usuários reais

---

**Dúvidas sobre segurança ou autenticação? Me chama!** 🔐
