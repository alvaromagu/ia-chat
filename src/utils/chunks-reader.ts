import { ChatCompletionChunk, ChatCompletionMessageParam, WebWorkerMLCEngine } from '@mlc-ai/web-llm'
import { systemMessage } from '../constants/system'

export async function * chunksReader (
  chunks: AsyncIterable<ChatCompletionChunk>
) {
  let buffer = ''
  for await (const chunk of chunks) {
    const [choice] = chunk.choices
    buffer += choice?.delta.content ?? ''
    yield buffer
  }
}

export async function getChuns ({
  engine,
  messages
}: {
  engine: WebWorkerMLCEngine
  messages: ChatCompletionMessageParam[]
}) {
  return await engine.chat.completions.create({
    messages: [
      systemMessage,
      ...messages
    ],
    stream: true
  })
}