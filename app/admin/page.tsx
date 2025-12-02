import { createClient } from '@/lib/supabase-server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CategoryBadge } from '@/components/topic/CategoryBadge'
import { StatusBadge } from '@/components/topic/StatusBadge'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

const ADMIN_EMAILS = ['rimbaud18911110@gmail.com', 'riku2004@gmail.com']

export default async function AdminDashboard() {
  const supabase = await createClient()

  // ユーザー確認
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 管理者でなければリダイレクト
  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
    redirect('/')
  }

  // 統計情報を取得
  const { data: topics } = await supabase
    .from('topics')
    .select('*, profiles(*)')
    .order('created_at', { ascending: false })

  const { data: users } = await supabase.from('profiles').select('*')

  const { data: replies } = await supabase.from('replies').select('*')

  // カテゴリー別集計
  const categoryCount = {
    bug_report: topics?.filter((t) => t.category === 'bug_report').length || 0,
    feature_request:
      topics?.filter((t) => t.category === 'feature_request').length || 0,
    feedback: topics?.filter((t) => t.category === 'feedback').length || 0,
    discussion: topics?.filter((t) => t.category === 'discussion').length || 0,
  }

  // ステータス別集計
  const statusCount = {
    unconfirmed:
      topics?.filter((t) => t.status === 'unconfirmed').length || 0,
    in_progress:
      topics?.filter((t) => t.status === 'in_progress').length || 0,
    completed: topics?.filter((t) => t.status === 'completed').length || 0,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">管理者ダッシュボード</h1>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← ホームに戻る
        </Link>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">総投稿数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{topics?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">ユーザー数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">返信数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{replies?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">未確認</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600">
              {statusCount.unconfirmed}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* カテゴリー別集計 */}
      <Card>
        <CardHeader>
          <CardTitle>カテゴリー別投稿数</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Bug Report</span>
              <span className="text-2xl font-bold">
                {categoryCount.bug_report}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Feature Request</span>
              <span className="text-2xl font-bold">
                {categoryCount.feature_request}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Feedback</span>
              <span className="text-2xl font-bold">
                {categoryCount.feedback}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Discussion</span>
              <span className="text-2xl font-bold">
                {categoryCount.discussion}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ステータス別集計 */}
      <Card>
        <CardHeader>
          <CardTitle>ステータス別投稿数</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">未確認</span>
              <span className="text-2xl font-bold text-gray-600">
                {statusCount.unconfirmed}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">対応中</span>
              <span className="text-2xl font-bold text-yellow-600">
                {statusCount.in_progress}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">完了</span>
              <span className="text-2xl font-bold text-green-600">
                {statusCount.completed}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 最近の投稿 */}
      <Card>
        <CardHeader>
          <CardTitle>最近の投稿（10件）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topics?.slice(0, 10).map((topic) => (
              <Link
                key={topic.id}
                href={`/topic/${topic.id}`}
                className="block p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {topic.profiles?.display_name ||
                        topic.profiles?.email ||
                        '匿名'}{' '}
                      •{' '}
                      {formatDistanceToNow(new Date(topic.created_at), {
                        addSuffix: true,
                        locale: ja,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CategoryBadge category={topic.category} />
                    <StatusBadge status={topic.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
