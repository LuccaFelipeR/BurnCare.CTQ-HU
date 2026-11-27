# BurnCare — ativar notificação de e-mail (ambiente de teste)

## O que já está implementado
- O cadastro de fornecedores (menu Fornecedores) é compartilhado com Novo Pedido e Portal do Fornecedor. Os nomes iniciais são fictícios e não possuem endereços de e-mail presumidos. Cadastros/pedidos ficam somente na memória da sessão, como na versão anterior. O nome do fornecedor permanece fixo após cadastro para manter vínculos; contato, telefone e e-mail são editáveis.
- Ao confirmar o pedido, se o usuário ativou a sessão de e-mail e o fornecedor possui endereço cadastrado, o app chama a Edge Function `notificar-fornecedor`. Envia somente ID demonstrativo, e-mail de destino e ID de tentativa; nenhum nome, prontuário, medida, anexo ou justificativa é enviado. O corpo é fixo e marcado SIMULAÇÃO. A função exige uma conta Supabase Auth autorizada, uma lista privada de destinatários autorizados e limita 10 tentativas por dia por usuário. A interface não faz envio quando a integração está desligada.
- O pedido é salvo na sessão local mesmo se a notificação falhar. A mensagem “aceita pelo serviço” não comprova entrega; confira o painel Resend e a caixa de entrada. Não há reenvio automático; em falha/timeout, conferir logs antes de repetir. O identificador do pedido é local e não global, portanto não usar para correlacionar pedidos de usuários distintos.
- A seleção CTQ/Fornecedor continua apenas demonstrativa. A autenticação adicionada protege o endpoint de e-mail, não a aplicação inteira. Não publicar dados reais nem usar o protótipo clinicamente. Para operação real, seria necessária autenticação e autorização de todos os módulos, banco persistente/RLS, isolamento por fornecedor, consentimento e validação institucional, além de outbox com controle de entrega e tentativas.

## 1. Configurar domínio no Resend
1. Crie uma conta em https://resend.com e abra Domains > Add Domain. Use um subdomínio dedicado, por exemplo `notificacoes.seudominio.com.br` (substitua por seu domínio).
2. No DNS autoritativo do domínio (Registro.br se for o provedor DNS), copie exatamente os registros solicitados pelo Resend para SPF/DKIM e demais registros de envio. Não apague registros existentes nem altere os MX do domínio principal. Aguarde a verificação aparecer como Verified no Resend. O domínio no Registro.br não é uma conta de e-mail nem um serviço SMTP; não é necessário comprar uma caixa postal só para disparar pelo Resend. Para recebimento/resposta, configure caixa postal separadamente, se necessário.
3. Em API Keys, crie uma chave de envio restrita ao domínio verificado, se disponível. Guarde em local privado. Remetente exemplo: `BurnCare Demo <avisos@notificacoes.seudominio.com.br>`. Não inserir chave em `.env` do Expo, GitHub, JavaScript do cliente ou screenshots. Verifique limites/custos atuais no painel antes de enviar.

## 2. Criar o projeto Supabase e conta de teste
1. Crie um projeto separado em https://supabase.com/dashboard. Em Authentication > Users, crie manualmente uma conta de teste da equipe (e-mail e senha fortes; confirme o usuário conforme o painel). Desabilite inscrição pública se não for necessária. Copie o UUID do usuário; apenas UUIDs explicitamente autorizados terão permissão de envio.
2. Em SQL Editor, abra `supabase/ativar_email.sql` e execute todo o conteúdo. Cria tabela de cota e função RPC com acesso restrito ao servidor. Não contém dados de pacientes nem registros de fornecedores.
3. Obtenha Project URL e publishable key no painel do projeto. A chave pública pode estar no cliente; as chaves secretas nunca. A Edge Function usa a chave service_role legada fornecida pelo ambiente Supabase para o RPC; se as chaves legadas estiverem desativadas, adapte a autorização do servidor e teste a função antes de ativar. Não forneça a chave service_role ao cliente.

## 3. Configurar secrets e implantar a função
Em Edge Functions > Secrets, configure os valores abaixo, substituindo exemplos pelos seus. Não crie arquivo com esses valores dentro do repositório. `BURNCARE_PUBLIC_KEY` é a publishable key do projeto (opcional se SUPABASE_ANON_KEY padrão estiver disponível). Os demais valores são privados.

| Nome | Valor exemplo |
|---|---|
| `BURNCARE_EMAIL_ENABLED` | `false` inicialmente; mudar para `true` somente após a configuração |
| `BURNCARE_CTQ_USER_IDS` | UUID da conta de teste; separar múltiplos por vírgula |
| `BURNCARE_ALLOWED_RECIPIENTS` | Seu e-mail de teste, ou endereços consentidos separados por vírgula |
| `BURNCARE_ALLOWED_ORIGINS` | `http://localhost:8081,http://127.0.0.1:8081,https://burncare.seudominio.com.br` (origens reais sem barra final; se usar GitHub Pages sem domínio, `https://luccafeliper.github.io`) |
| `BURNCARE_EMAIL_FROM` | `BurnCare Demo <avisos@notificacoes.seudominio.com.br>` |
| `RESEND_API_KEY` | chave privada de envio do Resend |
| `BURNCARE_PUBLIC_KEY` | publishable key do Supabase |

