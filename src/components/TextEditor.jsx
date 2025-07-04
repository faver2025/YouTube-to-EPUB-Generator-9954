import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { aiService } from '../services/aiService';

const { FiType, FiAlignLeft, FiPlus, FiZap, FiTrendingUp, FiEye } = FiIcons;

const TextEditor = ({ chapter, onUpdateChapter, onAddSegment, aiEnhanced }) => {
  const [content, setContent] = useState(chapter.content || '');
  const [title, setTitle] = useState(chapter.title || '');
  const [wordCount, setWordCount] = useState(0);
  const [readabilityScore, setReadabilityScore] = useState(0);
  const [isGeneratingSegment, setIsGeneratingSegment] = useState(false);

  useEffect(() => {
    setContent(chapter.content || '');
    setTitle(chapter.title || '');
  }, [chapter]);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    
    // Simple readability score calculation
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 0;
    const score = Math.max(0, Math.min(100, 100 - avgWordsPerSentence * 2));
    setReadabilityScore(Math.round(score));
  }, [content]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Auto-save after 1 second of no typing
    clearTimeout(window.autoSaveTimeout);
    window.autoSaveTimeout = setTimeout(() => {
      onUpdateChapter({
        content: newContent,
        charCount: newContent.length
      });
    }, 1000);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    clearTimeout(window.titleSaveTimeout);
    window.titleSaveTimeout = setTimeout(() => {
      onUpdateChapter({ title: newTitle });
    }, 1000);
  };

  const handleAddAISegment = async () => {
    setIsGeneratingSegment(true);
    toast.loading('AI が関連コンテンツを生成中...', { id: 'segment-generation' });

    try {
      const segmentData = await aiService.generateSegment(title, content, 1000);
      
      const newContent = content + segmentData.content;
      setContent(newContent);
      
      onUpdateChapter({
        content: newContent,
        charCount: newContent.length,
        lastModified: new Date().toISOString()
      });

      toast.success('AI が1,000文字のセグメントを追加しました！', { id: 'segment-generation' });
    } catch (error) {
      console.error('Segment generation error:', error);
      toast.error('セグメント生成に失敗しました', { id: 'segment-generation' });
    } finally {
      setIsGeneratingSegment(false);
    }
  };

  const sampleContent = `この章では、${title}について詳しく説明します。

## 概要

YouTube動画から抽出された情報を基に、包括的で読みやすい内容を提供します。この電子書籍は、複数の動画から得られた知識を体系的に整理し、読者にとって価値のある学習リソースとなることを目指しています。

## 主要なポイント

### 1. 基本概念の理解
- **重要な用語と定義**: 専門用語を分かりやすく解説
- **基礎的な原理**: 理論的背景と実践的応用
- **実用的な事例**: 具体的な使用例とベストプラクティス

### 2. 詳細な分析
動画で説明された内容をより深く掘り下げ、関連する背景情報や専門家の見解を交えて解説します。

### 3. 実践的な応用
- ステップバイステップの手順
- よくある質問と回答
- トラブルシューティング

## まとめ

この章の内容は、元の動画から抽出された字幕や音声データを基に、AIによって生成・編集されています。読者の理解を深めるために、図表や具体例を適宜追加し、より包括的な学習体験を提供しています。

💡 **次のステップ**: 学習した内容を実践で活用してみましょう。`;

  const getReadabilityColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chapter Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <SafeIcon icon={FiType} className="text-xl text-blue-600" />
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="flex-1 text-xl font-bold text-gray-800 border-none outline-none bg-transparent"
            placeholder="章のタイトルを入力..."
          />
          {aiEnhanced && (
            <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-full">
              AI強化
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <SafeIcon icon={FiAlignLeft} className="text-sm" />
            <span>文字数: {content.length.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <SafeIcon icon={FiTrendingUp} className="text-sm" />
            <span>単語数: {wordCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <SafeIcon icon={FiEye} className={`text-sm ${getReadabilityColor(readabilityScore)}`} />
            <span className={getReadabilityColor(readabilityScore)}>
              読みやすさ: {readabilityScore}%
            </span>
          </div>
          <span>推定読了時間: {Math.ceil(content.length / 400)}分</span>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-6 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 h-full"
        >
          <div className="p-6 h-full">
            <textarea
              value={content || sampleContent}
              onChange={handleContentChange}
              placeholder="章の内容を入力または編集してください..."
              className="w-full h-full resize-none border-none outline-none text-gray-800 leading-relaxed text-base"
              style={{ fontFamily: 'Noto Sans JP, sans-serif', lineHeight: '1.8' }}
            />
          </div>
        </motion.div>
      </div>

      {/* Editor Actions */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <SafeIcon icon={FiAlignLeft} className="text-lg" />
              <span>自動保存中...</span>
            </div>
            {aiEnhanced && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <SafeIcon icon={FiZap} className="text-lg" />
                <span>AI最適化済み</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddAISegment}
              disabled={isGeneratingSegment}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingSegment ? (
                <>
                  <div className="ai-loading-spinner w-4 h-4" />
                  AI生成中...
                </>
              ) : (
                <>
                  <SafeIcon icon={aiEnhanced ? FiZap : FiPlus} className="text-lg" />
                  {aiEnhanced ? 'AI生成 +1,000文字' : '1,000文字追加'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;