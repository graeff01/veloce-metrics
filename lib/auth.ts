// Configuração de autenticação
// Para MVP: Usuário específico + login genérico para testes

export const AUTH_CONFIG = {
  // Usuário principal da Veloce
  mainUser: {
    email: 'Douglas@velocebm.com',
    senha: '14180218',
    nome: 'Douglas',
    role: 'admin' as const,
  },
  
  // Permitir login genérico para testes
  allowGenericLogin: true,
};

export function validateLogin(email: string, senha: string): { success: boolean; user?: any; error?: string } {
  // Validação básica
  if (!email || !senha) {
    return { success: false, error: 'Email e senha são obrigatórios' };
  }

  // Verificar se é o usuário principal
  if (email.toLowerCase() === AUTH_CONFIG.mainUser.email.toLowerCase()) {
    if (senha === AUTH_CONFIG.mainUser.senha) {
      return {
        success: true,
        user: {
          id: '1',
          email: AUTH_CONFIG.mainUser.email,
          nome: AUTH_CONFIG.mainUser.nome,
          role: AUTH_CONFIG.mainUser.role,
        }
      };
    } else {
      return { success: false, error: 'Senha incorreta' };
    }
  }

  // Login genérico para testes (se habilitado)
  if (AUTH_CONFIG.allowGenericLogin) {
    return {
      success: true,
      user: {
        id: Date.now().toString(),
        email: email,
        nome: email.split('@')[0],
        role: 'user' as const,
      }
    };
  }

  return { success: false, error: 'Usuário não encontrado' };
}
