'use client'

import { TopicCard } from '@/components/topic/TopicCard'
import { SearchBar } from '@/components/search/SearchBar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState, useMemo } from 'react'

interface Topic {
  id: string
  title: string
  content: string
  category: 'bug_report' | 'feature_request' | 'feedback' | 'discussion'
  status?: 'unconfirmed' | 'in_progress' | 'completed'
  vote_count: number
  created_at: string
  profiles: {
    display_name: string | null
    email: string
  } | null
}

interface TopicListProps {
  topics: Topic[]
  userVotes: string[]
}

export function TopicList({ topics, userVotes }: TopicListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // 検索フィルタリング
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics

    const query = searchQuery.toLowerCase()
    return topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(query) ||
        topic.content.toLowerCase().includes(query)
    )
  }, [topics, searchQuery])

  // カテゴリ別にフィルタリング
  const filterByCategory = (category?: string) => {
    if (!category || category === 'all') return filteredTopics
    return filteredTopics.filter((topic) => topic.category === category)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const categoryLabels: Record<string, string> = {
    all: 'すべて',
    bug_report: 'Bug Report',
    feature_request: 'Feature Request',
    feedback: 'Feedback',
    discussion: 'Discussion',
  }

  return (
    <div className="space-y-6">
      {/* 検索バー */}
      <SearchBar
        onSearch={handleSearch}
        placeholder="タイトルまたは本文で検索..."
      />

      {/* 検索結果の件数表示 */}
      {searchQuery && (
        <div className="text-sm text-muted-foreground">
          「{searchQuery}」の検索結果: {filteredTopics.length}件
        </div>
      )}

      {/* スマホ用: ドロップダウン */}
      <div className="md:hidden">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full">
            <SelectValue>
              {categoryLabels[selectedCategory]} (
              {filterByCategory(selectedCategory).length})
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              すべて ({filterByCategory('all').length})
            </SelectItem>
            <SelectItem value="bug_report">
              Bug Report ({filterByCategory('bug_report').length})
            </SelectItem>
            <SelectItem value="feature_request">
              Feature Request ({filterByCategory('feature_request').length})
            </SelectItem>
            <SelectItem value="feedback">
              Feedback ({filterByCategory('feedback').length})
            </SelectItem>
            <SelectItem value="discussion">
              Discussion ({filterByCategory('discussion').length})
            </SelectItem>
          </SelectContent>
        </Select>

        {/* スマホ用コンテンツ */}
        <div className="space-y-4 mt-6">
          {filterByCategory(selectedCategory).length > 0 ? (
            filterByCategory(selectedCategory).map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                hasVoted={userVotes.includes(topic.id)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery
                ? '検索結果が見つかりませんでした'
                : `${categoryLabels[selectedCategory]}がありません`}
            </div>
          )}
        </div>
      </div>

      {/* PC用: タブ */}
      <Tabs defaultValue="all" className="w-full hidden md:block">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            すべて ({filterByCategory('all').length})
          </TabsTrigger>
          <TabsTrigger value="bug_report">
            Bug Report ({filterByCategory('bug_report').length})
          </TabsTrigger>
          <TabsTrigger value="feature_request">
            Feature Request ({filterByCategory('feature_request').length})
          </TabsTrigger>
          <TabsTrigger value="feedback">
            Feedback ({filterByCategory('feedback').length})
          </TabsTrigger>
          <TabsTrigger value="discussion">
            Discussion ({filterByCategory('discussion').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {filterByCategory('all').length > 0 ? (
            filterByCategory('all').map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                hasVoted={userVotes.includes(topic.id)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery
                ? '検索結果が見つかりませんでした'
                : 'まだ投稿がありません'}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bug_report" className="space-y-4 mt-6">
          {filterByCategory('bug_report').length > 0 ? (
            filterByCategory('bug_report').map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                hasVoted={userVotes.includes(topic.id)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery
                ? '検索結果が見つかりませんでした'
                : 'Bug Reportがありません'}
            </div>
          )}
        </TabsContent>

        <TabsContent value="feature_request" className="space-y-4 mt-6">
          {filterByCategory('feature_request').length > 0 ? (
            filterByCategory('feature_request').map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                hasVoted={userVotes.includes(topic.id)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery
                ? '検索結果が見つかりませんでした'
                : 'Feature Requestがありません'}
            </div>
          )}
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4 mt-6">
          {filterByCategory('feedback').length > 0 ? (
            filterByCategory('feedback').map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                hasVoted={userVotes.includes(topic.id)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery
                ? '検索結果が見つかりませんでした'
                : 'Feedbackがありません'}
            </div>
          )}
        </TabsContent>

        <TabsContent value="discussion" className="space-y-4 mt-6">
          {filterByCategory('discussion').length > 0 ? (
            filterByCategory('discussion').map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                hasVoted={userVotes.includes(topic.id)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery
                ? '検索結果が見つかりませんでした'
                : 'Discussionがありません'}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
