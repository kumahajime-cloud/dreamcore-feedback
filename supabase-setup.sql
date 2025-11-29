-- ============================================
-- Feedback Forum データベースセットアップ
-- ============================================

-- 1. profiles テーブル作成
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. topics テーブル作成
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('bug_report', 'feature_request', 'feedback', 'discussion')),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vote_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. replies テーブル作成
CREATE TABLE IF NOT EXISTS replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. votes テーブル作成（最重要）
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)  -- 1ユーザー1票のみ
);

-- ============================================
-- インデックス作成（パフォーマンス最適化）
-- ============================================

CREATE INDEX IF NOT EXISTS idx_topics_created_at ON topics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_topics_category ON topics(category);
CREATE INDEX IF NOT EXISTS idx_topics_vote_count ON topics(vote_count DESC);
CREATE INDEX IF NOT EXISTS idx_replies_topic_id ON replies(topic_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_topic_id ON votes(topic_id);

-- ============================================
-- RLS (Row Level Security) ポリシー設定
-- ============================================

-- RLSを有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- profiles ポリシー
CREATE POLICY "誰でもプロフィールを閲覧可能" ON profiles FOR SELECT USING (true);
CREATE POLICY "ユーザーは自分のプロフィールのみ更新可能" ON profiles FOR UPDATE USING (auth.uid() = id);

-- topics ポリシー
CREATE POLICY "誰でもトピックを閲覧可能" ON topics FOR SELECT USING (true);
CREATE POLICY "認証済みユーザーのみトピックを投稿可能" ON topics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "投稿者本人のみトピックを更新可能" ON topics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "投稿者本人のみトピックを削除可能" ON topics FOR DELETE USING (auth.uid() = user_id);

-- replies ポリシー
CREATE POLICY "誰でも返信を閲覧可能" ON replies FOR SELECT USING (true);
CREATE POLICY "認証済みユーザーのみ返信を投稿可能" ON replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "返信者本人のみ返信を更新可能" ON replies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "返信者本人のみ返信を削除可能" ON replies FOR DELETE USING (auth.uid() = user_id);

-- votes ポリシー（最重要）
CREATE POLICY "誰でも投票を閲覧可能" ON votes FOR SELECT USING (true);
CREATE POLICY "認証済みユーザーのみ投票可能" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "投票者本人のみ投票を取り消し可能" ON votes FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- トリガー設定（自動処理）
-- ============================================

-- 新規ユーザー登録時に自動的にprofilesテーブルにレコードを作成
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'display_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガーを作成（既存の場合は削除してから作成）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 投票時にtopicsのvote_countを自動更新
CREATE OR REPLACE FUNCTION public.update_topic_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE topics SET vote_count = vote_count + 1 WHERE id = NEW.topic_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE topics SET vote_count = vote_count - 1 WHERE id = OLD.topic_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガーを作成
DROP TRIGGER IF EXISTS on_vote_change ON votes;
CREATE TRIGGER on_vote_change
  AFTER INSERT OR DELETE ON votes
  FOR EACH ROW EXECUTE FUNCTION public.update_topic_vote_count();

-- updated_at を自動更新する関数
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- topics の updated_at を自動更新
DROP TRIGGER IF EXISTS on_topic_updated ON topics;
CREATE TRIGGER on_topic_updated
  BEFORE UPDATE ON topics
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- セットアップ完了
-- ============================================
-- 上記のSQLをSupabase SQL Editorで実行してください
