# BurnCare - CTQ HU

Projeto acadêmico da EQ-10 para ajudar no controle de malhas compressivas do Centro de Tratamento de Queimados (CTQ) do Hospital Universitário de Londrina.

## Sobre o projeto

A proposta é registrar e acompanhar pedidos de malhas compressivas, medidas dos pacientes, confecção, recebimento, entrega e possíveis ajustes.

O protótipo visual já foi apresentado e validado com o CTQ. O sistema ainda está em desenvolvimento.

## Tecnologias

- Node.js
- Express
- EJS
- JavaScript, HTML e CSS
- PostgreSQL (ainda será implementado)

O projeto usa o padrão MVC (Model, View e Controller). A ideia é manter os arquivos separados por função, sem complicar a estrutura.

## Como iniciar o projeto

É necessário ter o Git e o Node.js instalados no computador.

1. Abra o terminal e clone o repositório:

```bash
git clone https://github.com/LuccaFelipeR/BurnCare.CTQ-HU.git
```

2. Entre na pasta:

```bash
cd BurnCare.CTQ-HU
```

3. Instale as dependências:

```bash
npm install
```

4. Inicie o servidor:

```bash
npm run dev
```

5. Abra no navegador: http://localhost:3000

Para parar o servidor, pressione `Ctrl + C` no terminal.

Também é possível iniciar usando `npm start`, mas nesse modo o servidor não reinicia automaticamente quando o código muda.

**Importante:** estas instruções consideram a versão MVC integrada à branch `main`.

## Organização dos arquivos

```text
BurnCare.CTQ-HU/
|-- app.js
|-- src/
|   |-- controllers/
|   |   `-- homeController.js
|   |-- routes/
|   |   `-- homeRoutes.js
|   |-- views/
|   |   `-- home.ejs
|   `-- public/
|       `-- css/
|           `-- style.css
|-- package.json
|-- package-lock.json
|-- .gitignore
`-- README.md
```

- `app.js`: inicia o servidor e configura as rotas.
- `routes`: define os endereços das páginas.
- `controllers`: recebe as requisições e prepara os dados para as páginas.
- `views`: contém as páginas EJS.
- `public`: contém CSS, imagens e JavaScript do navegador.
- `models`: será criada quando começarmos a trabalhar com o banco de dados.

Por enquanto, apenas a página inicial está funcionando. As outras partes serão desenvolvidas pela equipe.

## Divisão de atividades da EQ-10

A proposta é que cada integrante fique responsável principalmente por uma área, desenvolvendo suas rotas, controllers e páginas quando necessário. A divisão definitiva deve ser combinada entre os seis integrantes.

| Área | Atividades principais | Responsável |
| --- | --- | --- |
| 1. Estrutura e integração | Organização das branches, conexão com o banco e integração dos módulos | Lucca Felipe |
| 2. Usuários e acesso | Login, controle de sessão e permissões por perfil | A definir |
| 3. Pacientes | Cadastro, edição, consulta e validação dos dados necessários | Abel |
| 4. Solicitações | Registro e acompanhamento dos pedidos de malhas compressivas | A definir |
| 5. Medidas | Gabaritos, medidas antropométricas e arquivos relacionados | A definir |
| 6. Fornecedor e entregas | Acompanhamento da confecção, recebimento, entrega e ajustes | A definir |

Todos devem ajudar nos testes, na revisão do código e na documentação do que desenvolverem.

## Como trabalhar em equipe

Não vamos desenvolver diretamente na `main`. Cada tarefa deve ser feita em uma branch própria.

Antes de começar uma tarefa:

```bash
git switch main
git pull origin main
git switch -c feat/nome-da-tarefa
```

Depois de terminar e testar:

```bash
git add .
git commit -m "feat: descreve o que foi feito"
git push -u origin feat/nome-da-tarefa
```

Em seguida, abra um Pull Request no GitHub para a equipe revisar antes de juntar as alterações à `main`.

Para correções pequenas, pode ser usado o prefixo `fix:`. Para documentação, `docs:`.

## O que ainda falta

- Banco de dados PostgreSQL
- Login e permissões
- Cadastro de pacientes
- Solicitação de malhas
- Formulários de medidas
- Acompanhamento do fornecedor e das entregas
- Histórico de ajustes e outras etapas do processo
- Testes e validação final com o CTQ

O BurnCare não vai substituir os processos financeiros e administrativos já existentes no hospital (ESTHOS/OPM). A intenção é registrar o encaminhamento e o andamento dessas etapas quando fizer sentido para o fluxo.

## Cuidados com os dados

Não colocar no GitHub nomes, fotos, documentos ou outras informações reais de pacientes. Durante o desenvolvimento, usar somente dados fictícios.

A forma de armazenar informações clínicas e os acessos ao sistema ainda precisa ser validada com o hospital.

## Links

- GitHub: https://github.com/LuccaFelipeR/BurnCare.CTQ-HU
- Trello: https://trello.com/b/tF8cHTDq/burncare-eq-10-desenvolvimento
