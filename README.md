
# BurnCare — CTQ HU | EQ-10

Sistema acadêmico em desenvolvimento para organizar e acompanhar as solicitações de malhas compressivas do Centro de Tratamento de Queimados (CTQ) do Hospital Universitário de Londrina (HU).

> **Status:** Protótipo funcional da interface, em desenvolvimento.
>
> A navegação principal, a Home responsiva e os componentes iniciais estão implementados. O sistema ainda não possui backend clínico, autenticação, banco de dados integrado ou cadastro persistente de pacientes.
>
> **Importante:** Utilizar somente dados fictícios durante o desenvolvimento. O projeto ainda não está autorizado para uso com informações reais de pacientes.
## 1. Objetivo

O BurnCare tem como objetivo centralizar o acompanhamento dos pedidos de malhas compressivas, desde a identificação do paciente até a entrega da malha.

O fluxo previsto contempla:

1. Identificação e cadastro do paciente.
2. Prescrição da primeira ou segunda malha.
3. Seleção da região anatômica e do produto.
4. Registro de medidas e anexos.
5. Conferência e encaminhamento à confecção.
6. Acompanhamento da produção e do transporte.
7. Recebimento e prova da malha no CTQ.
8. Registro de ajustes, quando necessários.
9. Entrega ao paciente e encerramento do pedido.

Uma segunda malha representa uma nova solicitação prescrita. Um ajuste é um retrabalho vinculado ao pedido original.

As regras clínicas, os campos obrigatórios e os procedimentos administrativos ainda dependem de validação com o CTQ/HU.

## 2. Tecnologias

| Tecnologia | Utilização |
|---|---|
| React Native | Construção da interface |
| Expo SDK 57 | Ambiente de desenvolvimento |
| React Native Web | Execução no navegador |
| JavaScript e JSX | Desenvolvimento dos componentes |
| React Navigation | Navegação entre as telas |
| StyleSheet | Estilização e responsividade |
| Git e GitHub | Versionamento e colaboração |

A interface atual não utiliza Express/EJS.

Branches antigas desenvolvidas nessa arquitetura permanecem como referência histórica, mas não devem ser integradas diretamente ao aplicativo React Native.

## 3. Funcionalidades implementadas

### 3.1. Navegação principal

A aplicação possui três rotas:

- **Visão Geral**
- **Novo Pedido**
- **Histórico de Pedidos**

A navegação é centralizada em `RootNavigator.js`, utilizando React Navigation.

O componente `SideBar.js` apresenta o menu principal e destaca a tela selecionada.

### 3.2. Home — Visão Geral

A Home contém:

- Identificação do CTQ/HU.
- Mensagem de boas-vindas.
- Quatro indicadores de acompanhamento.
- Área reservada para pedidos recentes.
- Atalho para Novo Pedido.
- Atalho para Histórico de Pedidos.

Os indicadores disponíveis são:

| Indicador | Valor inicial |
|---|---|
| Pedidos em aberto | 0 |
| Em produção | 0 |
| Aguardando prova | 0 |
| Concluídos | 0 |

**Esses valores são estáticos no protótipo.** Não representam consultas a pedidos reais e serão substituídos por dados calculados quando existir uma fonte de dados autorizada.

### 3.3. Componente CardIndicador

O componente `CardIndicador.js` recebe as propriedades `titulo` e `valor`.

Ele permite reutilizar o mesmo modelo visual para diferentes indicadores, evitando repetição de código na Home.

### 3.4. Responsividade

O layout principal utiliza `useWindowDimensions` e Flexbox para adaptar a interface a diferentes larguras de tela.

- No computador, a navegação aparece na lateral.
- Em telas menores, o menu passa para a parte superior.
- Os indicadores se reorganizam conforme o espaço disponível.
- A rolagem vertical permite acessar conteúdos mais longos.

A responsividade da Home e da navegação principal foi testada durante o desenvolvimento. As telas dos módulos da equipe ainda precisarão de testes próprios.

### 3.5. Novo Pedido

Existe uma estrutura inicial com quatro etapas:

1. Paciente e prescrição.
2. Região e produto.
3. Medidas e anexos.
4. Conferência.

Os formulários e as integrações entre essas etapas ainda estão em desenvolvimento.

### 3.6. Histórico de Pedidos

Existe uma tela inicial acessível pela navegação principal.

A implementação dos pedidos, filtros, status e acompanhamento será integrada posteriormente.

## 4. Estrutura do projeto

