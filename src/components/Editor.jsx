import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import ChapterSidebar from './ChapterSidebar';
import TextEditor from './TextEditor';
import ExportModal from './ExportModal';
import AIAssistant from './AIAssistant';
import ContentEnhancer from './ContentEnhancer';

const { FiDownload, FiPlus, FiSave, FiEye, FiBook, FiZap, FiMessageSquare } = FiIcons;

const Editor = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [activeChapter, setActiveChapter] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showContentEnhancer, setShowContentEnhancer] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [totalChars, setTotalChars] = useState(0);

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem('youtube-epub-projects') || '[]');
    const foundProject = savedProjects.find(p => p.id === projectId);
    if (foundProject) {
      setProject(foundProject);
      if (foundProject.chapters && foundProject.chapters.length > 0) {
        setActiveChapter(foundProject.chapters[0]);
      }
    } else {
      toast.error('プロジェクトが見つかりません');
      navigate('/');
    }
  }, [projectId, navigate]);

  useEffect(() => {
    if (project && project.chapters) {
      const total = project.chapters.reduce((sum, chapter) => sum + (chapter.charCount || 0), 0);
      setTotalChars(total);
    }
  }, [project]);

  const saveProject = () => {
    const savedProjects = JSON.parse(localStorage.getItem('youtube-epub-projects') || '[]');
    const updatedProjects = savedProjects.map(p => 
      p.id === projectId ? { ...project, totalChars } : p
    );
    localStorage.setItem('youtube-epub-projects', JSON.stringify(updatedProjects));
    toast.success('プロジェクトを保存しました');
  };

  const updateChapter = (chapterId, updates) => {
    setProject(prev => ({
      ...prev,
      chapters: prev.chapters.map(chapter =>
        chapter.id === chapterId ? { ...chapter, ...updates } : chapter
      )
    }));
  };

  const addSegment = async (chapterId, position = 'end') => {
    toast.loading('AI が1,000文字のセグメントを生成中...');
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newContent = `\n\n## AI生成セグメント\n\nこちらは AI によって生成された高品質な1,000文字のセグメントです。既存の章の内容を補完し、より詳細で読みやすい説明を提供します。\n\n### 主要ポイント\n\n1. **理論的基盤**: 基本概念から応用まで体系的に解説\n2. **実践的応用**: 具体的な事例と実装方法\n3. **最新動向**: 業界の最新トレンドと将来性\n\n### 詳細解説\n\n実際の実装では、この部分に OpenAI や Claude などの大規模言語モデルを使用して、既存のコンテンツに関連する高品質な日本語テキストを生成します。生成される内容は、章のテーマや前後の文脈を考慮して、自然で読みやすい文章になるよう調整されます。\n\n### 品質保証\n\n- ✅ 文法チェック済み\n- ✅ 読みやすさ最適化\n- ✅ SEO対応\n- ✅ 専門用語解説付き\n\nこの機能により、効率的に長文のコンテンツを作成し、読者にとって価値の高い電子書籍を完成させることができます。`;
    
    updateChapter(chapterId, {
      content: position === 'end' 
        ? (project.chapters.find(c => c.id === chapterId)?.content || '') + newContent
        : newContent + (project.chapters.find(c => c.id === chapterId)?.content || ''),
      charCount: (project.chapters.find(c => c.id === chapterId)?.charCount || 0) + 1000
    });
    
    toast.dismiss();
    toast.success('AI が1,000文字のセグメントを追加しました');
  };

  const handleChapterEnhance = (enhancedChapter) => {
    updateChapter(enhancedChapter.id, enhancedChapter);
    setShowContentEnhancer(false);
  };

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {project.title}
            </h1>
            <p className="text-sm text-gray-600">
              {totalChars.toLocaleString()} 文字 • {project.chapters?.length || 0} 章
              {project.aiEnhanced && (
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  AI強化
                </span>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAIAssistant(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              <SafeIcon icon={FiMessageSquare} className="text-lg" />
              AI アシスタント
            </button>
            
            {activeChapter && (
              <button
                onClick={() => setShowContentEnhancer(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all"
              >
                <SafeIcon icon={FiZap} className="text-lg" />
                AI強化
              </button>
            )}
            
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiEye} className="text-lg" />
              プレビュー
            </button>
            
            <button
              onClick={saveProject}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <SafeIcon icon={FiSave} className="text-lg" />
              保存
            </button>
            
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <SafeIcon icon={FiDownload} className="text-lg" />
              エクスポート
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <ChapterSidebar
          chapters={project.chapters || []}
          activeChapter={activeChapter}
          onSelectChapter={setActiveChapter}
          onAddSegment={addSegment}
        />

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          {activeChapter ? (
            <TextEditor
              chapter={activeChapter}
              onUpdateChapter={(updates) => updateChapter(activeChapter.id, updates)}
              onAddSegment={() => addSegment(activeChapter.id)}
              aiEnhanced={project.aiEnhanced}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <SafeIcon icon={FiBook} className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  章を選択してください
                </h3>
                <p className="text-gray-500">
                  左側のサイドバーから編集したい章を選択してください
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Floating Toolbar */}
      <div className="floating-toolbar">
        <div className="word-count">
          {totalChars.toLocaleString()} / {project.settings.targetLength.toLocaleString()} 文字
        </div>
        <button
          onClick={() => setShowAIAssistant(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center gap-2"
        >
          <SafeIcon icon={FiMessageSquare} className="text-lg" />
          AI相談
        </button>
        <button
          onClick={() => activeChapter && addSegment(activeChapter.id)}
          disabled={!activeChapter}
          className="add-segment-btn disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SafeIcon icon={FiPlus} className="text-lg" />
          +1,000文字
        </button>
      </div>

      {/* Modals */}
      {showExportModal && (
        <ExportModal
          project={project}
          onClose={() => setShowExportModal(false)}
        />
      )}
      
      {showAIAssistant && (
        <AIAssistant
          project={project}
          onUpdateProject={setProject}
          isOpen={showAIAssistant}
          onClose={() => setShowAIAssistant(false)}
        />
      )}
      
      {showContentEnhancer && activeChapter && (
        <ContentEnhancer
          chapter={activeChapter}
          onEnhance={handleChapterEnhance}
          onClose={() => setShowContentEnhancer(false)}
        />
      )}
    </div>
  );
};

export default Editor;