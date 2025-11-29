import { createClient } from '@/lib/supabase-server'
import { CategoryBadge } from '@/components/topic/CategoryBadge'
import { VoteButton } from '@/components/topic/VoteButton'
import { ReplyList } from '@/components/reply/ReplyList'
import { ReplyForm } from '@/components/reply/ReplyForm'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { notFound } from 'next/navigation'

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // ユーザー情報を取得
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // トピックを取得
  const { data: topic, error } = await supabase
    .from('topics')
    .select('*, profiles(*)')
    .eq('id', id)
    .single()

  if (error || !topic) {
    notFound()
  }

  // 返信を取得
  const { data: replies } = await supabase
    .from('replies')
    .select('*, profiles(*)')
    .eq('topic_id', id)
    .order('created_at', { ascending: true })

  // ユーザーの投票状態を確認
  let hasVoted = false
  if (user) {
    const { data: vote } = await supabase
      .from('votes')
      .select('id')
      .eq('user_id', user.id)
      .eq('topic_id', id)
      .single()
    hasVoted = !!vote
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* トピック詳細 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">{topic.title}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>
                  {topic.profiles?.display_name ||
                    topic.profiles?.email ||
                    '匿名'}
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
              <VoteButton
                topicId={topic.id}
                initialVoteCount={topic.vote_count}
                initialHasVoted={hasVoted}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-lg">{topic.content}</p>
        </CardContent>
      </Card>

      {/* 返信セクション */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">
            返信 ({replies?.length || 0})
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <ReplyList replies={replies || []} />

          {user ? (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">返信を投稿</h3>
              <ReplyForm topicId={topic.id} />
            </div>
          ) : (
            <div className="border-t pt-6 text-center text-muted-foreground">
              返信するにはログインが必要です
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
