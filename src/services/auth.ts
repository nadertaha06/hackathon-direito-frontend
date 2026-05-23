import { apiRequest } from "./api"

const TOKEN_KEY = "cj_token"
const EMAIL_KEY = "cj_email"

export interface Credentials {
  email: string
  senha: string
}

interface LoginResponse {
  access_token: string
  token_type?: string
}

/**
 * Armazenamento do token. localStorage por simplicidade e consistência
 * com a API atual (Bearer header). Trocar por cookie httpOnly é dívida
 * técnica conhecida.
 */
export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EMAIL_KEY)
  },
}

export const emailStore = {
  get: () => localStorage.getItem(EMAIL_KEY),
  set: (email: string) => localStorage.setItem(EMAIL_KEY, email),
}

export async function login(credentials: Credentials): Promise<string> {
  const data = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: credentials,
  })
  tokenStore.set(data.access_token)
  emailStore.set(credentials.email)
  return data.access_token
}

export async function register(credentials: Credentials): Promise<void> {
  await apiRequest("/auth/register", {
    method: "POST",
    body: credentials,
  })
}

/** Cadastro seguido de login automático, conforme spec. */
export async function registerAndLogin(credentials: Credentials): Promise<string> {
  await register(credentials)
  return login(credentials)
}
