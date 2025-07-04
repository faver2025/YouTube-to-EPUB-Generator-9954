import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import VideoUrlInput from './VideoUrlInput';
import VideoSearch from './VideoSearch';
import VideoList from './VideoList';
import SmartTemplates from './SmartTemplates';

const { FiLink, FiSearch, FiPlay, FiSettings, FiLayers, FiZap } = FiIcons;

const InputScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('url');
  const [videos, setVideos] = useState([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [settings, setSettings] = useState({
    targetLength: 10000,
    language: 'ja',
    tone: 'formal',
    includeImages: true,
    aiEnhancement: true,
    template: null
  });

  const addVideo = (video) => {
    const exists = videos.find(v => v.id === video.id);
    if (exists) {
      toast.error('この動画は既に追加されています');
      return;
    }
    setVideos([...videos, video]);
    toast.success('動画を追加しました');
  };

  const removeVideo = (videoId) => {
    setVideos(videos.filter(v => v.id !== videoId));
  };

  const reorderVideos = (dragIndex, hoverIndex) => {
    const draggedVideo = videos[dragIndex];
    const newVideos = [...videos];
    newVideos.splice(dragIndex, 1);
    newVideos.splice(hoverIndex, 0, draggedVideo);
    setVideos(newVideos);
  };

  const handleTemplateSelect = (template) => {
    setSettings(prev => ({
      ...prev,
      template: template,
      targetLength: template.targetLength,
      tone: template.tone
    }));
    toast.success(`${template.name}テンプレートを適用しました`);
  };

  const generateProject = () => {
    if (videos.length === 0) {
      toast.error('最低1つの動画を追加してください');
      return;
    }
    if (!projectTitle.trim()) {
      toast.error('プロジェクトタイトルを入力してください');
      return;
    }

    const project = {
      id: Date.now().toString(),
      title: projectTitle,
      videos: videos,
      settings: settings,
      status: 'pending',
      createdAt: new Date().toISOString(),
      totalChars: 0,
      chapters: [],
      aiEnhanced: settings.aiEnhancement
    };

    // Save to localStorage
    const savedProjects = JSON.parse(localStorage.getItem('youtube-epub-projects') || '[]');
    savedProjects.push(project);
    localStorage.setItem('youtube-epub-projects', JSON.stringify(savedProjects));

    toast.success('プロジェクトを作成しました');
    navigate(`/generate/${project.id}`);
  };

  const tabs = [
    { id: 'url', label: 'URL入力', icon: FiLink },
    { id: 'search', label: '検索', icon: FiSearch },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            新規プロジェクト作成
          </h1>
          <p className="text-white text-opacity-80 text-lg">
            YouTube動画から高品質な電子書籍を生成します
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-effect p-6 mb-6"
            >
              <div className="mb-6">
                <label className="block text-white text-sm font-medium mb-2">
                  プロジェクトタイトル
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="例: AIと機械学習の基礎"
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:border-opacity-60"
                />
              </div>

              <div className="flex border-b border-white border-opacity-20 mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-white border-b-2 border-white'
                        : 'text-white text-opacity-60 hover:text-white hover:text-opacity-80'
                    }`}
                  >
                    <SafeIcon icon={tab.icon} className="text-lg" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'url' && (
                <VideoUrlInput onAddVideo={addVideo} />
              )}
              {activeTab === 'search' && (
                <VideoSearch onAddVideo={addVideo} />
              )}
            </motion.div>

            {/* Video List */}
            {videos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-effect p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  追加された動画 ({videos.length})
                </h3>
                <VideoList
                  videos={videos}
                  onRemove={removeVideo}
                  onReorder={reorderVideos}
                />
              </motion.div>
            )}
          </div>

          {/* Settings & Generate */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-effect p-6 mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <SafeIcon icon={FiSettings} className="text-lg text-white" />
                <h3 className="text-lg font-semibold text-white">AI設定</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    目標文字数
                  </label>
                  <select
                    value={settings.targetLength}
                    onChange={(e) => setSettings({...settings, targetLength: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:border-opacity-60"
                  >
                    <option value={5000}>5,000文字</option>
                    <option value={10000}>10,000文字</option>
                    <option value={15000}>15,000文字</option>
                    <option value={20000}>20,000文字</option>
                    <option value={30000}>30,000文字</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    文体
                  </label>
                  <select
                    value={settings.tone}
                    onChange={(e) => setSettings({...settings, tone: e.target.value})}
                    className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:border-opacity-60"
                  >
                    <option value="formal">フォーマル</option>
                    <option value="casual">カジュアル</option>
                    <option value="academic">学術的</option>
                    <option value="narrative">物語風</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={settings.includeImages}
                      onChange={(e) => setSettings({...settings, includeImages: e.target.checked})}
                      className="w-4 h-4 text-blue-600 bg-white bg-opacity-20 border-white border-opacity-30 rounded focus:ring-blue-500"
                    />
                    画像を含める
                  </label>
                  
                  <label className="flex items-center gap-2 text-white text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={settings.aiEnhancement}
                      onChange={(e) => setSettings({...settings, aiEnhancement: e.target.checked})}
                      className="w-4 h-4 text-blue-600 bg-white bg-opacity-20 border-white border-opacity-30 rounded focus:ring-blue-500"
                    />
                    AI強化機能
                  </label>
                </div>

                {settings.template && (
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <SafeIcon icon={FiLayers} className="text-white text-sm" />
                      <span className="text-white text-sm font-medium">適用テンプレート</span>
                    </div>
                    <p className="text-white text-opacity-80 text-sm">{settings.template.name}</p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <button
                onClick={() => setShowTemplates(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors backdrop-blur-sm border border-white border-opacity-20"
              >
                <SafeIcon icon={FiLayers} className="text-lg" />
                スマートテンプレート
              </button>

              <button
                onClick={generateProject}
                disabled={videos.length === 0 || !projectTitle.trim()}
                className="generate-btn disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <SafeIcon icon={settings.aiEnhancement ? FiZap : FiPlay} className="text-lg" />
                {settings.aiEnhancement ? 'AI強化で生成' : '電子書籍を生成'}
              </button>
            </motion.div>
          </div>
        </div>

        {/* Smart Templates Modal */}
        {showTemplates && (
          <SmartTemplates
            onSelectTemplate={handleTemplateSelect}
            onClose={() => setShowTemplates(false)}
          />
        )}
      </div>
    </div>
  );
};

export default InputScreen;