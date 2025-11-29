# Feedback Forum

ユーザーが「新機能の要望」や「バグ報告」を投稿し、投票・コメントできるシンプルなフィードバックサイト

## 🎯 主要機能

- ✅ **投票機能**（最重要）- 1ユーザー1投稿につき1票、取り消し・再投票可能
- ✅ **カテゴリ機能** - Bug Report / Feature Request / Feedback / Discussion
- ✅ **トピック投稿・一覧表示**
- ✅ **返信機能**
- ✅ **Email認証**

## 🛠️ 技術スタック

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (Radix UI)
- **Supabase** (データベース + 認証)
- **date-fns** (日付フォーマット)
- **Zod** (バリデーション)
- **React Hook Form** (フォーム管理)

## 📦 セットアップ

### 1. 依存関係をインストール

```bash
npm install
```

### 2. Supabaseを設定

詳細は [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) を参照してください。

簡易手順:
1. https://supabase.com でプロジェクトを作成
2. `supabase-setup.sql` をSQL Editorで実行
3. Email認証を有効化
4. APIキーを取得
5. `.env.local` を作成して環境変数を設定

```bash
# .env.local.example をコピー
cp .env.local.example .env.local

# .env.local を編集してSupabaseのAPIキーを設定
```

### 3. 開発サーバーを起動

```bash
npm run dev
```

http://localhost:3000 にアクセス

## 📂 プロジェクト構造

```
feedback-forum/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # トップページ（一覧 + カテゴリフィルタ）
│   ├── new/                 # 新規投稿ページ
│   ├── topic/[id]/          # トピック詳細ページ
│   └── auth/                # 認証関連
├── components/
│   ├── ui/                  # shadcn/ui コンポーネント
│   ├── layout/
│   │   └── Header.tsx       # ヘッダー
│   ├── topic/
│   │   ├── TopicCard.tsx    # トピックカード
│   │   ├── CategoryBadge.tsx # カテゴリバッジ
│   │   └── VoteButton.tsx   # 投票ボタン（最重要）
│   └── reply/               # 返信関連コンポーネント
└── lib/
    ├── supabase.ts          # Supabaseクライアント（Client）
    ├── supabase-server.ts   # Supabaseクライアント（Server）
    └── database.types.ts    # データベース型定義
```

## 🗄️ データベース構造

### テーブル

- **profiles** - ユーザープロフィール
- **topics** - 投稿/トピック
- **replies** - 返信
- **votes** - 投票（最重要）

詳細は [SUPABASE_SETUP.md](./SUPABASE_SETUP.md#-データベース構造) を参照

## 🎨 カラースキーム

- **Bug Report**: 赤系 (#EF4444)
- **Feature Request**: 青系 (#3B82F6)
- **Feedback**: 緑系 (#10B981)
- **Discussion**: 紫系 (#8B5CF6)

## 🚀 デプロイ

### Vercelにデプロイ

1. GitHubリポジトリにプッシュ
2. Vercelダッシュボードで「New Project」
3. リポジトリを選択
4. 環境変数を設定:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. 「Deploy」をクリック

## 📝 開発の進め方

### 実装優先順位

1. ✅ プロジェクトセットアップ
2. 🔄 Supabase接続設定（現在）
3. ⏳ Email認証機能
4. ⏳ 投票機能（最優先）
5. ⏳ トピック投稿機能
6. ⏳ トピック詳細表示
7. ⏳ 返信機能
8. ⏳ Vercelデプロイ

## 🐛 トラブルシューティング

### 開発サーバーが起動しない
```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### Supabaseに接続できない
- `.env.local` が正しく設定されているか確認
- 開発サーバーを再起動

### 投票ボタンが動かない
- Supabaseでテーブルが正しく作成されているか確認
- RLSポリシーが有効になっているか確認

## 📄 ライセンス

MIT
