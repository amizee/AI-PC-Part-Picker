import { ContextType } from "./ContextType"

export interface PromptResponse {
  response: string
}

export interface PromptRequest {
  context: ContextType[]
  prompt: string
}
