// Nomes inventados exclusivamente para o ambiente demonstrativo.
export const FORNECEDORES_DEMO = [
  { id: 'demo-1', nome: 'MalhaViva Soluções Compressivas (fictício)', contato: '', email: '', telefone: '' },
  { id: 'demo-2', nome: 'Compressiva Aurora (fictício)', contato: '', email: '', telefone: '' },
];
export function nomeFornecedorLegado(nome) {
  if (nome === 'Fornecedor Exemplo 1') return FORNECEDORES_DEMO[0].nome;
  if (nome === 'Fornecedor Exemplo 2') return FORNECEDORES_DEMO[1].nome;
  return nome;
}
export const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
export function validarFornecedor(dados, existentes) {
  const erros = [];
  const nome = String(dados.nome ?? '').trim();
  const email = String(dados.email ?? '').trim();
  if (!nome || nome.length > 100) erros.push('Informe um nome de fornecedor (até 100 caracteres).');
  if (existentes.some((f) => f.id !== dados.id && f.nome.toLocaleLowerCase('pt-BR') === nome.toLocaleLowerCase('pt-BR'))) erros.push('Já existe um fornecedor com esse nome.');
  if (email && !emailValido(email)) erros.push('Informe um e-mail válido ou deixe em branco.');
  return erros;
}
