
/**
 * Valida o formato e os dígitos verificadores de um CNPJ
 */
export const validateCNPJFormat = (cnpj: string): boolean => {
  const b = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const c = cnpj.replace(/[^\d]/g, "");

  if (c.length !== 14 || /0{14}/.test(c)) return false;

  // Fix: Move declaration of 'n' outside the loop to solve scoping issues in TypeScript
  let n = 0;
  for (let i = 0; i < 12; i++) {
    n += parseInt(c[i]) * b[i + 1];
  }
  if (parseInt(c[12]) !== ((n %= 11) < 2 ? 0 : 11 - n)) return false;

  n = 0;
  for (let i = 0; i <= 12; i++) {
    n += parseInt(c[i]) * b[i];
  }
  if (parseInt(c[13]) !== ((n %= 11) < 2 ? 0 : 11 - n)) return false;

  return true;
};

/**
 * Consulta os dados da empresa na Brasil API
 * Nota: Brasil API é um serviço público. Para chaves privadas, 
 * o ideal seria um Proxy via Edge Functions.
 */
export const fetchCNPJData = async (cnpj: string): Promise<any> => {
  const cleanCnpj = cnpj.replace(/\D/g, "");
  
  if (!validateCNPJFormat(cleanCnpj)) {
    throw new Error("CNPJ inválido localmente.");
  }

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
    
    if (response.status === 404) {
      throw new Error("CNPJ não encontrado na base da Receita Federal.");
    }

    if (!response.ok) {
      throw new Error("Erro ao consultar Brasil API.");
    }

    const data = await response.json();

    // Regra de Negócio: Bloquear se não estiver ATIVA
    if (data.descricao_situacao_cadastral !== "ATIVA") {
      throw new Error(`Empresa com situação: ${data.descricao_situacao_cadastral}. Apenas empresas ATIVAS podem se cadastrar.`);
    }

    return data;
  } catch (error: any) {
    throw error;
  }
};
