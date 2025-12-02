'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

const ADMIN_EMAILS = ['rimbaud18911110@gmail.com', 'riku2004@gmail.com']

export function Header() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email)

  useEffect(() => {
    // 現在のユーザーを取得
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        {/* PC版: 横並び */}
        <div className="hidden md:flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            DreamCore Feedback
          </Link>

          <div className="flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    {isAdmin && (
                      <Button variant="outline" asChild>
                        <Link href="/admin">管理画面</Link>
                      </Button>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {user.email}
                    </span>
                    <Button variant="outline" onClick={handleSignOut}>
                      ログアウト
                    </Button>
                    <Button asChild>
                      <Link href="/new">新規投稿</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/auth/signin">ログイン</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/new">新規投稿</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* スマホ版: 縦並び */}
        <div className="md:hidden space-y-3">
          <Link href="/" className="text-xl font-bold block">
            DreamCore Feedback
          </Link>

          {!loading && (
            <>
              {user ? (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </div>
                  {isAdmin && (
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/admin">管理画面</Link>
                    </Button>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleSignOut}
                      className="flex-1"
                    >
                      ログアウト
                    </Button>
                    <Button asChild className="flex-1">
                      <Link href="/new">新規投稿</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/auth/signin">ログイン</Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="/new">新規投稿</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
