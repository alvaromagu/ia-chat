import { Chat, ChatPreview } from '../types/chat'

export async function list (): Promise<Chat[]> {
  const json = localStorage.getItem('chats')
  const chats: Chat[] = json ? JSON.parse(json) : []
  return chats
}

export async function listPreview (): Promise<ChatPreview[]> {
  const chats = await list()
  return chats.map(chat => {
    let lastUserMessage = chat.messages.reverse().find(msg => msg.role === 'user')?.content ?? 'Chat started'
    if (typeof lastUserMessage === 'object') {
      lastUserMessage = 'Chat started'
    }
    return {
      id: chat.id,
      lastMessage: lastUserMessage
    }
  })
}

export async function get (id: string): Promise<Chat | undefined> {
  const chats = await list()
  return chats.find(chat => chat.id === id)
}

export async function create (chat: Chat): Promise<void> {
  const {id} = chat
  if (id == null) {
    throw new Error('Chat ID is required')
  }
  const foundChat = await get(id)
  if (foundChat != null) {
    throw new Error('Chat already exists')
  }
  const chats = await list()
  chats.push(chat)
  localStorage.setItem('chats', JSON.stringify(chats))
}

export async function update (chat: Chat): Promise<void> {
  const {id} = chat
  if (id == null) {
    return
  }
  const chats = await list()
  const index = chats.findIndex(chat => chat.id === id)
  if (index === -1) {
    return
  }
  chats[index] = chat
  localStorage.setItem('chats', JSON.stringify(chats))
}

export async function upsert (chat: Chat): Promise<void> {
  const {id} = chat
  if (id == null) {
    throw new Error('Chat ID is required')
  }
  const chats = await list()
  const index = chats.findIndex(chat => chat.id === id)
  if (index === -1) {
    chats.push(chat)
  } else {
    chats[index] = chat
  }
  localStorage.setItem('chats', JSON.stringify(chats))
}

export async function remove (id: string): Promise<void> {
  const chats = await list()
  const index = chats.findIndex(chat => chat.id === id)
  if (index === -1) {
    return
  }
  chats.splice(index, 1)
  localStorage.setItem('chats', JSON.stringify(chats))
}
