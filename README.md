# BurnCare — CTQ HU | EQ-10

Sistema em desenvolvimento para organizar e acompanhar as solicitações de malhas compressivas do Centro de Tratamento de Queimados (CTQ) do Hospital Universitário de Londrina (HU).

> **Estado do projeto:** reconstrução inicial da interface com Expo SDK 57 e React Native Web. O protótipo validado pelo CTQ orienta telas e fluxo, mas **não** é o sistema pronto. Ainda não há cadastro persistente de pacientes, pedidos reais, autenticação, backend clínico nem banco de dados integrado. Não usar dados reais de pacientes nesta fase.

## Objetivo e fluxo do BurnCare

A unidade central do sistema é o **pedido de malha**, acompanhado do início ao encerramento. A navegação principal prevista para a equipe CTQ é **Visão geral**, **Novo pedido** e **Histórico de pedidos**. Pacientes, corpo, produtos e medidas são etapas e componentes do fluxo, não necessariamente menus independentes.

1. **Novo pedido — identificação:** localizar o paciente no cadastro autorizado; se não existir, cadastrar e continuar. A busca real depende de persistência de dados.
2. **Prescrição e seleção:** identificar se é primeira ou segunda malha, escolher as regiões no corpo anatômico e selecionar as malhas correspondentes, conforme catálogo validado pelo CTQ.
3. **Medidas e anexos:** preencher o gabarito relativo a cada produto; existem sete modelos documentados, com campos obrigatórios e políticas de fotografias ainda sujeitos a confirmação do CTQ.
4. **Conferência e envio:** revisar dados, registrar os responsáveis e encaminhar a solicitação à confecção. A prescrição e a coleta das medidas podem ocorrer por profissionais diferentes e em momentos diferentes; futuramente será necessário salvar e retomar o andamento.
5. **Fornecedor e rastreamento:** confirmar o recebimento, registrar produção, postagem e acompanhamento da entrega ao HU, com acesso restrito aos dados necessários à confecção.
6. **Recebimento e prova no CTQ:** conferir a malha, registrar a prova e, se estiver adequada, entregar ao paciente com recibo e registro do encaminhamento administrativo.
7. **Ajustes:** caso necessário, registrar a correção, novas medidas e logística reversa, mantendo o **mesmo pedido original**; após o retorno da confecção, realizar nova conferência e prova.

**Atenção:** uma **segunda malha** é uma nova solicitação prescrita; **ajuste** é retrabalho vinculado à solicitação original. O BurnCare deve **registrar o encaminhamento administrativo**, sem executar pagamentos, lançamentos ESTHOS ou emissão de OPM.

## Tecnologia atual e limites

- **Interface:** React Native + Expo SDK 57 + React Native Web.
- **Linguagem:** JavaScript com JSX (`View`, `Text`, `TextInput`, `Pressable` etc.).
- **Estilização:** `StyleSheet.create()`.
- **Ambiente:** navegador no computador, com possibilidade de instalação como PWA **a implementar e validar**.
- **Persistência, autenticação e API:** **não implementadas na reconstrução atual**. A arquitetura segura para dados clínicos deverá ser definida com a equipe e aprovada pelo HU/TI, seguindo a LGPD. Não conectar banco clínico diretamente ao frontend.

Não utilizar Express/EJS na nova interface. O histórico dessas tecnologias permanece recuperável nos commits antigos do GitHub.

## Como executar localmente

Pré-requisitos: Git, Node.js e npm instalados.

```bash
# Após clonar e entrar no repositório:
npm install
npm run web
```

Abra o endereço local informado pelo Expo no terminal (a porta pode variar). Para encerrar, use `Ctrl + C`.

O comando `npm run web` inicia **somente a interface**, não um serviço clínico completo. Os demais comandos Expo (`npm start`, `npm run android` e `npm run ios`) dependem do ambiente/dispositivo e da configuração existente.

## Organização do código

