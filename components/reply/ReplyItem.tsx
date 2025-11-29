import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

interface ReplyItemProps {
  reply: {
    id: string
    content: string
    created_at: string
    profiles: {
      display_name: string | null
      email: string
    } | null
  }
}

export function ReplyItem({ reply }: ReplyItemProps) {
  return (
    <div className="border-l-2 border-muted pl-4 py-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span className="font-medium">
          {reply.profiles?.display_name || reply.profiles?.email || '匿名'}
        </span>
        <span>•</span>
        <span>
          {formatDistanceToNow(new Date(reply.created_at), {
            addSuffix: true,
            locale: ja,
          })}
        </span>
      </div>
      <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
    </div>
  )
}
