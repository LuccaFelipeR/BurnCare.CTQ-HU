# BurnCare — CTQ HU | EQ-10

Sistema em desenvolvimento para organizar e acompanhar as solicitações de malhas compressivas do Centro de Tratamento de Queimados (CTQ) do Hospital Universitário de Londrina (HU).

> **Estado atual do projeto:** a interface inicial utiliza Expo SDK 57 e React Native Web. A `Home.js` contém a estrutura inicial da aplicação, enquanto `NovoPedido.js` ainda não possui implementação. O protótipo validado pelo CTQ orienta o desenvolvimento, mas **o sistema clínico ainda não está pronto**. Não existem cadastro persistente de pacientes, pedidos reais, autenticação, backend clínico ou banco de dados integrado. Não utilizar dados reais de pacientes nesta fase.

## Objetivo e fluxo do BurnCare

A unidade central do sistema é o **pedido de malha**, acompanhado do início ao encerramento. A navegação principal prevista para a equipe CTQ é **Visão geral**, **Novo pedido** e **Histórico de pedidos**. Pacientes, corpo, produtos e medidas são etapas e componentes desse fluxo, não menus independentes.

1. **Novo pedido — identificação:** localizar o paciente no cadastro autorizado; se não existir, cadastrar e continuar. Sem integração real de dados, a interface deve distinguir **“paciente não localizado”** de **“consulta indisponível”**.
2. **Prescrição e seleção:** identificar se é primeira ou segunda malha, selecionar as regiões no corpo anatômico e escolher as malhas correspondentes, conforme catálogo validado pelo CTQ.
3. **Medidas e anexos:** preencher o gabarito relativo a cada produto. Existem sete modelos documentados; campos obrigatórios e regras para fotografias dependem de confirmação do CTQ/HU.
4. **Conferência e envio:** revisar os dados, registrar os responsáveis e encaminhar a solicitação à confecção. A prescrição e a coleta das medidas podem ocorrer por profissionais diferentes e em momentos distintos; será necessário salvar e retomar o processo quando houver persistência segura.
5. **Fornecedor e rastreamento:** confirmar o recebimento, registrar produção, postagem e acompanhamento da entrega ao HU, com acesso limitado aos dados necessários à confecção.
6. **Recebimento e prova no CTQ:** conferir a malha, registrar a prova e, caso esteja adequada, entregar ao paciente com recibo e registro do encaminhamento administrativo.
7. **Ajustes:** quando necessário, registrar correções, novas medidas e logística reversa, mantendo o **mesmo pedido original**; após o retorno, realizar nova conferência e prova.

**Atenção:** uma **segunda malha** é uma nova solicitação prescrita; um **ajuste** é um retrabalho vinculado à solicitação original. O BurnCare deverá **registrar o encaminhamento administrativo**, sem executar pagamentos, lançamentos ESTHOS ou emissão de OPM.

## Tecnologia atual e limites

- **Interface:** React Native + Expo SDK 57 + React Native Web.
- **Linguagem:** JavaScript com JSX (`View`, `Text`, `TextInput`, `Pressable` etc.).
- **Estilização:** `StyleSheet.create()`.
- **Ambiente:** navegador no computador, com possibilidade de instalação como PWA **a implementar e validar**.
- **Persistência, autenticação e API:** **ainda não implementadas**. A arquitetura segura para dados clínicos deverá ser definida com a equipe e aprovada pelo HU/TI, observando a LGPD. Não conectar banco de dados clínicos diretamente ao frontend.

A interface atual **não utiliza Express/EJS**. As implementações anteriores permanecem no histórico do GitHub, mas não devem ser mescladas diretamente à nova base.

## Como executar localmente

Pré-requisitos: Git, Node.js e npm instalados.

```bash
# Após clonar e entrar no repositório:
npm install
npm run web
```

Abra o endereço local informado pelo Expo no terminal (a porta pode variar). Para encerrar, utilize `Ctrl + C`.

O comando `npm run web` inicia **somente a interface**, não um serviço clínico completo. Outros comandos Expo (`npm start`, `npm run android` e `npm run ios`) dependem do ambiente e da configuração disponível.

## Organização do código

Estrutura inicial versionada na `main`:

