# Integração de e-mail com fornecedores: como ativar

Quando um pedido é confirmado em **Novo Pedido**, o BurnCare pode enviar um e-mail ao fornecedor escolhido, usando o e-mail cadastrado na tela **Fornecedores**.

O código já está pronto. Por padrão o envio fica **desativado (modo simulação)** e nada sai do navegador. Este guia mostra como ativar o envio.

> ⚠️ **LGPD:** o e-mail **não** leva nome, prontuário, endereço nem telefone do paciente. Ele leva só o número do pedido, a região, os produtos, o modelo e as medidas, as mesmas informações do Portal do fornecedor. Ainda assim, só use dados reais depois que o HU/TI aprovar.

## Como funciona

```
App BurnCare (GitHub Pages)
   │  POST com os dados do pedido (sem identificação do paciente)
   ▼
Supabase Edge Function "enviar-pedido-fornecedor"   ← guarda a chave secreta do Resend
   │  confere a origem e se o destinatário está na lista permitida
   ▼
Resend (serviço de envio de e-mail)  →  caixa de entrada do fornecedor
```

Por que existe esse intermediário? O GitHub Pages só hospeda arquivos estáticos, e qualquer chave colocada no app fica visível para quem abrir o site. Por isso a chave do serviço de e-mail fica guardada na Edge Function do Supabase (plano gratuito).

| Arquivo | Função |
|---|---|
| `src/services/emailFornecedor.js` | Chamado pelo app ao confirmar o pedido. Sem configuração, responde "simulado". |
| `supabase/functions/enviar-pedido-fornecedor/index.js` | Edge Function que monta o e-mail e envia pelo Resend. |
| `supabase/config.toml` | Configuração da função. |
| `.env.example` | Modelo das variáveis do app. |
| `.github/workflows/deploy-pages.yml` | Publica o site no GitHub Pages. |

Daqui em diante, `seudominio.com.br` representa o seu domínio do Registro.br.

---

## Passo 1: criar a conta no Resend e verificar o domínio

O Resend tem plano gratuito de 3.000 e-mails por mês e 100 por dia.

1. Crie uma conta em <https://resend.com>.
2. Vá em **Domains → Add Domain**. Use um **subdomínio** só para envio, por exemplo `mail.seudominio.com.br`. Assim os registros não interferem em outros e-mails do domínio. Escolha a região **São Paulo (sa-east-1)**, se ela aparecer.
3. O Resend mostra alguns registros DNS, normalmente:
   - um **MX** e um **TXT (SPF)** em `send.mail`;
   - um **TXT (DKIM)** em `resend._domainkey.mail`.
4. Cadastre esses registros no Registro.br:
   1. Acesse <https://registro.br> → **Meus domínios** → clique no domínio → **DNS** → **Configurar zona DNS** ou **Editar zona**. Se o domínio ainda usa os DNS do Registro.br, talvez seja preciso ativar o **modo avançado**, o que pode levar alguns minutos.
   2. Clique em **Nova entrada** para cada registro e copie do Resend exatamente o tipo, o nome e o valor. No Registro.br, o nome é **só a parte antes** de `.seudominio.com.br`. Exemplo: `send.mail`, e não `send.mail.seudominio.com.br`.
   3. No registro MX, use a prioridade indicada pelo Resend (geralmente 10).
   4. Salve.
5. Volte ao Resend e clique em **Verify DNS Records**. A propagação pode levar de minutos a algumas horas.
6. Em **API Keys → Create API Key**, crie uma chave com permissão **Sending access**. Ela começa com `re_`. Copie e guarde: ela aparece uma vez só.

## Passo 2: criar o projeto no Supabase e publicar a função

1. Crie uma conta e um projeto em <https://supabase.com>. Use a região **South America (São Paulo)**.
2. Instale o Supabase CLI. No Windows, com Node instalado, rode os comandos abaixo na pasta do projeto:

   ```powershell
   npx supabase login
   ```

   ```powershell
   npx supabase link --project-ref SEU_PROJECT_REF
   ```

   O `project-ref` é o código que aparece na URL do painel: `https://supabase.com/dashboard/project/SEU_PROJECT_REF`.

3. Cadastre os segredos da função. Troque os valores pelos seus:

   ```powershell
   npx supabase secrets set RESEND_API_KEY=re_xxxxxxxx "EMAIL_REMETENTE=BurnCare CTQ <pedidos@mail.seudominio.com.br>" EMAILS_FORNECEDORES_PERMITIDOS=pedidos@fornecedor1.com.br,contato@fornecedor2.com.br ORIGENS_PERMITIDAS=https://burncare.seudominio.com.br,http://localhost:8081
   ```

   | Segredo | O que é |
   |---|---|
   | `RESEND_API_KEY` | A chave `re_...` do passo 1. |
   | `EMAIL_REMETENTE` | O remetente, que **precisa** usar o domínio verificado no Resend. |
   | `EMAILS_FORNECEDORES_PERMITIDOS` | Lista de e-mails que **podem** receber pedidos, separados por vírgula. Sempre que cadastrar um fornecedor novo no app, adicione o e-mail dele aqui. Essa trava impede que alguém use a função para mandar e-mail a qualquer pessoa. |
   | `ORIGENS_PERMITIDAS` | Endereços do site que podem chamar a função: o domínio do GitHub Pages e o `localhost` usado no desenvolvimento. |
   | `EMAIL_COPIA_CTQ` (opcional) | E-mail do CTQ que recebe cópia de todo pedido. |

