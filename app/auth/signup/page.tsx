'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [signUpComplete, setSignUpComplete] = useState(false)
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || null,
          },
        },
      })

      if (error) throw error

      setSignUpComplete(true)
      toast.success('アカウントを作成しました！')
    } catch (error: any) {
      console.error('登録エラー:', error)
      toast.error(error.message || '登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // 登録完了画面
  if (signUpComplete) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>メールを確認してください</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium mb-2">
                ✓ 登録が完了しました！
              </p>
              <p className="text-green-700 text-sm">
                <strong>{email}</strong> 宛に確認メールを送信しました。
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                メールに記載されているリンクをクリックして、メールアドレスを確認してください。
              </p>
              <p className="text-sm text-muted-foreground">
                確認後、ログインできるようになります。
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/signin">ログイン画面へ</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">ホームに戻る</Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center pt-2">
              メールが届かない場合は、迷惑メールフォルダもご確認ください。
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 登録フォーム
  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>新規登録</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                メールアドレス
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium mb-2"
              >
                表示名（任意）
              </label>
              <Input
                id="displayName"
                type="text"
                placeholder="山田太郎"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                パスワード
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                6文字以上で入力してください
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '登録中...' : '登録する'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              すでにアカウントをお持ちの方は
              <Link
                href="/auth/signin"
                className="text-primary hover:underline ml-1"
              >
                ログイン
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
