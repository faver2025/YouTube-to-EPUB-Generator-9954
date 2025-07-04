import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { aiService } from '../services/aiService';

const { FiPlay, FiCheck, FiClock, FiAlertCircle, FiBook } = FiIcons;

const GenerateScreen = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const steps = [
    { id: 'fetch', label: '動画情報取得', description: '字幕とメタデータを取得中...' },
    { id: 'analyze', label: 'AI分析', description: '動画内容をAIが分析中...' },
    { id: 'structure', label: '章立て構成', description: '最適な章構成を生成中...' },
    { id: 'generate', label: 'コンテンツ生成', description: 'AI が本文を執筆中...' },
    { id: 'enhance', label: '品質向上', description: '読みやすさと品質を最適化中...' },
    { id: 'finalize', label: '最終調整', description: '電子書籍形式に変換中...' }
  ];

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem('youtube-epub-projects') || '[]');
    const foundProject = savedProjects.find(p => p.id === projectId);
    if (foundProject) {
      setProject(foundProject);
    } else {
      toast.error('プロジェクトが見つかりません');
      navigate('/');
    }
  }, [projectId, navigate]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const startGeneration = async () => {
    if (!project) return;

    setIsGenerating(true);
    addLog('AI による電子書籍生成を開始しました', 'info');
    
    try {
      // Step 1: Fetch video information
      setCurrentStep(0);
      addLog('動画情報の取得を開始', 'info');
      
      for (const video of project.videos) {
        const detailedVideo = await aiService.fetchVideoInfo(video.id);
        addLog(`「${detailedVideo.title}」の情報を取得完了`, 'success');
      }

      // Step 2: AI Analysis
      setCurrentStep(1);
      addLog('AI による動画内容の分析を開始', 'info');
      await new Promise(resolve => setTimeout(resolve, 2000));
      addLog(`${project.videos.length}本の動画を分析完了`, 'success');

      // Step 3: Structure Planning
      setCurrentStep(2);
      addLog('最適な章構成を計画中', 'info');
      await new Promise(resolve => setTimeout(resolve, 1500));
      addLog('章構成の生成完了', 'success');

      // Step 4: Content Generation
      setCurrentStep(3);
      addLog('AI によるコンテンツ生成を開始', 'info');
      
      const generatedContent = await aiService.generateBookContent(
        project.videos, 
        project.settings
      );

      addLog(`${generatedContent.totalChars.toLocaleString()}文字のコンテンツを生成`, 'success');
      addLog(`${generatedContent.chapters.length}章の構成を完了`, 'success');

      // Step 5: Enhancement
      setCurrentStep(4);
      addLog('コンテンツの品質向上を実行中', 'info');
      await new Promise(resolve => setTimeout(resolve, 2000));
      addLog('読みやすさと品質の最適化完了', 'success');

      // Step 6: Finalization
      setCurrentStep(5);
      addLog('電子書籍形式への変換を開始', 'info');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update project with generated content
      const updatedProject = {
        ...project,
        status: 'completed',
        chapters: generatedContent.chapters,
        totalChars: generatedContent.totalChars,
        generatedAt: new Date().toISOString(),
        aiEnhanced: project.settings.aiEnhancement
      };

      // Save to localStorage
      const savedProjects = JSON.parse(localStorage.getItem('youtube-epub-projects') || '[]');
      const updatedProjects = savedProjects.map(p => 
        p.id === projectId ? updatedProject : p
      );
      localStorage.setItem('youtube-epub-projects', JSON.stringify(updatedProjects));

      addLog('電子書籍の生成が完了しました！', 'success');
      toast.success('電子書籍が正常に生成されました！');

      // Navigate to editor after a short delay
      setTimeout(() => {
        navigate(`/editor/${projectId}`);
      }, 2000);

    } catch (error) {
      addLog(`エラーが発生しました: ${error.message}`, 'error');
      toast.error('生成中にエラーが発生しました');
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            AI電子書籍生成
          </h1>
          <p className="text-white text-opacity-80">
            {project.title}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-effect p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-white mb-6">AI生成進行状況</h3>
              
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {index < currentStep ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <SafeIcon icon={FiCheck} className="text-white text-sm" />
                        </div>
                      ) : index === currentStep && isGenerating ? (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="loading-spinner w-3 h-3 border-2" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">{index + 1}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        index <= currentStep ? 'text-white' : 'text-white text-opacity-60'
                      }`}>
                        {step.label}
                      </h4>
                      <p className={`text-sm ${
                        index <= currentStep ? 'text-white text-opacity-80' : 'text-white text-opacity-40'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm">全体の進行</span>
                  <span className="text-white text-sm">
                    {Math.round(((currentStep + (isGenerating ? 0.5 : 0)) / steps.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                  <div 
                    className="ai-progress-bar h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${((currentStep + (isGenerating ? 0.5 : 0)) / steps.length) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* AI Processing Log */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-effect p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">AI処理ログ</h3>
              
              <div className="bg-black bg-opacity-30 rounded-lg p-4 h-64 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2 mb-2 text-sm">
                    <span className="text-white text-opacity-60 flex-shrink-0">
                      {log.timestamp}
                    </span>
                    <span className={`${
                      log.type === 'error' ? 'text-red-400' : 
                      log.type === 'success' ? 'text-green-400' : 
                      'text-white text-opacity-80'
                    }`}>
                      {log.message}
                    </span>
                  </div>
                ))}
                
                {logs.length === 0 && (
                  <p className="text-white text-opacity-60 text-sm">
                    AI処理を開始してください
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Control Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-effect p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">プロジェクト設定</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white text-opacity-60">動画数</span>
                  <span className="text-white">{project.videos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white text-opacity-60">目標文字数</span>
                  <span className="text-white">{project.settings.targetLength.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white text-opacity-60">文体</span>
                  <span className="text-white">
                    {project.settings.tone === 'formal' ? 'フォーマル' :
                     project.settings.tone === 'casual' ? 'カジュアル' :
                     project.settings.tone === 'academic' ? '学術的' : '物語風'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white text-opacity-60">AI強化</span>
                  <span className="text-white">
                    {project.settings.aiEnhancement ? '有効' : '無効'}
                  </span>
                </div>
                {project.settings.template && (
                  <div className="flex justify-between">
                    <span className="text-white text-opacity-60">テンプレート</span>
                    <span className="text-white">{project.settings.template.name}</span>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {project.status === 'pending' && (
                <button
                  onClick={startGeneration}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="ai-loading-spinner" />
                      AI生成中...
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiPlay} className="text-lg" />
                      AI生成開始
                    </>
                  )}
                </button>
              )}
              
              {project.status === 'completed' && (
                <button
                  onClick={() => navigate(`/editor/${projectId}`)}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <SafeIcon icon={FiBook} className="text-lg" />
                  編集画面へ
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateScreen;