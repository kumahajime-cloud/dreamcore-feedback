import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CategoryBadge } from './CategoryBadge'
import { StatusBadge } from './StatusBadge'
import { VoteButton } from './VoteButton'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

interface TopicCardProps {
  topic: {
    id: string
    title: string
    category: 'bug_report' | 'feature_request' | 'feedback' | 'discussion'
    status?: 'unconfirmed' | 'in_progress' | 'completed'
    vote_count: number
    created_at: string
    profiles: {
      display_name: string | null
      email: string
    } | null
  }
  hasVoted?: boolean
}

export function TopicCard({ topic, hasVoted = false }: TopicCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        {/* PC版: 横並びレイアウト */}
        <div className="hidden md:flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link
              href={`/topic/${topic.id}`}
              prefetch={true}
              className="text-lg font-semibold hover:underline block truncate"
            >
              {topic.title}
            </Link>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <span>
                {topic.profiles?.display_name || topic.profiles?.email || '匿名'}
              </span>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(topic.created_at), {
                  addSuffix: true,
                  locale: ja,
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CategoryBadge category={topic.category} />
            <StatusBadge status={topic.status} />
            <VoteButton
              topicId={topic.id}
              initialVoteCount={topic.vote_count}
              initialHasVoted={hasVoted}
            />
          </div>
        </div>

        {/* スマホ版: カード全体がクリック可能 */}
        <Link href={`/topic/${topic.id}`} prefetch={true} className="md:hidden block space-y-3">
          <div className="text-lg font-semibold">
            {topic.title}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="truncate">
              {topic.profiles?.display_name || topic.profiles?.email || '匿名'}
            </span>
            <span>•</span>
            <span className="whitespace-nowrap">
              {formatDistanceToNow(new Date(topic.created_at), {
                addSuffix: true,
                locale: ja,
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryBadge category={topic.category} />
            <StatusBadge status={topic.status} />
            <div onClick={(e) => e.preventDefault()}>
              <VoteButton
                topicId={topic.id}
                initialVoteCount={topic.vote_count}
                initialHasVoted={hasVoted}
              />
            </div>
          </div>
        </Link>
      </CardHeader>
    </Card>
  )
}
