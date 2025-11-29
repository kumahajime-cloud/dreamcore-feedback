import { createClient } from '@/lib/supabase-server'
import { TopicCard } from '@/components/topic/TopicCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function Home() {
  const supabase = await createClient()

  // ユーザー情報を取得
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 全トピックを取得
  const { data: topics } = await supabase
    .from('topics')
    .select('*, profiles(*)')
    .order('created_at', { ascending: false })

  // ユーザーの投票情報を取得
  let userVotes: string[] = []
  if (user) {
    const { data: votes } = await supabase
      .from('votes')
      .select('topic_id')
      .eq('user_id', user.id)
    userVotes = votes?.map((v) => v.topic_id) || []
  }

  // カテゴリ別にフィルタリング
  const filterByCategory = (category?: string) => {
    if (!category || category === 'all') return topics || []
    return topics?.filter((topic) => topic.category === category) || []
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">DreamCore Feedback</h1>
        <p className="text-muted-foreground mt-2">
          DreamCore への機能要望やバグ報告を共有しましょう
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="bug_report">Bug Report</TabsTrigger>
          <TabsTrigger value="feature_request">Feature Request</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {filterByCategory('all').map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              hasVoted={userVotes.includes(topic.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="bug_report" className="space-y-4 mt-6">
          {filterByCategory('bug_report').map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              hasVoted={userVotes.includes(topic.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="feature_request" className="space-y-4 mt-6">
          {filterByCategory('feature_request').map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              hasVoted={userVotes.includes(topic.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4 mt-6">
          {filterByCategory('feedback').map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              hasVoted={userVotes.includes(topic.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="discussion" className="space-y-4 mt-6">
          {filterByCategory('discussion').map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              hasVoted={userVotes.includes(topic.id)}
            />
          ))}
        </TabsContent>
      </Tabs>

      {(!topics || topics.length === 0) && (
        <div className="text-center py-12 text-muted-foreground">
          まだ投稿がありません。最初の投稿をしてみましょう！
        </div>
      )}
    </div>
  )
}