```text
BurnCare.CTQ-HU/
├── App.js
├── index.js
├── app.json
├── src/
│   ├── components/
│   │   ├── CardIndicador.js
│   │   └── SideBar.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── NovoPedido.js
│   │   └── HistoricoPedidos.js
│   └── routes/
│       └── RootNavigator.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

**Responsabilidades dos arquivos principais:**

- `App.js`: inicializa o `NavigationContainer`.
- `RootNavigator.js`: configura as rotas e o layout compartilhado.
- `SideBar.js`: exibe o menu e permite navegar entre as telas.
- `Home.js`: apresenta o dashboard inicial.
- `CardIndicador.js`: renderiza os cartões dos indicadores.
- `NovoPedido.js`: estrutura inicial do fluxo de solicitação.
- `HistoricoPedidos.js`: tela inicial do acompanhamento.

Os novos módulos serão adicionados conforme forem desenvolvidos e integrados.

## 5. Como executar

### Pré-requisitos

- Node.js e npm.
- Git.
- VS Code ou outro editor compatível.

### Instalação

Clone o repositório e acesse a pasta do projeto:

```bash
git clone https://github.com/LuccaFelipeR/BurnCare.CTQ-HU.git
cd BurnCare.CTQ-HU
npm install
```

### Execução no navegador

```bash
npm run web
```

Abra o endereço local informado pelo Expo.

Para interromper o servidor, pressione `Ctrl + C` no terminal.

A execução local disponibiliza somente a interface do protótipo, não um sistema clínico operacional.

## 6. Equipe e responsabilidades

| Responsável | Módulo |
|---|---|
| Lucca Felipe | Estrutura Expo, Home, navegação, documentação e integração |
| Abel Piassa | Identificação e cadastro de pacientes |
| Ana Júlia | Novo Pedido e prescrição |
| Ana Fernandes | Seleção anatômica e catálogo de produtos |
| Ana Mantella | Medidas e anexos |
| Matheus Albertini | Histórico, fornecedor, prova, ajustes e entrega |

Cada integrante desenvolve seu módulo respeitando a estrutura principal do projeto.

As entregas individuais somente serão consideradas integradas após revisão e testes na aplicação.

## 7. Organização do desenvolvimento

A branch `main` contém a base oficial do projeto.

Os integrantes devem desenvolver suas funcionalidades em branches próprias e abrir Pull Requests para integração.

Antes de iniciar uma funcionalidade:

```bash
git status -sb
git switch main
git pull origin main
git switch -c feat/nome-do-modulo
```

Os comandos acima pressupõem que não existam alterações locais pendentes.

### Padrões de desenvolvimento

- Utilizar React Native, JavaScript e JSX.
- Priorizar componentes reutilizáveis.
- Utilizar `StyleSheet.create` para estilos.
- Manter a navegação principal centralizada.
- Não criar menus laterais duplicados.
- Evitar alterar arquivos de outros integrantes sem alinhamento.
- Testar a interface no navegador e em diferentes tamanhos de tela.
- Não instalar bibliotecas desnecessárias.

### Pull Requests

Cada Pull Request deve informar:

- Funcionalidade desenvolvida.
- Arquivos modificados.
- Como testar.
- Funcionalidades pendentes.
- Possíveis conflitos de integração.

O merge deve ocorrer somente após revisão.

## 8. Segurança e privacidade

O BurnCare envolve um contexto de dados clínicos sensíveis.

Durante a fase acadêmica:

- Não utilizar dados reais de pacientes.
- Não publicar prontuários, fotografias clínicas ou informações identificáveis.
- Não armazenar credenciais no repositório.
- Não implementar armazenamento clínico sem autorização institucional.
- Não conectar diretamente o frontend a um banco de dados clínico sem arquitetura de segurança aprovada.

A autenticação, a persistência, o controle de acesso e a conformidade com a LGPD deverão ser definidos e validados com o HU/TI antes de qualquer utilização operacional.

## 9. Próximas etapas

- [x] Criar a estrutura inicial Expo + React Native.
- [x] Implementar a navegação principal.
- [x] Criar a Sidebar.
- [x] Criar a Home com indicadores.
- [x] Implementar o CardIndicador reutilizável.
- [x] Ajustar a responsividade da Home e da navegação.
- [x] Criar a estrutura inicial de Novo Pedido.
- [x] Criar a tela inicial de Histórico.
- [ ] Integrar identificação e cadastro de pacientes.
- [ ] Implementar o fluxo completo de Novo Pedido.
- [ ] Integrar seleção anatômica e catálogo.
- [ ] Integrar medidas e anexos.
- [ ] Implementar acompanhamento e histórico funcional.
- [ ] Definir contratos de dados entre os módulos.
- [ ] Validar regras clínicas com o CTQ/HU.
- [ ] Definir backend, autenticação e persistência autorizados.
- [ ] Realizar testes de integração e usabilidade.

## 10. Referências

O desenvolvimento considera o protótipo HTML v2, o material de validação, o fluxograma da rotina de solicitação de malhas e os modelos de documentos clínicos fornecidos para o projeto.

Esses materiais orientam o desenvolvimento, mas não substituem a validação institucional.

### Links

- [Repositório GitHub](https://github.com/LuccaFelipeR/BurnCare.CTQ-HU)
- [Trello da equipe EQ-10](https://trello.com/b/tF8cHTDq/burncare-eq-10-desenvolvimento)

---

**BurnCare — CTQ HU | EQ-10**

Projeto acadêmico em desenvolvimento. Não disponível para uso clínico.
