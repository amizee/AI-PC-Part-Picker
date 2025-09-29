import { useQuery } from "@tanstack/react-query"
import { getPrompt } from "../api/AIPrompt"
import { ContextType } from "../types/ContextType"

export const useAI = (context: ContextType[], prompt: string) => {
  return useQuery({
    queryKey: ["ai", prompt],
    queryFn: () => getPrompt({ context, prompt }),
  })
}