4. Publique a função:

   ```powershell
   npx supabase functions deploy enviar-pedido-fornecedor
   ```

5. Pegue os dados de acesso em **Project Settings → API** (ou **Data API / API Keys**):
   - **Project URL**, por exemplo `https://abcdxyz.supabase.co`;
   - a chave **anon public** ou **publishable** (`sb_publishable_...`). Essa chave é pública e pode ficar no site. **Nunca** use a `service_role` / `secret`.

## Passo 3: ativar no app (local)

1. Na raiz do projeto, copie o `.env.example` para `.env`:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Preencha o `.env`:

   ```
   EXPO_PUBLIC_EMAIL_FORNECEDOR_ATIVO=true
   EXPO_PUBLIC_SUPABASE_URL=https://abcdxyz.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica
   ```

3. Na tela **Fornecedores**, troque o e-mail do fornecedor de exemplo (que termina em `.example`) por um **e-mail seu de teste**. Lembre de incluir esse mesmo e-mail em `EMAILS_FORNECEDORES_PERMITIDOS`.
4. Reinicie o Expo, porque ele só lê o `.env` na inicialização:

   ```powershell
   npx expo start --web --clear
   ```

5. Faça um pedido completo e confirme. A tela final deve mostrar **"E-mail enviado para …"**, e a linha do tempo do pedido no Histórico registra o resultado.

Se aparecer um erro, veja a tabela [Problemas comuns](#problemas-comuns). Os logs da função ficam no painel do Supabase, em **Edge Functions → enviar-pedido-fornecedor → Logs**.

## Passo 4: publicar no GitHub Pages com o seu domínio

> O GitHub Pages precisa ser ativado por quem **administra o repositório**, o dono `LuccaFelipeR`. A outra opção é publicar a partir de um fork seu.

1. No GitHub, abra o repositório e vá em **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Em **Settings → Secrets and variables → Actions → aba Variables**, crie três *repository variables*:
   - `EXPO_PUBLIC_EMAIL_FORNECEDOR_ATIVO` = `true`
   - `EXPO_PUBLIC_SUPABASE_URL` = a URL do projeto
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` = a chave pública
3. Faça um push na `main` ou rode a action **Publicar no GitHub Pages** manualmente na aba **Actions**. O workflow gera o site (`expo export --platform web`) e publica a pasta `dist`.
4. Configure o domínio próprio usando um subdomínio, por exemplo `burncare.seudominio.com.br`:
   1. No Registro.br, abra **Editar zona → Nova entrada**: tipo **CNAME**, nome `burncare`, valor `NOME-DO-DONO.github.io`. No repositório atual, o valor é `luccafeliper.github.io`.
   2. No GitHub, vá em **Settings → Pages → Custom domain**, informe `burncare.seudominio.com.br` e salve. Quando o certificado ficar pronto, marque **Enforce HTTPS**.
   3. Inclua `https://burncare.seudominio.com.br` em `ORIGENS_PERMITIDAS` (passo 2.3) e rode o `secrets set` de novo.

   Se preferir usar o domínio **raiz** (`seudominio.com.br`), crie no Registro.br quatro registros **A** com nome em branco, apontando para `185.199.108.153`, `185.199.109.153`, `185.199.110.153` e `185.199.111.153`.

   Sem domínio próprio, o site fica em `https://luccafeliper.github.io/BurnCare.CTQ-HU/`. Nesse caso, adicione `"experiments": { "baseUrl": "/BurnCare.CTQ-HU" }` dentro de `"expo"` no `app.json`, senão os arquivos do site não carregam.

## Problemas comuns

| Mensagem no app | Causa provável |
|---|---|
| "Envio de e-mail desativado (modo simulação)" | Falta o `.env`, ou a variável `..._ATIVO` não está `true`, ou o Expo não foi reiniciado. |
| `(403): E-mail do fornecedor não está em EMAILS_FORNECEDORES_PERMITIDOS` | Adicione o e-mail na lista e rode o `secrets set` de novo. |
| `(403): Origem não autorizada` | O endereço do site (ou `http://localhost:PORTA`) não está em `ORIGENS_PERMITIDAS`. |
| `(500): Função sem RESEND_API_KEY...` | Faltam segredos na função. |
| `(502): ... domain is not verified` | O domínio ainda não foi verificado no Resend, ou o `EMAIL_REMETENTE` usa outro domínio. |
| "Falha de conexão ao enviar o e-mail" | URL do Supabase errada, função não publicada ou bloqueio de CORS (veja o console do navegador). |
| `(401)` | Chave pública errada. Confira também se `verify_jwt = false` foi aplicado (`supabase/config.toml`) e publique a função de novo. |

## Limitações (protótipo)

- O cadastro de fornecedores fica **só na memória** da sessão. Ao recarregar a página, os fornecedores voltam aos de exemplo. Por isso a lista de e-mails permitidos fica na função. No futuro, os fornecedores podem ir para uma tabela no Supabase e a função passa a consultar essa tabela.
- Anexos (fotos) **não** vão no e-mail: o texto apenas informa a quantidade.
- Não há login. Qualquer pessoa que abrir o site pode registrar pedidos fictícios. Autenticação e controle de acesso dependem do HU/TI.