No terminal, na raiz do projeto, usando Node compatível com a CLI:

```bash
npx supabase login
npx supabase init
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase functions deploy notificar-fornecedor --no-verify-jwt
```

Se o projeto já tiver `supabase/config.toml`, pule `init`. O flag desativa a verificação JWT legada do gateway para permitir tokens de assinatura moderna; **a própria função valida o token pela API Auth e exige UUID autorizado antes de qualquer envio**. Não remover essa verificação. A função permanece inativa até mudar `BURNCARE_EMAIL_ENABLED` para `true` no painel. Confira os logs do deploy. Mantenha o código da função em `supabase/functions/notificar-fornecedor/index.ts`.

## 4. Configurar o aplicativo e testar
Na raiz do projeto, copie `.env.example` para `.env` (não commitar):

```bash
cp .env.example .env
```

Preencha `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` com os valores reais. Reinicie o Expo (`npm run web`, se necessário `npx expo start --web --clear`). A origem efetiva do navegador deve estar na lista do servidor.

1. Abra Fornecedores no menu lateral. Edite um fornecedor fictício e cadastre **seu próprio e-mail de teste autorizado**, ou cadastre um novo fornecedor. O endereço deve coincidir com `BURNCARE_ALLOWED_RECIPIENTS`. Salve.
2. Em “Notificações de e-mail — teste”, informe a conta criada no Supabase Auth e clique em “Ativar envio de teste”. A sessão fica em memória e expira; entre novamente se necessário.
3. Crie um pedido com dados fictícios, selecione esse fornecedor na conferência e confirme. O e-mail deve ser solicitado automaticamente. Confira a mensagem no app, o status em Histórico, os logs da Edge Function e o painel Resend. Confirme a chegada do e-mail. Teste também destinatário não autorizado e modo desligado: nenhum e-mail deve sair. Não usar dados reais.
4. Em Fornecedores, use “Desativar / sair” para parar notificações na sessão. Para desligar globalmente, ajuste `BURNCARE_EMAIL_ENABLED=false`.

## 5. Hospedar a interface no GitHub Pages
GitHub Pages serve apenas arquivos estáticos: não executa o servidor de e-mail. A função continuará no Supabase. O domínio é opcional para a hospedagem; para enviar e-mail pelo Resend a partir do próprio domínio, verifique DNS conforme etapa 1.

- Recomendo domínio próprio em subdomínio `burncare.seudominio.com.br`. No repositório do Lucca, o proprietário deve configurar Settings > Pages > Custom domain. Adicione um CNAME no DNS apontando `burncare` para `luccafeliper.github.io` (sem caminho) e habilite HTTPS quando disponível. Não confundir o CNAME do site com registros do subdomínio de e-mail. Siga as instruções do GitHub e verifique o domínio antes de publicar. Não publicar se houver risco de exposição de dados reais.
- Com domínio próprio no root, exporte `npx expo export --platform web`. Confira `dist/` e teste a versão exportada. Sem domínio próprio, a URL de projeto tem caminho `/BurnCare.CTQ-HU`; configure `expo.experiments.baseUrl` com `/BurnCare.CTQ-HU` em `app.json` antes do export, e confira assets/navegação. Não coloque baseUrl de subpasta se for publicar no domínio próprio root.
- No GitHub, Settings > Pages > Source: GitHub Actions, publique o conteúdo `dist` usando o workflow oficial de Pages (ações `configure-pages`, `upload-pages-artifact` e `deploy-pages`). Para a configuração pública de e-mail durante o build, forneça as duas variáveis `EXPO_PUBLIC_...` em GitHub Actions Variables. **Nunca** use chave Resend, service_role ou senha no build. Este pacote não publica nem altera DNS ou configurações do repositório automaticamente.
- Referências: https://docs.expo.dev/guides/publishing-websites/ ; https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site ; https://supabase.com/docs/guides/functions/deploy ; https://supabase.com/docs/guides/functions/secrets ; https://resend.com/docs/dashboard/domains/introduction .

## Limitações e validação
O pacote prepara a integração, mas não foi implantado em Supabase/Resend e não envia e-mail por si só. A execução ponta a ponta, DNS, HTTPS, CORS, publicação e entrega precisam ser testados nas contas reais de teste. Os dados do cadastro/ordens ainda não são compartilhados entre dispositivos. O servidor não mantém cadastro remoto de fornecedores nem valida a existência do pedido; a lista de destinatários consentidos no servidor é uma proteção para esta demo. A persistência e a autenticação de todo o sistema são futuras tarefas.
