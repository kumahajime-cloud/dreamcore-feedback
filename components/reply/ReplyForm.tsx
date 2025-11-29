'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface ReplyFormProps {
  topicId: string
}

export function ReplyForm({ topicId }: ReplyFormProps) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast.error('返信内容を入力してください')
      return
    }

    setLoading(true)

    try {
      // ユーザー情報を取得
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error('ログインが必要です')
        router.push('/auth/signin')
        return
      }

      // 返信を投稿
      const { error } = await supabase.from('replies').insert({
        topic_id: topicId,
        user_id: user.id,
        content: content.trim(),
      })

      if (error) throw error

      toast.success('返信しました！')
      setContent('')
      router.refresh()
    } catch (error) {
      console.error('返信エラー:', error)
      toast.error('返信に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="返信を入力してください"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? '送信中...' : '返信する'}
      </Button>
    </form>
  )
}
