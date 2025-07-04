import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { aiService } from '../services/aiService';

const { FiZap, FiTarget, FiTrendingUp, FiUsers, FiEye, FiBookOpen, FiCheck } = FiIcons;

const ContentEnhancer = ({ chapter, onEnhance, onClose }) => {
  const [selectedEnhancements, setSelectedEnhancements] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const enhancements = [
    {
      id: 'readability',
      name: '読みやすさ向上',
      description: '文章を分かりやすく、読みやすい形に改善',
      icon: FiEye,
      category: 'writing',
      estimatedTime: '30秒',
      impact: 'high'
    },
    {
      id: 'examples',
      name: '具体例追加',
      description: '理解を深める実例や事例を追加',
      icon: FiTarget,
      category: 'content',
      estimatedTime: '45秒',
      impact: 'high'
    },
    {
      id: 'structure',
      name: '構造最適化',
      description: '見出しや段落構成を整理',
      icon: FiBookOpen,
      category: 'structure',
      estimatedTime: '20秒',
      impact: 'medium'
    },
    {
      id: 'engagement',
      name: '読者エンゲージメント',
      description: '読者の関心を引く要素を追加',
      icon: FiUsers,
      category: 'engagement',
      estimatedTime: '40秒',
      impact: 'high'
    },
    {
      id: 'seo',
      name: 'SEO最適化',
      description: 'キーワードや検索性を向上',
      icon: FiTrendingUp,
      category: 'optimization',
      estimatedTime: '25秒',
      impact: 'medium'
    },
    {
      id: 'formatting',
      name: 'フォーマット強化',
      description: 'リスト、強調、引用を適切に配置',
      icon: FiZap,
      category: 'formatting',
      estimatedTime: '15秒',
      impact: 'medium'
    }
  ];

  const toggleEnhancement = (enhancementId) => {
    setSelectedEnhancements(prev =>
      prev.includes(enhancementId)
        ? prev.filter(id => id !== enhancementId)
        : [...prev, enhancementId]
    );
  };

  const handleEnhance = async () => {
    if (selectedEnhancements.length === 0) {
      toast.error('少なくとも1つの改善項目を選択してください');
      return;
    }

    setIsProcessing(true);
    
    try {
      const totalTime = selectedEnhancements.reduce((sum, id) => {
        const enhancement = enhancements.find(e => e.id === id);
        return sum + parseInt(enhancement.estimatedTime);
      }, 0);

      toast.loading(`AI が章を改善中... (約${totalTime}秒)`, { id: 'enhance-toast' });

      // Use AI service for real enhancement
      const enhancedChapter = await aiService.enhanceChapter(chapter, selectedEnhancements);
      
      onEnhance(enhancedChapter);
      toast.success('章の改善が完了しました！', { id: 'enhance-toast' });
      onClose();

    } catch (error) {
      console.error('Enhancement error:', error);
      toast.error('改善中にエラーが発生しました', { id: 'enhance-toast' });
    } finally {
      setIsProcessing(false);
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">AI コンテンツ改善</h2>
              <p className="text-gray-600 mt-1">AIが章の内容を分析し、最適化します</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiIcons.FiX} className="text-xl" />
            </button>
          </div>

          {/* Chapter Info */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">{chapter.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>現在の文字数: {chapter.content?.length || 0}</span>
              <span>•</span>
              <span>推定読了時間: {Math.ceil((chapter.content?.length || 0) / 400)}分</span>
            </div>
          </div>
        </div>

        {/* Enhancement Options */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enhancements.map((enhancement) => (
              <motion.div
                key={enhancement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedEnhancements.includes(enhancement.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleEnhancement(enhancement.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedEnhancements.includes(enhancement.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedEnhancements.includes(enhancement.id) ? (
                      <SafeIcon icon={FiCheck} className="text-lg" />
                    ) : (
                      <SafeIcon icon={enhancement.icon} className="text-lg" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {enhancement.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {enhancement.description}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(enhancement.impact)}`}>
                        {enhancement.impact === 'high' ? '高効果' : 
                         enhancement.impact === 'medium' ? '中効果' : '低効果'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {enhancement.estimatedTime}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedEnhancements.length > 0 && (
                <span>
                  {selectedEnhancements.length}個の改善を適用 • 
                  推定時間: {selectedEnhancements.reduce((sum, id) => {
                    const enhancement = enhancements.find(e => e.id === id);
                    return sum + parseInt(enhancement.estimatedTime);
                  }, 0)}秒
                </span>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleEnhance}
                disabled={selectedEnhancements.length === 0 || isProcessing}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="ai-loading-spinner w-4 h-4" />
                    AI改善中...
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiZap} className="text-lg" />
                    AI改善実行
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContentEnhancer;