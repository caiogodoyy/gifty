# CLAUDE.md - Gifty

> **Manutenção deste arquivo:** sempre que houver mudanças relevantes no app (novas funcionalidades, alterações no schema, nas regras de sigilo/autorização, nas variáveis de ambiente, nos comandos ou na estrutura de pastas), atualize este `CLAUDE.md` na mesma tarefa.

## Visão Geral
**Gifty** é um app web em português (pt-BR) de listas de presentes em grupo (família e amigos) com **reserva secreta** e **amigo secreto**. Quem ganha o presente nunca vê o que foi reservado por outros. O app foi pensado para rodar 100% nos planos gratuitos da Vercel e do Turso.

## Stack
- Next.js 14 (App Router, Server Components, Server Actions) + React 18
- Tailwind CSS 3
- Turso (LibSQL) + Drizzle ORM (`dialect: "turso"`; em dev local use `file:local.db`)
- Auth própria: bcryptjs (cost 10) + JWT HS256 (`jose`) em cookie httpOnly
- Vitest para testes unitários
- TypeScript; alias `@/*` → `src/*`

## Comandos
- `npm install` — instala dependências
- `cp .env.example .env` — preencher variáveis
- `npm run db:push` — aplica o schema Drizzle no banco (não há migrations versionadas; `drizzle/` não existe)
- `npm run dev` — servidor em http://localhost:3000
- `npm run build` / `npm run start` — build e serve de produção
- `npm run lint` — apenas checagem de tipos (`tsc --noEmit`), sem ESLint
- `npm test` — `vitest run`

## Variáveis de Ambiente
| Variável | Descrição |
| --- | --- |
| `TURSO_DATABASE_URL` | `libsql://...` ou `file:local.db` (padrão se ausente) |
| `TURSO_AUTH_TOKEN` | Token do Turso (desnecessário com `file:`) |
| `AUTH_SECRET` | Segredo do JWT, mínimo 16 caracteres; `jwt.ts` lança erro se ausente/curto |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Envio do e-mail de redefinição via SMTP (nodemailer; porta padrão 465). Sem `SMTP_HOST` em dev, o link é impresso no console; em produção o envio falha |
| `EMAIL_FROM` | Remetente (padrão: `SMTP_USER`) |
| `APP_URL` | URL pública usada no link de redefinição (padrão `http://localhost:3000`) |

## Funcionalidades
- **Conta:** cadastro/login com e-mail e senha; sessão JWT de 30 dias. Senha: 8+ caracteres, letras, números e ao menos uma maiúscula (`lib/validation.ts`, também usada para validação em tempo real nos formulários). Em `/profile` é possível editar nome/e-mail (trocar e-mail exige senha atual) e alterar a senha.
- **Esqueci a senha:** `/forgot-password` envia um link (`/reset-password?token=...`) válido por 60 min e de uso único; só o SHA-256 do token fica em `password_resets`. A resposta é a mesma exista o e-mail ou não. Pedir novo link invalida os anteriores; redefinir apaga todos os tokens do usuário. Sessões JWT já emitidas **não** são invalidadas.
- **UI (mobile-first, coluna `max-w-md`):** header com logo + avatar de iniciais (sem engrenagem), barra inferior fixa (Grupos / Minha Lista / Perfil) em `components/Nav.tsx` e botões flutuantes (`FloatingAction`: "+ Novo grupo", "+ Desejo"). Paleta terracota/sálvia/creme em `tailwind.config.ts` (`ink` = texto marrom).
- **Perfil (`/profile`):** avatar (inicial do nome ou um emoji de `lib/avatars.ts` em `users.avatar_emoji`; fotos não são aceitas), nome, e-mail, "Editar Perfil" (`?secao=conta`: escolha de emoji, dados da conta e senha), "Minhas Medidas & Tamanhos" (`?secao=medidas`: blusa, calça, calçado + observações), "Ajuda & Suporte" (`/help`: o que é, por que usar, passo a passo e FAQ) e "Sair da conta". Não há seções de privacidade/notificações.
- **Lista de desejos (`/wishlist`):** adicionar, editar e remover itens (nome ≤120, descrição ≤500, link ≤500; link sem protocolo recebe `https://`; imagem opcional **somente por URL** em `items.image_url`; o app não armazena nenhuma imagem, e URLs `data:` são ignoradas). A lista é **por usuário** e aparece em todos os grupos dele.
- **Reserva secreta:** outros membros reservam itens na página do membro; badge amarelo "Reservado". O dono nunca vê reservas. Quem reservou pode cancelar; o criador do grupo também pode cancelar reservas de membros do seu grupo.
- **Grupos:** máximo de `MAX_GROUPS = 3` por usuário (definido em `db/schema.ts`). Código de convite no formato `SOBRENOME-1234`.
  - Criador: vê e regera o código, remove membros, deleta o grupo, realiza/encerra o amigo secreto. Não pode sair (deve deletar).
  - Membro: pode sair a qualquer momento; clica em um membro para ver a lista de desejos dele.
- **Amigo secreto:** o criador sorteia na página do grupo (`SecretSantaForm`, modal). Cada membro vê apenas quem tirou. Entrada de novo membro, remoção ou saída de membro **apagam o sorteio do grupo** (precisa ser refeito).

