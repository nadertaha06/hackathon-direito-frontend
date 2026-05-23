/**
 * Tipos de domínio espelhando os schemas Pydantic do back.
 *
 * Fonte: hackathon-direito-backend/src/{schemas,models/enums.py,entities/analise_clausula.py}.
 *
 * Strings vindas do servidor (datas, UUIDs) mantêm `string` em vez de Date pra
 * não gastar parse em listas — converte só na renderização.
 */

// ── Enums (sempre lowercase, vindos como str enum) ─────────────────────────
export type MessageRole = "user" | "assistant"

export type ScoreRisco = "verde" | "amarelo" | "vermelho"

export type TipoContrato =
  | "academia"
  | "plano_saude"
  | "financiamento"
  | "telecom"
  | "ecommerce"
  | "geral"
  | "nao_aplicavel"

export type GravidadeAbusividade =
  | "nao_abusiva"
  | "potencialmente_abusiva"
  | "abusiva"

// ── Análise ────────────────────────────────────────────────────────────────
export interface FundamentoUsado {
  base_juridica_id: string
  referencia: string
  fonte: string
  similaridade: number
  /** Presente nas respostas de /analisar (montada pelo schema); pode faltar no
   *  payload_json embutido na 1ª mensagem (que serializa via repo, sem essa property). */
  referencia_completa?: string
}

export interface ClausulaExtraida {
  indice: number
  texto_resumido: string
  texto_literal: string
  titulo_curto: string
  pagina?: number | null
  tags_sugeridas?: string[]
}

export interface AnaliseClausula {
  clausula_indice: number
  gravidade: GravidadeAbusividade
  explicacao: string
  fundamentos_usados: FundamentoUsado[]
}

/** Resposta de POST /analisar. */
export interface AnaliseResponse {
  analise_id: string
  chat_id: string
  tipo_contrato: TipoContrato
  score_risco: ScoreRisco
  resumo_executivo: string
  pontos_negociacao: string[]
  clausulas_extraidas: ClausulaExtraida[]
  analises_clausulas: AnaliseClausula[]
}

/**
 * Payload embutido na primeira mensagem do assistant quando o chat tem análise.
 * Mesma estrutura do AnaliseResponse acima (serializada via repo no back).
 */
export interface AnalisePayload {
  analise_id?: string
  tipo_contrato: TipoContrato
  score_risco: ScoreRisco
  resumo_executivo: string
  pontos_negociacao: string[]
  clausulas_extraidas: ClausulaExtraida[]
  analises_clausulas: AnaliseClausula[]
}

// ── Chats ──────────────────────────────────────────────────────────────────
/** GET /chats — item da listagem (com preview + deletado_em). */
export interface ChatListItem {
  id: string
  analise_id: string | null
  titulo: string | null
  criado_em: string
  atualizado_em: string
  deletado_em: string | null
  ultima_mensagem_preview: string | null
}

/** POST /chats — metadados (sem deletado_em, sem preview). */
export interface ChatResponse {
  id: string
  analise_id: string | null
  titulo: string | null
  criado_em: string
  atualizado_em: string
}

// ── Mensagens ──────────────────────────────────────────────────────────────
export interface DispositivoRecuperado {
  base_juridica_id: string
  referencia: string
  fonte: string
}

export interface MessageResponse {
  id: string
  chat_id: string
  role: MessageRole
  content: string
  replying_to_message_id: string | null
  dispositivos_recuperados: DispositivoRecuperado[]
  contexto_truncado: boolean
  /** Populado SÓ na 1ª mensagem de chats criados por /analisar. */
  payload_json: AnalisePayload | null
  criado_em: string
}
