import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat, getMissingKeys } from '@/app/actions'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { Session } from '@/lib/types'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const session = await auth()

  if (!session?.user?.id) {
    return {}
  }

  const chat = await getChat(params.id, session.user.id)
  return {
    title: chat?.title?.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect(`/login?next=/chat/${params.id}`)
  }

  const userId = session.user.id
  const chat = await getChat(params.id, userId)

  if (!chat) {
    redirect('/')
  }

  if (chat.userId !== userId) {
    notFound()
  }

  return (
    <AI
      initialAIState={{
        chatId: chat.id,
        messages: chat.messages,
        interactions: []
      }}
    >
      <Chat
        id={chat.id}
        session={session as Session}
        initialMessages={chat.messages}
        missingKeys={await getMissingKeys()}
      />
    </AI>
  )
}