```text
BurnCare.CTQ-HU/
├── App.js                 # Entrada da interface; carrega a Home
├── index.js               # Registro do aplicativo no Expo
├── app.json               # Configuração Expo
├── src/
│   └── pages/
│       ├── Home.js        # Visão geral — interface inicial
│       └── NovoPedido.js  # Arquivo reservado; ainda sem implementação
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

A pasta `src/services/` poderá abrigar integrações futuras, mas **não existe como pasta versionada enquanto estiver vazia**. Outras páginas, componentes e serviços devem ser criados conforme a necessidade e mediante alinhamento com a equipe. `node_modules/` e `.expo/` são arquivos gerados localmente e não devem ser versionados.

## Divisão inicial de trabalho — seis frentes

| Frente | Responsável | Escopo e primeira entrega |
|---|---|---|
| 1. Base compartilhada, navegação e integração | **Lucca Felipe** | **Base Expo e README publicados.** Evoluir a Home, implementar a navegação principal, padronizar os PRs e integrar os módulos da equipe. |
| 2. Identificação e cadastro de pacientes | **Abel Piassa** | Desenvolver busca, estados de consulta, formulário e validações, como primeira etapa do **Novo pedido**; sem simular registros persistidos. |
| 3. Novo pedido e prescrição | **Ana Júlia** | Estruturar as etapas, prescrição de primeira/segunda malha, campos, validações e avanço/retorno; confirmar regras com o CTQ. |
| 4. Boneco anatômico e catálogo | **Ana Fernandes** | Implementar frente/costas, seleção da região anatômica e associação às malhas, usando o HTML v2 como referência visual e catálogo validado. |
| 5. Medidas e anexos | **Ana Mantella** | Criar formulários dinâmicos para os sete gabaritos e estrutura de anexos, sujeitos à validação clínica e à política de dados do HU. |
| 6. Acompanhamento, fornecedor, prova e ajuste | **Matheus Albertini** | Desenvolver visualização de status e detalhes do pedido, fluxo do fornecedor, recebimento, prova, ajuste e registro administrativo. |

**Essas frentes representam responsabilidades, não funcionalidades prontas.** Os responsáveis das frentes 3 a 6 precisam ser definidos pela equipe. Autenticação, banco de dados, segurança, testes e integração exigirão planejamento e trabalho compartilhados.

## Como colaborar sem conflitos

O desenvolvimento do BurnCare utiliza React Native + Expo, com a branch `main` como base oficial do projeto. Cada integrante deve atualizar sua cópia local antes de iniciar uma nova funcionalidade, utilizando uma branch própria e respeitando a arquitetura estabelecida pela equipe.

### 1. Prepare sua branch

Antes de começar, confira se não há alterações locais pendentes:

```bash
git status --short
```

Depois, atualize a `main` e crie sua branch:

```bash
git switch main
git pull origin main
git switch -c feat/nome-do-modulo
```

### 2. Desenvolva e teste

Desenvolva na sua própria branch, respeitando os arquivos e componentes combinados com a equipe.

Execute `npm run web` para testar.

**Não envie** arquivos `.env`, credenciais, fotos ou dados reais de pacientes, `node_modules/` ou `.expo/`.

### 3. Abra um Pull Request

Publique sua branch e abra um Pull Request para a `main`, informando:

- O que foi desenvolvido.
- Como testar a funcionalidade.
- O que ainda está pendente.

Cada integrante deve executar seus próprios comandos Git e revisar as alterações antes do merge.

### 4. Evite conflitos com versões antigas

Não faça merge de branches antigas em Express/EJS diretamente na reconstrução Expo.

O trabalho anterior do módulo de pacientes do Abel pode servir como referência, mas deverá ser reimplementado em React Native/JSX.

### 5. Combine a integração dos módulos

O fluxo de **Novo Pedido** coordena as etapas.

Identificação do paciente, seleção anatômica e medidas serão componentes integrados nesse mesmo fluxo. A equipe deve combinar previamente como esses componentes trocarão informações.


## Critério mínimo de conclusão de uma tarefa

Uma funcionalidade só deve ser marcada como pronta quando estiver implementada, testada e revisada. Não utilizar valores ou pacientes inventados para aparentar registros reais. Enquanto não houver backend, diferenciar claramente **interface construída** de **funcionalidade com consulta ou gravação real**.

## Referências e decisões clínicas

- **Protótipo HTML v2 e PDF de validação:** referência visual e de navegação.
- **Dossiê da primeira reunião:** requisitos levantados com o CTQ.
- **Fluxograma da rotina de solicitação de malhas:** sequência operacional e documentação necessária.
- **Dados do Paciente, MEDIDAS, checklist e recibo:** campos e modelos a confrontar com a validação clínica.

Não armazenar fotos clínicas, prontuários ou dados de saúde em repositório público, em prompts de IA ou em dispositivos sem autorização e segurança institucional. Decisões ainda não validadas devem ser identificadas como **pendentes de validação CTQ/HU**.

## Acompanhamento

- [Repositório GitHub](https://github.com/LuccaFelipeR/BurnCare.CTQ-HU)
- [Trello da equipe EQ-10](https://trello.com/b/tF8cHTDq/burncare-eq-10-desenvolvimento)
