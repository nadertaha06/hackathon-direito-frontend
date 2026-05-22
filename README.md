# Contrato Justo — Frontend

Landing page do **Contrato Justo**, plataforma que ajuda pessoas comuns a
entender se foram lesadas em contratos que assinaram. Esta etapa entrega a
landing page e o fluxo de autenticação (`/`, `/login`, `/cadastro`).

## Stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS v4** (tokens de design via `@theme` em `src/index.css`)
- **React Router v7** para navegação
- **lucide-react** para ícones
- **react-hot-toast** para avisos (ex: sistema indisponível)
- Primitivas de UI no estilo shadcn (`src/components/ui`)

## Como rodar

Pré-requisitos: Node 18+.

```bash
npm install
npm run dev
```

Abre em http://localhost:5173.

### Variáveis de ambiente

A URL da API é lida de `VITE_API_URL`. Copie o exemplo e ajuste se preciso:

```bash
cp .env.example .env.local
```

```
VITE_API_URL=http://localhost:8000   # default quando não definido
```

### Outros comandos

```bash
npm run build     # type-check + build de produção
npm run preview   # serve o build localmente
npm run lint      # ESLint (flat config)
```

## Rotas

| Rota        | Descrição                                                 |
| ----------- | --------------------------------------------------------- |
| `/`         | Landing: hero, como funciona, o que analisamos, lei       |
| `/login`    | `POST /auth/login` → guarda token e vai para `/dashboard` |
| `/cadastro` | `POST /auth/register` + login automático → `/dashboard`   |

> `/dashboard` ainda não existe — o login apenas redireciona (404 esperado).

## Integração com a API

- `POST /auth/register` — `{ email, password }`
- `POST /auth/login` — `{ email, password }` → `{ access_token }`

O token é guardado em `localStorage` (`cj_token`) e enviado como
`Authorization: Bearer <token>`. Erros tratados: `401` (credenciais
inválidas), `409` (email já cadastrado), `400` (validação do servidor) e
`503`/falha de rede (toast de indisponibilidade).

## Estrutura

```
src/
  components/
    ui/            primitivas (button, input, label, card)
    auth/          AuthLayout, FormError
    landing/       Hero, HowItWorks, WhatWeLookAt, LawBacked, AnalysisMockup
    Header, Footer, Wordmark, Reveal
  pages/           LandingPage, LoginPage, CadastroPage
  services/        api (fetch wrapper) + auth
  hooks/           useScrollReveal
  lib/             utils (cn), handleApiError
  config/          config (apiBaseUrl)
```

## Identidade visual

Direção "Conversa franca": calor humano e sobriedade. Paleta café/creme,
títulos em Fraunces, corpo em Inter, citações de lei em JetBrains Mono. As
cores de semáforo (verde/âmbar/vermelho) são **reservadas** para resultados
de análise.
