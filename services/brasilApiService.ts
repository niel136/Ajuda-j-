
/**
 * Valida o formato e os dígitos verificadores de um CNPJ (Algoritmo local)
 */
export const validateCNPJFormat = (cnpj: string): boolean => {
  const clean = cnpj.replace(/[^\d]/g, "");
  if (clean.length !== 14 || /0{14}/.test(clean)) return false;

  const b = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  let n = 0;
  for (let i = 0; i < 12; i++) {
    n += parseInt(clean[i]) * b[i + 1];
  }
  if (parseInt(clean[12]) !== ((n %= 11) < 2 ? 0 : 11 - n)) return false;

  n = 0;
  for (let i = 0; i <= 12; i++) {
    n += parseInt(clean[i]) * b[i];
  }
  if (parseInt(clean[13]) !== ((n %= 11) < 2 ? 0 : 11 - n)) return false;

  return true;
};

/**
 * Consulta os dados da empresa na Brasil API
 * O endpoint correto é /cnpj/v1/{cnpj}
 */
export const fetchCNPJData = async (cnpj: string): Promise<any> => {
  // 1. Limpeza rigorosa do input
  const cleanCnpj = cnpj.replace(/\D/g, "");
  
  console.log(`[BrasilAPI] Iniciando consulta para CNPJ: ${cleanCnpj}`);

  // 2. Validação local antes de gastar requisição
  if (cleanCnpj.length !== 14) {
    throw new Error("CNPJ deve conter exatamente 14 dígitos.");
  }

  if (!validateCNPJFormat(cleanCnpj)) {
    throw new Error("Dígitos verificadores do CNPJ são inválidos.");
  }

  try {
    const url = `https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    console.log(`[BrasilAPI] Status da Resposta: ${response.status}`);

    if (response.status === 404) {
      throw new Error("CNPJ não encontrado na base da Receita Federal via BrasilAPI.");
    }

    if (response.status === 400) {
      throw new Error("Requisição inválida. Verifique o formato do CNPJ.");
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error("Erro de autorização na API (Token/Rate Limit).");
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[BrasilAPI] Erro detalhado:`, errorText);
      throw new Error(`Erro inesperado na API: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[BrasilAPI] Dados recebidos:`, data.razao_social);

    // 3. Regra de Negócio: Bloquear se não estiver ATIVA
    if (data.descricao_situacao_cadastral !== "ATIVA") {
      throw new Error(`Empresa com situação: ${data.descricao_situacao_cadastral}. Apenas empresas ATIVAS podem entrar na plataforma.`);
    }

    return data;
  } catch (error: any) {
    console.error(`[BrasilAPI] Falha crítica na consulta:`, error.message);
    throw error;
  }
};
