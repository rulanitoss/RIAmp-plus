# RIAMP3 — configuração do Supabase

O projeto utiliza o Supabase Auth para contas, PostgreSQL para sincronizar a biblioteca de cada utilizador e um bucket privado do Supabase Storage para ficheiros de áudio enviados pelos próprios utilizadores.

## 1. Criar o projeto

1. Cria um projeto em https://supabase.com.
2. Abre **Project Settings → API**.
3. Copia o **Project URL** e a chave **anon/publishable**.
4. Nunca uses uma chave `service_role` ou uma chave secreta no browser, no renderer Electron, no GitHub ou numa publicação pública.

## 2. Criar as tabelas e o armazenamento

No Supabase, abre **SQL Editor → New query** e executa o ficheiro completo `supabase/schema.sql`. O script cria:

- `riamp3_user_data`: favoritos, artistas seguidos, playlists e histórico.
- `riamp3_tracks`: metadados dos ficheiros carregados.
- O bucket privado `riamp3-audio`.
- Políticas RLS para cada utilizador só conseguir consultar e alterar os seus próprios dados e ficheiros.

## 3. Configurar o Vercel

Em **Project Settings → Environment Variables**, adiciona:

- `SUPABASE_URL` = URL do projeto.
- `SUPABASE_ANON_KEY` = chave anon/publishable.

Aplica as variáveis aos ambientes pretendidos e volta a publicar o projeto depois de as alterar.

## 4. Configurar o desenvolvimento local

Copia `supabase.config.json.example` para `supabase.config.json` e preenche `url` e `anonKey`. O ficheiro real é ignorado pelo Git para evitar que seja enviado acidentalmente para o repositório.

Na aplicação Windows, o programa cria uma cópia na pasta de dados do utilizador na primeira execução. Se necessário, edita o ficheiro na pasta RIAMP3 dentro de `%APPDATA%`.

## 5. Autenticação

Mantém a autenticação por e-mail ativa. Para uma publicação real, utiliza confirmação de e-mail e configura um serviço SMTP fiável. Adiciona o domínio de produção do Vercel aos URLs de site/redirecionamento permitidos no Supabase.

## 6. Carregamento de áudio

A interface aceita formatos de áudio comuns e limita cada ficheiro a 50 MB. O browser envia o áudio diretamente para o bucket privado do Supabase Storage, utilizando a sessão do próprio utilizador. O ficheiro não passa pelo corpo de uma função Vercel.

A capacidade de armazenamento e a largura de banda dependem do plano Supabase. Envia apenas áudio que tenhas direito a armazenar e reproduzir.
