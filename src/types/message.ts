import { ChatCompletionMessageParam } from '@mlc-ai/web-llm'

export type Message = ChatCompletionMessageParam & { id: string }
