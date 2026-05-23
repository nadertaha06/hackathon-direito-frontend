import { useOutletContext } from "react-router-dom"
import { EmptyState } from "@/components/app/EmptyState"
import { ChatView } from "@/components/app/ChatView"

interface AppOutletContext {
  onPdfSelected: (file: File) => void
  onAskQuestion: () => void
}

/** /app — empty state quando sem chat. */
export function AppHomePage() {
  const { onPdfSelected, onAskQuestion } = useOutletContext<AppOutletContext>()
  return <EmptyState onPdfSelected={onPdfSelected} onAskQuestion={onAskQuestion} />
}

/** /app/c/:chatId — conversa ativa. */
export function AppChatPage() {
  const { onPdfSelected } = useOutletContext<AppOutletContext>()
  return <ChatView onPdfDropped={onPdfSelected} />
}
