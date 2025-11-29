'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase'
import { ArrowUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface VoteButtonProps {
  topicId: string
  initialVoteCount: number
  initialHasVoted?: boolean
}

export function VoteButton({
  topicId,
  initialVoteCount,
  initialHasVoted = false,
}: VoteButtonProps) {
  const router = useRouter()
  const [voteCount, setVoteCount] = useState(initialVoteCount)
  const [hasVoted, setHasVoted] = useState(initialHasVoted)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    // ユーザー情報を取得
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [supabase])

  const handleVote = async () => {
    if (!user) {
      // ログインしていない場合はログイン画面へ
      router.push('/auth/signin')
      return
    }

    setLoading(true)

    try {
      if (hasVoted) {
        // 投票を取り消す
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('user_id', user.id)
          .eq('topic_id', topicId)

        if (error) throw error

        setHasVoted(false)
        setVoteCount((prev) => prev - 1)
      } else {
        // 投票する
        const { error } = await supabase
          .from('votes')
          .insert({ user_id: user.id, topic_id: topicId })

        if (error) throw error

        setHasVoted(true)
        setVoteCount((prev) => prev + 1)
      }

      router.refresh()
    } catch (error) {
      console.error('投票エラー:', error)
      toast.error('投票に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={hasVoted ? 'default' : 'outline'}
      size="sm"
      onClick={handleVote}
      disabled={loading}
      className="flex items-center gap-2"
    >
      <ArrowUp className="w-4 h-4" />
      <span>{voteCount}</span>
    </Button>
  )
}
