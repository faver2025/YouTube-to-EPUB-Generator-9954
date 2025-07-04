# YouTube→EPUB Generator with AI

高品質な電子書籍を YouTube 動画から自動生成する AI 搭載アプリケーション

## 🚀 機能

### ✨ 主要機能
- **YouTube動画分析**: 動画の内容を AI が分析し、構造化された電子書籍を生成
- **AI コンテンツ生成**: Google Gemini API を使用した高品質な日本語コンテンツ
- **インタラクティブ編集**: リアルタイムでの章編集とプレビュー
- **AI アシスタント**: 電子書籍作成をサポートするチャット機能
- **スマートテンプレート**: 用途別に最適化された章構成テンプレート
- **マルチフォーマット出力**: EPUB, HTML, Markdown 対応

### 🎯 AI 機能
- **自動章立て**: 動画内容から最適な章構成を生成
- **コンテンツ強化**: 読みやすさ、具体例、構造の最適化
- **文体調整**: フォーマル、カジュアル、学術的、物語風の選択
- **SEO最適化**: 検索エンジン対応のキーワード組み込み

## 🛠️ 技術スタック

### フロントエンド
- **React 18** - UI ライブラリ
- **Vite** - 高速ビルドツール
- **Tailwind CSS** - スタイリング
- **Framer Motion** - アニメーション
- **React Router** - ルーティング

### AI & API
- **Google Gemini API** - AI コンテンツ生成
- **YouTube Data API** - 動画情報取得
- **Supabase** - バックエンドサービス（オプション）

### その他
- **React DnD** - ドラッグ&ドロップ
- **React Hot Toast** - 通知
- **React Icons** - アイコン

## 🔧 セットアップ

### 1. プロジェクトのクローン
```bash
git clone <repository-url>
cd youtube-epub-generator
npm install
```

### 2. 環境変数の設定
`.env.example` を `.env` にコピーして、必要な API キーを設定：

```bash
cp .env.example .env
```

### 3. API キーの取得

#### Google Gemini API
1. [Google AI Studio](https://aistudio.google.com/) にアクセス
2. 新しいプロジェクトを作成
3. API キーを生成
4. `.env` ファイルに `VITE_GEMINI_API_KEY` を設定

#### YouTube Data API
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成
3. YouTube Data API v3 を有効化
4. 認証情報で API キーを作成
5. `.env` ファイルに `VITE_YOUTUBE_API_KEY` を設定

#### Supabase（オプション）
1. [Supabase](https://supabase.com/) でプロジェクトを作成
2. プロジェクト URL と anon キーを取得
3. `.env` ファイルに設定

### 4. 開発サーバーの起動
```bash
npm run dev
```

## 📖 使用方法

### 1. 新規プロジェクト作成
- ダッシュボードから「新規プロジェクト」をクリック
- YouTube URL を入力または検索機能を使用
- AI 設定（文字数、文体など）を調整
- 「AI強化で生成」をクリック

### 2. AI 生成プロセス
- 動画情報の取得
- AI による内容分析
- 章構成の自動生成
- 高品質コンテンツの作成
- 読みやすさの最適化

### 3. 編集とカスタマイズ
- 生成された章を個別に編集
- AI アシスタントで改善提案を受ける
- コンテンツ強化機能で品質向上
- リアルタイムプレビューで確認

### 4. エクスポート
- EPUB: 電子書籍リーダー対応
- HTML: ウェブブラウザで閲覧
- Markdown: 編集者向け形式

## 🎨 カスタマイズ

### スマートテンプレート
6つの専用テンプレートを提供：
- **チュートリアル・ハウツー**: 手順解説向け
- **ビジネス・マーケティング**: 戦略解説向け
- **学術・研究**: 論文の一般向け変換
- **ライフスタイル**: 自己啓発向け
- **テクニカル**: 技術解説向け
- **クリエイティブ**: 創作活動向け

### AI 強化機能
- **読みやすさ向上**: 文章の最適化
- **具体例追加**: 理解を深める事例
- **構造最適化**: 見出しと段落の整理
- **エンゲージメント**: 読者の関心を引く要素
- **SEO最適化**: 検索エンジン対応
- **フォーマット強化**: 視覚的な改善

## 🔧 開発者向け

### ディレクトリ構造
```
src/
├── components/         # React コンポーネント
├── services/          # API サービス
├── lib/               # ライブラリ設定
├── common/            # 共通コンポーネント
└── App.jsx            # メインアプリケーション

supabase/
└── functions/         # Edge Functions
```

### 主要サービス
- `aiService.js`: AI 機能の統合管理
- `geminiService.js`: Google Gemini API
- `youtubeService.js`: YouTube Data API
- `supabase.js`: Supabase クライアント

### API エンドポイント
- `/generate-book-content`: 書籍コンテンツ生成
- `/enhance-chapter`: 章の改善
- `/ai-chat`: AI アシスタント
- `/generate-segment`: 追加コンテンツ生成

## 📊 パフォーマンス

### 最適化機能
- **遅延読み込み**: 大きなコンテンツの効率的な読み込み
- **キャッシュ**: API レスポンスのキャッシュ
- **バックグラウンド処理**: UI をブロックしない AI 処理
- **プログレッシブ生成**: 段階的なコンテンツ生成

### 制限事項
- YouTube API: 1日10,000リクエスト（無料枠）
- Gemini API: 1分間60リクエスト（無料枠）
- 動画の長さ: 最大2時間推奨

## 🤝 貢献

プルリクエストや Issue の報告を歓迎します。

## 📄 ライセンス

MIT License

## 🙏 謝辞

- Google Gemini API
- YouTube Data API
- Supabase
- React コミュニティ