## Modelo de Dados (`src/db/schema.ts`)
IDs são `crypto.randomUUID()` (text); datas são `integer` modo `timestamp`.
- `users` — id, name, email (unique), passwordHash (bcrypt), shirtSize, pantsSize, shoeSize, notes, avatarEmoji, createdAt
- `groups` — id, name, inviteCode (unique), ownerId → users, createdAt
- `group_members` — PK (groupId, userId), joinedAt; cascade em groups/users
- `items` — id, userId → users (cascade), name, description, url, imageUrl, createdAt
- `reservations` — PK itemId (uma reserva por item), reservedBy → users, createdAt
- `password_resets` — PK tokenHash (SHA-256), userId → users (cascade), expiresAt
- `secret_santa` — PK (groupId, giverId), receiverId, createdAt

## Estrutura
```
src/
├── db/
│   ├── index.ts           cliente LibSQL + drizzle
│   └── schema.ts          tabelas e MAX_GROUPS
├── lib/
│   ├── jwt.ts             signToken/verifyToken, COOKIE_NAME (gifty_session), SESSION_SECONDS
│   ├── auth.ts            createSession/destroySession, getCurrentUser (cache), requireUser (server-only)
│   ├── access.ts          groupIdsOf, sharedGroupIds, sharesGroup, isAdminOver (server-only)
│   ├── resetToken.ts      newResetToken/hashToken (redefinição de senha; testado em resetToken.test.ts)
│   ├── mail.ts            sendMail (SMTP via nodemailer) e appUrl
│   ├── validation.ts      EMAIL_RE, PASSWORD_RULES, passwordValid (usado no cliente e servidor)
│   ├── secretSanta.ts     drawSecretSanta: embaralhamento Fisher-Yates + ciclo único
│   ├── secretSanta.test.ts testes do sorteio
│   └── actions/           Server Actions ("use server"): auth, profile, groups, wishlist
├── middleware.ts          protege /groups, /wishlist, /profile, /help; redireciona /login e /register se logado; /forgot-password e /reset-password são públicas
├── components/            formulários, Nav, MemberItem, SecretSantaForm, ConfirmButton etc.
└── app/
    ├── page.tsx, login/, register/, forgot-password/, reset-password/ (públicas)
    └── (app)/             layout autenticado: groups, groups/[id], groups/[id]/members/[userId], wishlist, profile, help
```

## Regras Críticas de Segurança e Privacidade
1. **Sigilo da reserva no servidor:** `/wishlist` (lista do próprio usuário) **nunca** consulta `reservations`. `groups/[id]/members/[userId]` redireciona para `/wishlist` se o alvo for o próprio visitante. Não adicione joins com `reservations` em telas do dono.
2. **Sigilo do amigo secreto:** telas só consultam a linha com `giverId = usuário logado`. Nunca exponha pares de outros membros (inclusive ao criador).
3. **Autorização sempre no servidor:** toda Server Action chama `requireUser()`; ações de criador usam `requireOwner(groupId)`; filtros de escrita incluem `userId` do dono (ex.: `updateItem`, `deleteItem`). Reservar exige `sharesGroup` e proíbe reservar item próprio. Páginas de grupo/membro verificam a participação do visitante (e do alvo) no grupo da URL.
4. **Senhas:** só existem como hash bcrypt; nunca registre senhas ou tokens de reset em texto claro (no banco só o SHA-256 do token).
5. **Login:** `bcrypt.compare` roda sempre (hash falso se o e-mail não existe) para evitar enumeração por tempo; mensagem de erro genérica. Não há rate limit.
6. **Cookie:** httpOnly, `sameSite: lax`, `secure` em produção.
7. `lib/auth.ts` e `lib/access.ts` usam `server-only`; `jwt.ts` não, pois é usado no middleware (edge).

## Convenções de Código
- Textos de UI, mensagens de erro e comentários em **português**.
- Server Actions de formulário com estado seguem `(_: FormState, formData) => Promise<FormState>` (`FormState = { error?: string } | undefined`) e são usadas com `useFormState`; ações de botão recebem ids via `.bind(null, id)`.
- Operações multi-tabela usam `db.batch([...])`. Não confie em FK/cascade: o código apaga dependentes explicitamente (ex.: `deleteItem` apaga a reserva, `deleteGroup` apaga sorteio e membros).
- Após mutações, chame `revalidatePath`.
- Consultas Drizzle diretamente nas páginas (Server Components) e nas actions; não há camada de repositório.
- Estilo com Tailwind e classes utilitárias próprias em `globals.css` (`card`, `btn-ghost`, paleta `sage`). Componentes cliente são só os que precisam de interatividade (`"use client"`).
- Testes ficam ao lado do código (`*.test.ts`); `drawSecretSanta` e `lib/resetToken.ts` são cobertos.

## Deploy
Vercel + Turso: cadastrar as variáveis de ambiente na Vercel, rodar `npm run db:push` localmente apontando para o banco Turso e fazer o deploy. `next.config.mjs` marca `@libsql/client` e `bcryptjs` como `serverComponentsExternalPackages`.
