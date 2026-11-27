// Associação demonstrativa ao catálogo existente; não substitui indicação clínica.
export const produtosPorRegiao = {
  "perna-direita": [
    "meia-joelho-direita",
    "meio-cano-perna-direita",
    "meia-tres-quartos-direita",
    "meia-perna-inteira-direita",
    "meia-calca"
  ],
  "perna-esquerda": [
    "meia-joelho-esquerda",
    "meio-cano-perna-esquerda",
    "meia-tres-quartos-esquerda",
    "meia-perna-inteira-esquerda",
    "meia-calca"
  ],
  "braco-direito": [
    "meio-cano-braco-direito",
    "luva-ombro-direita"
  ],
  "braco-esquerdo": [
    "meio-cano-braco-esquerdo",
    "luva-ombro-esquerda"
  ],
  "antebraco-direito": ["meio-cano-braco-direito", "luva-ombro-direita"],
  "antebraco-esquerdo": ["meio-cano-braco-esquerdo", "luva-ombro-esquerda"],
  quadril: ["meia-calca"],
  tronco: [
    "torax-com-mangas",
    "torax-sem-mangas"
  ],
  cabeca: [
    "cabeca-pescoco-mascara",
    "cabeca-pescoco-colar-cervical"
  ],
  "mao-direita": [
    "luva-punho-direita",
    "luva-ombro-direita"
  ],
  "mao-esquerda": [
    "luva-punho-esquerda",
    "luva-ombro-esquerda"
  ]
};

export function idsProdutosPorRegioes(regioes) {
  return new Set(regioes.flatMap(({ regiao }) => produtosPorRegiao[regiao] ?? []));
}
