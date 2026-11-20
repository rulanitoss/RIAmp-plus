# Publicar o RIAMP3 com GitHub e Vercel

## 1. Preparar o Supabase

1. Cria um projeto em https://supabase.com.
2. Abre **Project Settings → API** e copia o **Project URL** e a chave **anon/publishable**.
3. Abre **SQL Editor** e executa o conteúdo completo de `supabase/schema.sql`.
4. Em **Authentication → URL Configuration**, adiciona o domínio final do Vercel aos URLs permitidos e define o Site URL para o endereço publicado do RIAMP3.
5. Mantém a autenticação por e-mail ativa. Antes de abrir o registo a outras pessoas, configura o envio de e-mails de confirmação.

## 2. Enviar o projeto para o GitHub

1. Cria um repositório vazio no GitHub.
2. Envia todos os ficheiros e pastas deste projeto, mantendo a estrutura.
3. Não envies `supabase.config.json`, ficheiros `.env` ou chaves privadas. O `.gitignore` já exclui `supabase.config.json`.

Estrutura principal esperada:

```text
api/[...route].js
lib/server.mjs
public/index.html
public/app.js
public/app.css
public/data.js
public/catalog.js
public/assets/
supabase/schema.sql
vercel.json
package.json
```

## 3. Importar no Vercel

1. Entra no Vercel e escolhe **Add New → Project**.
2. Importa o repositório GitHub.
3. Mantém a configuração definida em `vercel.json`: os ficheiros web são publicados a partir de `public/` e a API é executada através de funções Node.js em `api/`.
4. Antes do primeiro deploy, abre **Project Settings → Environment Variables** e adiciona:
   - `SUPABASE_URL` = URL do projeto Supabase.
   - `SUPABASE_ANON_KEY` = chave anon/publishable.
   - `YTM_API_KEY` = opcional; permite substituir a chave pública de cliente usada pelo serviço de pesquisa.
5. Seleciona os ambientes que vais utilizar (Production e Preview, por exemplo) e faz o deploy.

A chave anon/publishable foi concebida para ser utilizada pelo cliente. A proteção dos dados depende das políticas RLS em `supabase/schema.sql`. Nunca coloques uma chave `service_role` ou uma chave secreta no frontend, no GitHub ou nas variáveis públicas do projeto.

## 4. Testar a publicação

Depois do deploy, verifica:

- `/` abre a interface RIAMP3.
- `/api/status` devolve JSON com `ok: true`.
- `/api/config` devolve `configured: true` (inclui apenas a chave pública anon/publishable).
- O registo e o início de sessão funcionam.
- Favoritos e playlists continuam disponíveis depois de terminar sessão e voltar a entrar.
- Envia um ficheiro de áudio pequeno, reproduz-o, termina sessão e entra com uma segunda conta de teste para confirmar o isolamento dos ficheiros.
- Os resultados do YouTube abrem no leitor oficial visível. Uma faixa pode não funcionar quando o proprietário desativa a incorporação, quando existe uma restrição regional ou quando o vídeo deixa de estar disponível.

## Limitações da publicação

O Vercel publica a versão web. Não cria nem aloja o executável Windows do Electron. O código da aplicação Windows permanece no repositório como destino de compilação separado.

A pesquisa de música utiliza atualmente o endpoint web do YouTube Music, que não é uma API pública estável. Pode mudar, limitar pedidos ou deixar de responder. A reprodução utiliza o leitor oficial incorporado; o RIAMP3 não extrai nem transmite diretamente streams de áudio do YouTube.

Os planos gratuitos do Vercel e do Supabase têm quotas e regras de utilização. São adequados para testes pessoais dentro dos limites, mas não garantem armazenamento ou tráfego ilimitados para uma biblioteca pública de música.
