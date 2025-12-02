import { createClient } from '@/lib/supabase-server'
import { CategoryBadge } from '@/components/topic/CategoryBadge'
import { StatusBadge } from '@/components/topic/StatusBadge'
import { StatusManager } from '@/components/topic/StatusManager'
import { VoteButton } from '@/components/topic/VoteButton'
import { ReplyList } from '@/components/reply/ReplyList'
import { ReplyForm } from '@/components/reply/ReplyForm'
import { TopicActions } from '@/components/topic/TopicActions'
import { AdminActions } from '@/components/topic/AdminActions'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { notFound } from 'next/navigation'

// 運営メールアドレス（環境変数で管理することを推奨）
const ADMIN_EMAILS = ['rimbaud18911110@gmail.com', 'riku2004@gmail.com']

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
          {/* PC版: 横並びレイアウト */}
          <div className="hidden md:flex items-start justify-between gap-4">
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
              <StatusBadge status={topic.status} />
              <VoteButton
                topicId={topic.id}
                initialVoteCount={topic.vote_count}
                initialHasVoted={hasVoted}
              />
            </div>
          </div>

          {/* スマホ版: 縦並びレイアウト（読みやすい順序） */}
          <div className="md:hidden space-y-4">
            {/* 1. タイトル */}
            <h1 className="text-2xl font-bold">{topic.title}</h1>

            {/* 2. カテゴリー・投票ボタン */}
            <div className="flex items-center gap-2 flex-wrap">
              <CategoryBadge category={topic.category} />
              <VoteButton
                topicId={topic.id}
                initialVoteCount={topic.vote_count}
                initialHasVoted={hasVoted}
              />
            </div>

            {/* 3. 投稿者名・日時 */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
        </CardHeader>
        <CardContent>
          {/* 4. 本文 */}
          <p className="whitespace-pre-wrap text-lg">{topic.content}</p>

          {/* 5. ステータス（スマホのみ本文の下に表示） */}
          <div className="md:hidden mt-6 pt-6 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">ステータス:</span>
              <StatusBadge status={topic.status} />
            </div>
          </div>

          {/* 運営のみステータス管理を表示 */}
          {user && user.email && ADMIN_EMAILS.includes(user.email) && (
            <div className="mt-6 pt-6 border-t">
              <StatusManager topicId={topic.id} currentStatus={topic.status} />
            </div>
          )}

          {/* 投稿者本人のみ編集・削除ボタンを表示 */}
          {user && user.id === topic.user_id && (
            <div className="mt-6 pt-6 border-t">
              <TopicActions topicId={topic.id} />
            </div>
          )}

          {/* 管理者のみ削除ボタンを表示（投稿者本人ではない場合） */}
          {user &&
            user.email &&
            ADMIN_EMAILS.includes(user.email) &&
            user.id !== topic.user_id && (
              <div className="mt-6 pt-6 border-t">
                <AdminActions topicId={topic.id} />
              </div>
            )}
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
