# 🎁 Gifty

Listas de presentes em grupo (família e amigos) com **reserva secreta**: quem ganha o presente nunca vê o que foi reservado.

Stack: Next.js 14 (App Router, Server Actions) · Tailwind CSS · Turso (LibSQL) + Drizzle ORM · bcryptjs + JWT em cookie httpOnly. Feito para rodar 100% nos planos gratuitos da Vercel e do Turso.

## Funcionalidades

- **Conta:** cadastro e login com e-mail e senha (hash bcrypt, sessão JWT de 30 dias).
- **Perfil:** tamanhos de blusa, calça e calçado, mais observações livres.
- **Lista de desejos:** adicionar, editar e remover itens (nome, descrição, link).
- **Reserva secreta:** outros membros reservam itens (badge amarelo "Reservado"); o dono da lista não vê nem se há reservas.
- **Grupos:** no máximo 3 por usuário, com código de convite (ex.: `SILVA-8821`).
  - Criador: vê e regera o código, remove membros, deleta o grupo.
  - Membro: pode sair a qualquer momento.

## Começando

Requer Node 18.17+ (testado com Node 20).

```bash
npm install
cp .env.example .env     # preencha as variáveis (veja abaixo)
npm run db:push          # cria as tabelas no banco
npm run dev              # http://localhost:3000
```

### Variáveis de ambiente

| Variável             | Descrição                                                          |
| -------------------- | ------------------------------------------------------------------ |
| `TURSO_DATABASE_URL` | URL do banco (`libsql://...`) ou `file:local.db` para dev local    |
| `TURSO_AUTH_TOKEN`   | Token do Turso (não necessário com `file:`)                        |
| `AUTH_SECRET`        | Segredo do JWT, mínimo 16 caracteres (`openssl rand -base64 32`)   |

### Criando o banco no Turso

```bash
turso db create gifty
turso db show gifty --url       # -> TURSO_DATABASE_URL
turso db tokens create gifty    # -> TURSO_AUTH_TOKEN
```

## Deploy na Vercel

1. Suba o repositório no GitHub e importe o projeto na Vercel.
2. Cadastre as 3 variáveis de ambiente acima.
3. Rode `npm run db:push` uma vez, localmente, apontando para o banco do Turso.
4. Faça o deploy.

## Scripts

| Comando           | O que faz                          |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento        |
| `npm run build`   | Build de produção                  |
| `npm run start`   | Serve o build                      |
| `npm run lint`    | Checagem de tipos (`tsc --noEmit`) |
| `npm run db:push` | Aplica o schema Drizzle no banco   |

## Estrutura

```
src/
├── db/                  schema Drizzle e cliente LibSQL
├── lib/
│   ├── jwt.ts           assinatura/verificação do token
│   ├── auth.ts          sessão por cookie, getCurrentUser/requireUser
│   ├── access.ts        grupos em comum e permissão de admin
│   └── actions/         Server Actions: auth, profile, groups, wishlist
├── middleware.ts        protege rotas autenticadas
├── components/          formulários, navegação, itens de lista
└── app/
    ├── login, register
    └── (app)/           groups, groups/[id], members/[userId], wishlist, profile
```

## Notas de design

- A lista de desejos é **por usuário** e aparece em todos os grupos dele.
- A tela da própria lista nunca consulta a tabela `reservations`, garantindo o sigilo no servidor, não só na UI.
- Não há rate limit no login; considere adicionar um (ex.: Upstash) em produção.
