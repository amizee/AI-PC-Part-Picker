import { useEffect, useRef, useState } from "react"
import Button from "../components/Button"
import { useAI } from "../hooks/useAI"
import { ContextType } from "../types/ContextType"

const AIChatPage = () => {
  const [chatItems, setChatItems] = useState<PromptItem[]>([])
  const contexts = useRef<ContextType[]>([])
  const [prompt, setPrompt] = useState("")

  const handleSend = (text: string) => {
    setChatItems((prev) => [...prev, { prompt: text }])
    addContext({ role: "user", text: text })
    setPrompt("")
  }

  const addContext = (context: ContextType) => {
    contexts.current = [...contexts.current, { ...context }]
  }

  const clearChat = () => {
    setChatItems([])
    contexts.current = []
    setPrompt("")
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-center font-bold text-4xl text-primary-blue-dark">
        Welcome to the PC Part Picker Chat Bot!
      </h1>
      <ChatWindow
        chatItems={chatItems}
        context={contexts.current}
        addContext={addContext}
      />
      <ChatInput
        prompt={prompt}
        setPrompt={(input: string) => setPrompt(input)}
        handleSend={handleSend}
        clearChat={clearChat}
      />
    </div>
  )
}

type PromptItem = {
  prompt: string
}

const ChatWindow = ({
  chatItems,
  context,
  addContext,
}: {
  chatItems: PromptItem[]
  context: ContextType[]
  addContext: (context: ContextType) => void
}) => {
  const chatWindowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatWindowRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatItems])

  return (
    <div
      className="flex-grow p-5 flex flex-col sticky bottom-0 overflow-visible"
      ref={chatWindowRef}
    >
      {chatItems.map((item: PromptItem, index: number) => {
        return (
          <div key={index} className="flex flex-col items-start space-y-4 p-4">
            <div className="self-end">
              <PromptBox>{item.prompt}</PromptBox>
            </div>
            <div className="self-start w-1/2">
              <ResponseBox
                prompt={item.prompt}
                context={context}
                addContext={addContext}
              />
            </div>
          </div>
        )
      })}
      <div ref={chatWindowRef} />
    </div>
  )
}

const ChatInput = ({
  prompt,
  setPrompt,
  handleSend,
  clearChat,
}: {
  prompt: string
  setPrompt: (value: string) => void
  handleSend: (text: string) => void
  clearChat: () => void
}) => {
  return (
    <div className="h-fit flex sticky bottom-0">
      <form className="flex w-full gap-4">
        <input
          className="border flex-grow h-full rounded-md"
          type="text"
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value)
          }}
        />
        <Button
          type="submit"
          className="w-fit py-4"
          onClick={(e) => {
            handleSend(prompt)
            e.preventDefault()
          }}
        >
          Send
        </Button>
        <Button
          type="button"
          className="w-fit py-4"
          onClick={(e) => {
            clearChat()
            e.preventDefault()
          }}
        >
          Clear Chat
        </Button>
      </form>
    </div>
  )
}

const ResponseBox = ({
  context,
  prompt,
  addContext,
}: {
  context: ContextType[]
  prompt: string
  addContext: (context: ContextType) => void
}) => {
  const { data, isLoading, isError } = useAI(context, prompt)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (isError) {
    return <div>Failed to fetch response</div>
  }

  if (data?.response) {
    addContext({ role: "model", text: data?.response })
  }

  return (
    <div className="bg-primary-blue-light w-fit p-4 rounded-md text-white">
      {data?.response}
    </div>
  )
}

const PromptBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-primary-blue-dark w-fit p-4 rounded-md text-white">
      {children}
    </div>
  )
}

export default AIChatPage
