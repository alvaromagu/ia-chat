import { Message } from './message'

export type Chat = {
  id: string
  messages: Message[]
}

export type ChatPreview = {
  id: string
  lastMessage: string
}