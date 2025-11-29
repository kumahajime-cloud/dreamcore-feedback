# Supabase セットアップガイド

## 📋 手順

### 1. Supabaseプロジェクトを作成

1. https://supabase.com にアクセス
2. 「New Project」をクリック
3. 以下を設定：
   - **Project name**: `feedback-forum` (任意)
   - **Database Password**: 強力なパスワードを設定（保存しておく）
   - **Region**: `Northeast Asia (Tokyo)`
4. 「Create new project」をクリック
5. プロジェクトの作成完了を待つ（数分かかります）

---

### 2. データベーステーブルを作成

1. Supabaseダッシュボードの左メニューから **「SQL Editor」** を選択
2. 「New query」をクリック
3. プロジェクトルートの `supabase-setup.sql` の内容をコピー
4. SQL Editorに貼り付け
5. 「Run」ボタンをクリックして実行
6. ✅ 「Success. No rows returned」と表示されればOK

---

### 3. Email認証を設定

1. Supabaseダッシュボードの左メニューから **「Authentication」** → **「Providers」** を選択
2. **「Email」** プロバイダーを探す
3. 以下を設定：
   - **Enable Email provider**: ON（有効化）
   - **Confirm email**: OFF（開発中は無効推奨、本番ではON）
4. 「Save」をクリック

#### 📧 メール確認を無効にする理由（開発中）
- 開発中はメール確認を待つ時間を省略できる
- 本番環境では必ずONにしてセキュリティを強化

---

### 4. APIキーを取得

1. Supabaseダッシュボードの左メニューから **「Project Settings」** → **「API」** を選択
2. 以下の2つの値をコピー：
   - **Project URL** (例: `https://xxxxx.supabase.co`)
   - **anon public** キー (例: `eyJhbG...`)

---

### 5. 環境変数を設定

プロジェクトルートに `.env.local` ファイルを作成し、以下を記載：

```env
NEXT_PUBLIC_SUPABASE_URL=取得したProject URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=取得したanon publicキー
```

**例:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 6. 動作確認

#### テーブルが正しく作成されたか確認

1. Supabaseダッシュボードの **「Table Editor」** を選択
2. 以下の4つのテーブルが表示されればOK：
   - ✅ `profiles`
   - ✅ `topics`
   - ✅ `replies`
   - ✅ `votes`

#### RLSポリシーが設定されたか確認

1. 各テーブルをクリック
2. 右上の「RLS disabled」が表示されていないことを確認（緑色の「RLS enabled」になっているはず）

---

### 7. テストユーザーを作成（任意）

開発中のテスト用にユーザーを作成：

1. Supabaseダッシュボードの **「Authentication」** → **「Users」** を選択
2. 「Add user」をクリック
3. **「Create new user」** を選択
4. 以下を入力：
   - **Email**: `test@example.com` (任意)
   - **Password**: `test1234` (任意)
   - **Auto Confirm User**: ON（メール確認をスキップ）
5. 「Create user」をクリック

---

## ✅ セットアップ完了チェックリスト

- [ ] Supabaseプロジェクトを作成した
- [ ] `supabase-setup.sql` を実行してテーブルを作成した
- [ ] Email認証プロバイダーを有効化した
- [ ] APIキー（URL + anon key）を取得した
- [ ] `.env.local` ファイルを作成して環境変数を設定した
- [ ] テーブルが正しく作成されたか確認した
- [ ] RLSポリシーが有効になっているか確認した

---

## 🎯 次のステップ

セットアップが完了したら、以下を確認してください：

```bash
# 開発サーバーを起動
npm run dev
```

http://localhost:3000 にアクセスして、エラーが出ないか確認してください。

---

## 🔧 トラブルシューティング

### エラー: "Invalid API key"
→ `.env.local` のAPIキーが正しいか確認してください

### エラー: "relation does not exist"
→ `supabase-setup.sql` が正しく実行されたか確認してください

### 投票ボタンが動かない
→ RLSポリシーが正しく設定されているか確認してください

---

## 📚 データベース構造

### テーブル構成

```
profiles (ユーザープロフィール)
├── id (UUID) - PRIMARY KEY
├── email (TEXT) - UNIQUE
├── display_name (TEXT)
└── created_at (TIMESTAMPTZ)

topics (投稿/トピック)
├── id (UUID) - PRIMARY KEY
├── title (TEXT) - NOT NULL
├── content (TEXT) - NOT NULL
├── category (TEXT) - NOT NULL
├── user_id (UUID) - FOREIGN KEY → profiles
├── vote_count (INTEGER) - 投票数
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)

replies (返信)
├── id (UUID) - PRIMARY KEY
├── topic_id (UUID) - FOREIGN KEY → topics
├── user_id (UUID) - FOREIGN KEY → profiles
├── content (TEXT) - NOT NULL
└── created_at (TIMESTAMPTZ)

votes (投票) ⭐最重要
├── id (UUID) - PRIMARY KEY
├── user_id (UUID) - FOREIGN KEY → profiles
├── topic_id (UUID) - FOREIGN KEY → topics
├── created_at (TIMESTAMPTZ)
└── UNIQUE(user_id, topic_id) - 1ユーザー1票のみ
```

### トリガー（自動処理）

1. **新規ユーザー登録時**: `profiles` テーブルに自動的にレコード作成
2. **投票時**: `topics.vote_count` を自動更新（+1）
3. **投票取り消し時**: `topics.vote_count` を自動更新（-1）
4. **トピック更新時**: `topics.updated_at` を自動更新
