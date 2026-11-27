// Cadastro de fornecedores (confecções de malhas compressivas).
// ATENÇÃO: empresas, CNPJs, telefones e e-mails abaixo são FICTÍCIOS.
// Os e-mails usam o domínio reservado ".example", que nunca recebe mensagens:
// troque pelo e-mail real do fornecedor ANTES de ativar o envio de e-mails.

export const FORNECEDORES_INICIAIS = [
  {
    id: "forn-norte-parana",
    nome: "Malharia Terapêutica Norte Paraná",
    cnpj: "00.000.000/0001-01",
    email: "pedidos@malhariaterapeutica.example",
    telefone: "(43) 3000-0001",
    contato: "Setor de pedidos",
    cidade: "Londrina - PR",
    observacoes: "Prazo médio de confecção: 15 dias úteis (fictício).",
    ativo: true
  },
  {
    id: "forn-elastomed",
    nome: "Elastomed Confecções Compressivas",
    cnpj: "00.000.000/0001-02",
    email: "confeccao@elastomed.example",
    telefone: "(43) 3000-0002",
    contato: "Atendimento hospitalar",
    cidade: "Maringá - PR",
    observacoes: "Atende ajustes por logística reversa (fictício).",
    ativo: true
  }
];

export const novoFornecedor = () => ({
  id: "",
  nome: "",
  cnpj: "",
  email: "",
  telefone: "",
  contato: "",
  cidade: "",
  observacoes: "",
  ativo: true
});

const somenteDigitos = (texto) => String(texto ?? "").replace(/\D/g, "");

export const emailValido = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email ?? "").trim());

// Formata o CNPJ enquanto o usuário digita: 00.000.000/0000-00
export function formatarCnpj(texto) {
  const d = somenteDigitos(texto).slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function validarFornecedor(dados, fornecedores = []) {
  const erros = [];
  const nome = String(dados.nome ?? "").trim();
  if (!nome) erros.push("Informe o nome do fornecedor.");
  const repetido = fornecedores.some(
    (f) => f.id !== dados.id && f.nome.trim().toLocaleLowerCase("pt-BR") === nome.toLocaleLowerCase("pt-BR")
  );
  if (nome && repetido) erros.push("Já existe um fornecedor com esse nome.");
  if (!emailValido(dados.email)) erros.push("Informe um e-mail válido para receber os pedidos.");
  const cnpj = somenteDigitos(dados.cnpj);
  if (cnpj && cnpj.length !== 14) erros.push("O CNPJ deve ter 14 dígitos.");
  return erros;
}

// Gera um id estável a partir do nome (ex.: "forn-malharia-sul-1a2b").
export function gerarIdFornecedor(nome) {
  const base = String(nome)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);
  return `forn-${base || "novo"}-${Date.now().toString(36).slice(-4)}`;
}
