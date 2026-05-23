/**
 * Tipos de domínio espelhando os payloads do back-end Contrato Justo.
 * Strings vindas do servidor mantêm `string` em vez de Date para não
 * gastar parse em listas grandes — converte só na renderização.
 */

export type GravidadeClausula = "ABUSIVA" | "POTENCIALMENTE_ABUSIVA" | "NAO_ABUSIVA"

export type ScoreRisco = "BAIXO" | "MODERADO" | "ALTO"

export interface DispositivoLegal {
  artigo: string
  fonte: string
  texto?: string
  similaridade?: number
}

export interface ClausulaExtraida {
  numero: number
  titulo?: string
  texto: string
}

export interface AnaliseClausula {
  numero: number
  titulo?: string
  gravidade: GravidadeClausula
  resumo: string
  texto_clausula?: string
  dispositivos: DispositivoLegal[]
}

export interface AnaliseResponse {
  analise_id: string
  chat_id: string
  tipo_contrato: string
  score_risco: ScoreRisco
  resumo_executivo: string
  pontos_negociacao: string[]
  clausulas_extraidas: ClausulaExtraida[]
  analises_clausulas: AnaliseClausula[]
}

/** Payload embutido na primeira mensagem do assistant quando o chat tem análise. */
export interface AnalisePayload {
  tipo_contrato: string
  score_risco: ScoreRisco
  resumo_executivo: string
  pontos_negociacao: string[]
  clausulas_extraidas: ClausulaExtraida[]
  analises_clausulas: AnaliseClausula[]
}

export interface ChatResponse {
  id: string
  analise_id: string | null
  titulo: string
  criado_em: string
  atualizado_em: string
  deletado_em: string | null
  ultima_mensagem_preview: string | null
}

export type MessageRole = "user" | "assistant"

export interface MessageResponse {
  id: string
  chat_id: string
  role: MessageRole
  content: string
  payload_json: AnalisePayload | null
  criado_em: string
}
