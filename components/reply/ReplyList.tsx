import { ReplyItem } from './ReplyItem'

interface ReplyListProps {
  replies: Array<{
    id: string
    content: string
    created_at: string
    profiles: {
      display_name: string | null
      email: string
    } | null
  }>
}

export function ReplyList({ replies }: ReplyListProps) {
  if (!replies || replies.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        まだ返信がありません
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {replies.map((reply) => (
        <ReplyItem key={reply.id} reply={reply} />
      ))}
    </div>
  )
}
