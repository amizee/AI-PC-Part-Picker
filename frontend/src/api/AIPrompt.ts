import { PromptRequest, PromptResponse } from "../types/PromptTypes"
import { axios } from "./Query"

export const getPrompt = async (
  prompt: PromptRequest
): Promise<PromptResponse> => {
  try {
    const response = await axios.post<PromptResponse>("/prompt", prompt)
    return response.data
  } catch (error) {
    throw new Error("Failed to fetch prompt response")
  }
}
