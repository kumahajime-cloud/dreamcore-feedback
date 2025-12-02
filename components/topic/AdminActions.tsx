'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function AdminActions({ topicId }: { topicId: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClient()

  const handleDelete = async () => {
    if (
      !confirm(
        '管理者権限でこの投稿を削除しますか？この操作は取り消せません。'
      )
    ) {
      return
    }

    setIsDeleting(true)

    try {
      // 返信も一緒に削除
      const { error: repliesError } = await supabase
        .from('replies')
        .delete()
        .eq('topic_id', topicId)

      if (repliesError) throw repliesError

      // トピックを削除
      const { error } = await supabase.from('topics').delete().eq('id', topicId)

      if (error) throw error

      toast.success('投稿を削除しました')
      router.push('/')
      router.refresh()
    } catch (error: any) {
      console.error('削除エラー:', error)
      toast.error(error.message || '削除に失敗しました')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-sm text-red-800 font-medium mb-2">管理者操作</p>
      <Button
        variant="destructive"
        onClick={handleDelete}
        disabled={isDeleting}
        size="sm"
      >
        {isDeleting ? '削除中...' : '投稿を削除'}
      </Button>
    </div>
  )
}
