import { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import Svg, { G, Path } from "react-native-svg";

const nomesDasVistas = {
  frente: "Frente",
  costas: "Costas"
};

const LARGURA_MAPA = 210;
const ALTURA_MAPA = 350;

const regioes = [
  {
    id: "cabeca",
    nome: "Cabeça",
    desenho: "M45 25a15 15 0 1 0 30 0a15 15 0 1 0-30 0",
    area: { x: 40, y: 8, width: 40, height: 36 }
  },
  {
    id: "tronco",
    nome: "Tronco",
    desenho: "M45 44H75L79 64L72 101H48L41 64Z",
    area: { x: 38, y: 42, width: 44, height: 62 }
  },
  {
    id: "quadril",
    nome: "Quadril",
    desenho: "M48 103H72L79 122H41Z",
    area: { x: 38, y: 101, width: 44, height: 24 }
  },
  {
    id: "braco-direito",
    nome: "Braço direito",
    desenho: "M40 48L31 51L23 80L34 83L42 57Z",
    area: { x: 19, y: 45, width: 25, height: 40 }
  },
  {
    id: "antebraco-direito",
    nome: "Antebraço direito",
    desenho: "M23 82L34 85L27 108L16 105Z",
    area: { x: 12, y: 80, width: 24, height: 31 }
  },
  {
    id: "mao-direita",
    nome: "Mão direita",
    desenho: "M16 107L27 110L24 124L12 121Z",
    area: { x: 8, y: 105, width: 23, height: 22 }
  },
  {
    id: "braco-esquerdo",
    nome: "Braço esquerdo",
    desenho: "M80 48L89 51L97 80L86 83L78 57Z",
    area: { x: 76, y: 45, width: 25, height: 40 }
  },
  {
    id: "antebraco-esquerdo",
    nome: "Antebraço esquerdo",
    desenho: "M97 82L86 85L93 108L104 105Z",
    area: { x: 84, y: 80, width: 24, height: 31 }
  },
  {
    id: "mao-esquerda",
    nome: "Mão esquerda",
    desenho: "M104 107L93 110L96 124L108 121Z",
    area: { x: 89, y: 105, width: 23, height: 22 }
  },
  {
    id: "perna-direita",
    nome: "Perna direita",
    desenho: "M42 124H59L55 189H33L39 177Z",
    area: { x: 30, y: 122, width: 31, height: 70 }
  },
  {
    id: "perna-esquerda",
    nome: "Perna esquerda",
    desenho: "M78 124H61L65 189H87L81 177Z",
    area: { x: 59, y: 122, width: 31, height: 70 }
  }
];

const primeiraCoordenada = (...valores) =>
  valores.find((valor) => Number.isFinite(valor));

const formatarPonto = (event, drawingLayer) => {
  const dadosEvento = event.nativeEvent || event;
  const alvo = drawingLayer || event.currentTarget || dadosEvento.currentTarget;
  const limites = alvo && typeof alvo.getBoundingClientRect === "function"
    ? alvo.getBoundingClientRect()
    : null;
  const locationX = primeiraCoordenada(
    dadosEvento.locationX,
    event.locationX,
    dadosEvento.offsetX,
    event.offsetX,
    limites ? dadosEvento.clientX - limites.left : null,
    limites ? event.clientX - limites.left : null
  );
  const locationY = primeiraCoordenada(
    dadosEvento.locationY,
    event.locationY,
    dadosEvento.offsetY,
    event.offsetY,
    limites ? dadosEvento.clientY - limites.top : null,
    limites ? event.clientY - limites.top : null
  );

  if (!Number.isFinite(locationX) || !Number.isFinite(locationY)) {
    return null;
  }

  const largura = limites && limites.width ? limites.width : LARGURA_MAPA;
  const altura = limites && limites.height ? limites.height : ALTURA_MAPA;
  const x = Math.max(0, Math.min(120, (locationX / largura) * 120));
  const y = Math.max(0, Math.min(200, (locationY / altura) * 200));

  return `${x.toFixed(1)} ${y.toFixed(1)}`;
};

export default function MapaCorporal({ selecionadas, onChange }) {
  const [vista, setVista] = useState("frente");
  const [modoDesenho, setModoDesenho] = useState(false);
  const [desenhos, setDesenhos] = useState([]);
  const [desenhoAtual, setDesenhoAtual] = useState("");
  const caminhoAtual = useRef("");
  const vistaDesenho = useRef(vista);
  const drawingLayer = useRef(null);

  const iniciarDesenho = (event) => {
    if (!modoDesenho) {
      return;
    }

    if (event.preventDefault) {
      event.preventDefault();
    }
    const ponto = formatarPonto(event, drawingLayer.current);
    if (!ponto) {
      return;
    }

    vistaDesenho.current = vista;
    caminhoAtual.current = `M${ponto}`;
    setDesenhoAtual(caminhoAtual.current);
  };

  const continuarDesenho = (event) => {
    if (!modoDesenho || !caminhoAtual.current) {
      return;
    }

    if (event.preventDefault) {
      event.preventDefault();
    }
    const ponto = formatarPonto(event, drawingLayer.current);
    if (!ponto) {
      return;
    }
    caminhoAtual.current += ` L${ponto}`;
    setDesenhoAtual(caminhoAtual.current);
  };

  const concluirDesenho = () => {
    const caminhoFinal = caminhoAtual.current;

    if (caminhoFinal) {
      setDesenhos((anteriores) => [
        ...anteriores,
        {
          id: `${Date.now()}-${anteriores.length}`,
          vista: vistaDesenho.current,
          caminho: caminhoFinal
        }
      ]);
    }
    caminhoAtual.current = "";
    setDesenhoAtual("");
  };

  const alternarRegiao = (regiao) => {
    const id = `${vista}-${regiao.id}`;
    const jaSelecionada = selecionadas.some((item) => item.id === id);

    if (jaSelecionada) {
      onChange(selecionadas.filter((item) => item.id !== id));
      return;
    }

    onChange([
      ...selecionadas,
      { id, vista, regiao: regiao.id, nome: regiao.nome }
    ]);
  };

  const limparDesenho = () => {
    setDesenhos((anteriores) =>
      anteriores.filter((desenho) => desenho.vista !== vista)
    );
    setDesenhoAtual("");
    caminhoAtual.current = "";
  };

  return (
    <View style={estilos.container}>
      <View style={estilos.seletor}>
        {Object.entries(nomesDasVistas).map(([id, nome]) => {
          const selecionada = vista === id;

          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityState={{ selected: selecionada }}
              style={[
                estilos.botaoVista,
                selecionada && estilos.botaoVistaSelecionado
              ]}
              onPress={() => setVista(id)}
            >
              <Text
                style={[
                  estilos.textoVista,
                  selecionada && estilos.textoVistaSelecionado
                ]}
              >
                {nome}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={estilos.areaMapa}>
        <Svg
          width={LARGURA_MAPA}
          height={ALTURA_MAPA}
          viewBox="0 0 120 200"
          pointerEvents="none"
        >
          <G transform={vista === "costas" ? "translate(120 0) scale(-1 1)" : undefined}>
            {regioes.map((regiao) => {
              const marcada = selecionadas.some(
                (item) => item.id === `${vista}-${regiao.id}`
              );
              return (
                <Path
                  key={regiao.id}
                  d={regiao.desenho}
                  fill={marcada ? "#EF7279" : "#DCE8EB"}
                  stroke="#58717B"
                  strokeWidth={1}
                />
              );
            })}
          </G>
          {desenhos
            .filter((desenho) => desenho.vista === vista)
            .map((desenho) => (
              <Path
                key={desenho.id}
                d={desenho.caminho}
                fill="none"
                stroke="#D95A5A"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                pointerEvents="none"
              />
            ))}
          {desenhoAtual ? (
            <Path
              d={desenhoAtual}
              fill="none"
              stroke="#D95A5A"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              pointerEvents="none"
            />
          ) : null}
        </Svg>

        <View
          style={estilos.camadaRegioes}
          pointerEvents={modoDesenho ? "none" : "box-none"}
        >
          {regioes.map((regiao) => {
            const marcada = selecionadas.some(
              (item) => item.id === `${vista}-${regiao.id}`
            );
            const left = vista === "costas"
              ? 120 - regiao.area.x - regiao.area.width
              : regiao.area.x;

            return (
              <Pressable
                key={regiao.id}
                accessibilityRole="button"
                accessibilityLabel={regiao.nome}
                accessibilityState={{ selected: marcada }}
                style={[
                  estilos.alvoRegiao,
                  {
                    left: `${(left / 120) * 100}%`,
                    top: `${(regiao.area.y / 200) * 100}%`,
                    width: `${(regiao.area.width / 120) * 100}%`,
                    height: `${(regiao.area.height / 200) * 100}%`
                  }
                ]}
                onPress={() => alternarRegiao(regiao)}
              />
            );
          })}
        </View>

        {modoDesenho ? (
          <View
            ref={drawingLayer}
            style={estilos.camadaDesenho}
            accessibilityLabel="Área para desenhar no mapa corporal"
            onPointerDown={iniciarDesenho}
            onPointerMove={continuarDesenho}
            onPointerUp={concluirDesenho}
            onPointerCancel={concluirDesenho}
          />
        ) : null}
      </View>

      <View style={estilos.acoesDesenho}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: modoDesenho }}
          style={[
            estilos.botaoDesenhar,
            modoDesenho && estilos.botaoDesenharAtivo
          ]}
          onPress={() => setModoDesenho((ativo) => !ativo)}
        >
          <Text style={estilos.textoBotaoDesenhar}>
            {modoDesenho ? "Concluir desenho" : "Desenhar área"}
          </Text>
        </Pressable>

        {desenhos.some((desenho) => desenho.vista === vista) && (
          <Pressable
            accessibilityRole="button"
            style={estilos.botaoLimpar}
            onPress={limparDesenho}
          >
            <Text style={estilos.textoBotaoLimpar}>Limpar desenho</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    width: LARGURA_MAPA,
    maxWidth: "100%",
    alignItems: "center",
    gap: 8
  },

  seletor: {
    width: "100%",
    flexDirection: "row",
    gap: 8
  },

  botaoVista: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#DDE8EE",
    borderRadius: 6,
    backgroundColor: "#FFFFFF"
  },

  botaoVistaSelecionado: {
    borderColor: "#0C716B",
    backgroundColor: "#E4F4EE"
  },

  textoVista: {
    color: "#718696",
    fontSize: 13
  },

  textoVistaSelecionado: {
    color: "#0C716B",
    fontWeight: "bold"
  },

  areaMapa: {
    position: "relative",
    width: LARGURA_MAPA,
    height: ALTURA_MAPA
  },

  camadaRegioes: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },

  alvoRegiao: {
    position: "absolute",
    backgroundColor: "transparent"
  },

  camadaDesenho: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },

  acoesDesenho: {
    width: "100%",
    gap: 6
  },

  botaoDesenhar: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#0C716B",
    borderRadius: 6,
    backgroundColor: "#FFFFFF"
  },

  botaoDesenharAtivo: {
    backgroundColor: "#E4F4EE"
  },

  textoBotaoDesenhar: {
    color: "#0C716B",
    fontSize: 13,
    fontWeight: "bold"
  },

  botaoLimpar: {
    alignItems: "center",
    paddingVertical: 6
  },

  textoBotaoLimpar: {
    color: "#718696",
    fontSize: 12
  }

});