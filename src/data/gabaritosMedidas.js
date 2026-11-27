// Campos e associações transcritos de BurnCare_Prototipo_Validacao_v2(4).html.
// São referências demonstrativas; não constituem regras clínicas homologadas.
// Calça curta consta no material, mas não no catálogo atual de 19 opções.
export const GABARITOS = {
  "hand": {
    "name": "Medidas da mão · gabarito, pág. 1",
    "fields": [
      "1 · Circunferência da palma",
      "2 · Circunferência do dorso",
      "3 · Circunferência do punho",
      "4 · Circunferência do polegar",
      "5 · Circunferência do indicador",
      "6 · Circunferência do dedo médio",
      "7 · Circunferência do anelar",
      "8 · Circunferência do dedo mínimo",
      "9 · Altura da palma",
      "a · Altura do polegar",
      "b · Altura do indicador",
      "c · Altura do dedo médio",
      "d · Altura do anelar",
      "e · Altura do dedo mínimo",
      "10 · Comprimento total da luva"
    ],
    "variants": [
      "Fechada",
      "Dedo longo sem costura",
      "Com dedos abertos",
      "Sem dedos"
    ]
  },
  "foot": {
    "name": "Medidas do pé / meia · gabarito, pág. 2",
    "fields": [
      "1 · Altura da planta do pé",
      "2 · Circunferência do pé",
      "3 · Circunferência do dedão",
      "4 · Circunferência dos demais dedos",
      "5 · Circunferência do tornozelo",
      "6 · Circunferência da panturrilha",
      "7 · Circunferência do joelho",
      "8 · Circunferência da coxa",
      "9 · Comprimento total da meia",
      "A · Comprimento desejado A",
      "B · Comprimento desejado B",
      "C · Comprimento desejado C",
      "D · Comprimento desejado D"
    ],
    "variants": [
      "Fechada",
      "Fechada com dedos",
      "Com dedos abertos",
      "Sem dedos"
    ]
  },
  "short": {
    "name": "Calça curta · gabarito, pág. 3",
    "fields": [
      "A · Altura total (cós × joelho)",
      "B · Altura interna da perna",
      "C · Circunferência da cintura",
      "D · Circunferência do quadril",
      "E · Circunferência da coxa",
      "F · Circunferência da coxa (joelho)"
    ]
  },
  "head": {
    "name": "Cabeça e pescoço · gabarito, pág. 4",
    "fields": [
      "A · Circunferência A",
      "B · Circunferência B",
      "C · Circunferência C",
      "D · Circunferência D",
      "1–2 · Comprimento"
    ],
    "variants": [
      "Máscara facial",
      "Colar cervical"
    ]
  },
  "pants": {
    "name": "Meia calça / perna · gabarito, pág. 5",
    "fields": [
      "A · Altura total",
      "B · Altura interna da perna",
      "C · Circunferência da cintura",
      "D · Circunferência do quadril",
      "E · Circunferência da coxa",
      "F · Circunferência da coxa (joelho)",
      "G · Circunferência da panturrilha",
      "H · Circunferência do tornozelo"
    ]
  },
  "torso": {
    "name": "Tórax com mangas · gabarito, pág. 6",
    "fields": [
      "A · Altura total",
      "B · Largura ombro × ombro",
      "C · Circunferência cava ombro/braço",
      "D · Circunferência do bíceps",
      "E · Circunferência do cotovelo",
      "F · Circunferência do antebraço",
      "G · Circunferência do punho",
      "H · Circunferência do tronco",
      "I · Circunferência da cintura",
      "J · Circunferência do abdômen",
      "K · Circunferência da gola",
      "L · Comprimento pescoço × ombro",
      "M · Comprimento ombro × axila",
      "N · Altura ombro × punho",
      "O · Altura interna do braço (axila × punho)"
    ]
  },
  "sleeve": {
    "name": "Luva e manga · gabarito, pág. 7",
    "fields": [
      "J · Comprimento total da luva",
      "K · Circunferência do pulso",
      "L · Circunferência do antebraço",
      "M · Circunferência do cotovelo",
      "N · Circunferência do bíceps",
      "1–2 · Comprimento 1–2",
      "2–3 · Comprimento 2–3",
      "3–4 · Comprimento 3–4",
      "1–4 · Comprimento 1–4"
    ],
    "variants": [
      "Meio dedo",
      "Ponta fechada",
      "Sem dedo",
      "Dedo longo sem costura ponta"
    ]
  }
};

const GABARITO_POR_PRODUTO = {
  "luva-punho-direita": "hand",
  "luva-punho-esquerda": "hand",
  "meia-joelho-direita": "foot",
  "meia-joelho-esquerda": "foot",
  "meio-cano-braco-direito": "sleeve",
  "meio-cano-braco-esquerdo": "sleeve",
  "meio-cano-perna-direita": "foot",
  "meio-cano-perna-esquerda": "foot",
  "luva-ombro-direita": "sleeve",
  "luva-ombro-esquerda": "sleeve",
  "meia-tres-quartos-direita": "foot",
  "meia-tres-quartos-esquerda": "foot",
  "meia-perna-inteira-direita": "pants",
  "meia-perna-inteira-esquerda": "pants",
  "meia-calca": "pants",
  "torax-com-mangas": "torso",
  "torax-sem-mangas": "torso",
  "cabeca-pescoco-mascara": "head",
  "cabeca-pescoco-colar-cervical": "head"
};

export function gabaritoDoProduto(id) {
  return GABARITOS[GABARITO_POR_PRODUTO[id]] ?? null;
}

export function medidaNumerica(valor) {
  const texto = String(valor ?? "").trim().replace(",", ".");
  if (!/^\d+(?:\.\d+)?$/.test(texto)) return null;
  const numero = Number(texto);
  return Number.isFinite(numero) && numero > 0 ? numero : null;
}

export function validarMedidasProdutos(produtos, dados = {}) {
  if (!produtos.length) return ["Selecione pelo menos um produto."];
  const erros = [];
  for (const produto of produtos) {
    const gabarito = gabaritoDoProduto(produto.id);
    if (!gabarito) {
      erros.push(`${produto.descricao}: gabarito não integrado.`);
      continue;
    }
    const ficha = dados.fichas?.[produto.id] ?? {};
    const preenchidas = gabarito.fields.map((nome) => ficha.medidas?.[nome] ?? "")
      .filter((valor) => String(valor).trim() !== "");
    if (preenchidas.some((valor) => medidaNumerica(valor) === null)) {
      erros.push(`${produto.descricao}: use apenas medidas numéricas positivas.`);
    } else if (preenchidas.length < 2) {
      erros.push(`${produto.descricao}: informe pelo menos duas medidas válidas para a demonstração.`);
    }
    if (ficha.modelo && !["Não aplicável", ...(gabarito.variants ?? [])].includes(ficha.modelo)) {
      erros.push(`${produto.descricao}: acabamento não corresponde ao gabarito.`);
    }
  }
  return erros;
}
