# RIAMP3

Projeto RIAMP3 preparado para publicação web com **GitHub + Vercel**, mantendo a interface original e a ligação ao Supabase para contas, sincronização da biblioteca e carregamento privado de ficheiros de áudio.

## Publicar na Internet

1. Cria um projeto no Supabase e executa `supabase/schema.sql` no SQL Editor.
2. Envia todos os ficheiros desta pasta para um repositório GitHub.
3. Importa esse repositório no Vercel.
4. Nas variáveis de ambiente do Vercel, configura `SUPABASE_URL` e `SUPABASE_ANON_KEY`.
5. Faz o deploy. O Vercel publica a interface a partir de `public/` e disponibiliza a API a partir de `api/`.

Segue [DEPLOY-VERCEL.md](DEPLOY-VERCEL.md) para instruções completas e [SUPABASE-SETUP.md](SUPABASE-SETUP.md) para a configuração da base de dados.

## Pré-visualização local

Requer Node.js 20 ou superior. Na pasta do projeto:

```bash
npm run serve
```

Abre o endereço indicado no terminal (por omissão, `http://127.0.0.1:8788`). Para testar contas localmente, copia `supabase.config.json.example` para `supabase.config.json` e preenche o URL público do projeto Supabase e a chave anon/publishable.

## Aplicação Windows

O código-fonte opcional do Electron foi mantido. Num ambiente Windows compatível, instala as dependências com `npm install`, executa `npm start` para abrir a aplicação e `npm run pack` para criar o pacote Windows x64.

## Limitações importantes

- A reprodução de faixas do YouTube utiliza o leitor oficial incorporado, visível e com controlos. Alguns vídeos não permitem incorporação e, por isso, não podem ser reproduzidos dentro do RIAMP3.
- A pesquisa atual depende do endpoint web do YouTube Music, que não é uma API pública estável e pode mudar ou limitar pedidos.
- Os ficheiros enviados pelo utilizador ficam no Storage privado do respetivo utilizador Supabase. Envia apenas áudio que tenhas direito a armazenar e reproduzir.
- Os planos gratuitos do Vercel e do Supabase têm limites de utilização, armazenamento e tráfego. Esta configuração serve para uma publicação pessoal/teste, não garante alojamento ilimitado nem serviço comercial de streaming.