```text
BurnCare.CTQ-HU/
├── App.js                 # Entrada da interface; carrega as páginas
├── index.js               # Registro do aplicativo no Expo
├── app.json               # Configuração Expo
├── src/
│   ├── pages/
│   │   └── Home.js        # Visão geral — base em desenvolvimento
│   └── services/           # Integrações futuras; não pressupõe API pronta
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

Novas páginas e componentes devem ser criados apenas conforme o trabalho exigir. `node_modules/` e `.expo/` são arquivos gerados localmente; não devem ser versionados.

## Divisão inicial de trabalho — seis frentes

| Frente | Responsável | Primeira entrega a desenvolver |
|---|---|---|
| 1. Base compartilhada, navegação e integração | **Lucca Felipe** | Publicar a base Expo com Home funcional, README atualizado e padrão de PRs; definir integração dos módulos |
| 2. Identificação e cadastro de pacientes | **Abel Piassa** | Componente de busca, estado “não localizado” e formulário de cadastro, integrados ao fluxo Novo pedido; sem simular registros persistidos |
| 3. Novo pedido e prescrição | **A definir** | Estrutura das etapas, primeira/segunda malha, campos e avanço/retorno; regras ainda a confirmar com CTQ |
| 4. Boneco anatômico e catálogo | **A definir** | Frente/costas, seleção de região e associação às malhas; aproveitar a referência visual do HTML v2 |
| 5. Medidas e anexos | **A definir** | Formulários dinâmicos para os sete gabaritos e elementos de anexo, aguardando validações clínicas |
| 6. Acompanhamento, fornecedor, prova e ajuste | **A definir** | Fluxo de status e detalhes do pedido, recebimento, prova, ajuste e registro administrativo |

**Não significa que essas frentes já estejam implementadas.** Os responsáveis das quatro frentes restantes precisam ser confirmados pela equipe. Autenticação, banco de dados, segurança e testes transversais exigirão planejamento compartilhado.

## Como colaborar sem conflitos

1. **Lucca publica e integra primeiro a reconstrução Expo à `main`**, por Pull Request após testes. Até isso acontecer, os demais integrantes não devem começar a desenvolver em cima da antiga `main` Express/EJS.
2. Depois do merge, cada integrante atualiza o repositório e cria sua própria branch:

   ```bash
   git switch main
   git pull origin main
   git switch -c feat/nome-do-modulo
   ```

3. Desenvolva em sua branch; teste e envie apenas os arquivos necessários. **Não envie** `.env`, credenciais, fotos ou dados reais de pacientes, `node_modules/` e `.expo/`.
4. Publique a branch e abra um Pull Request direcionado à `main`, com o que foi feito, como testar e o que continua pendente.
5. Não faça merge de branches antigas com Express/EJS diretamente na reconstrução. O trabalho anterior do módulo Pacientes do Abel deve ser consultado como referência e adaptado à nova base.

## Critério mínimo de conclusão de uma tarefa

Uma funcionalidade só deve ser marcada como pronta quando seu fluxo estiver implementado, testado e revisado. Não usar valores ou pacientes inventados para aparentar que há registros no sistema. Enquanto não houver backend, distinguir **tela construída** de **funcionalidade com gravação/consulta real**.

## Referências e decisões clínicas

- **Protótipo HTML v2 e PDF de validação:** referência visual e de navegação.
- **Dossiê da primeira reunião:** requisitos levantados com o CTQ.
- **Fluxograma da rotina de solicitação de malhas:** sequência operacional e documentação necessária.
- **Dados do Paciente, MEDIDAS, checklist e recibo:** campos e modelos a confrontar com a validação clínica.

Não armazenar fotos clínicas, prontuários ou dados de saúde em repositório público, em prompts de IA ou em dispositivos sem autorização e segurança institucional. Decisões ainda não validadas devem ser identificadas como **pendentes de validação CTQ/HU**.

## Acompanhamento

- [Repositório GitHub](https://github.com/LuccaFelipeR/BurnCare.CTQ-HU)
- [Trello da equipe EQ-10](https://trello.com/b/tF8cHTDq/burncare-eq-10-desenvolvimento)

> **Nota de transição:** este README foi preparado para substituir a documentação antiga Express/EJS **na branch de reconstrução Expo**. Enquanto o PR não for integrado, o `README.md` da `main` remota ainda descreve a arquitetura anterior.
