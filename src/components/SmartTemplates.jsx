import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLayers, FiBookOpen, FiTrendingUp, FiUsers, FiGraduationCap, FiTool } = FiIcons;

const SmartTemplates = ({ onSelectTemplate, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates = [
    {
      id: 'tutorial',
      name: 'チュートリアル・ハウツー',
      description: '手順解説やスキル習得に最適な構成',
      icon: FiTool,
      category: 'educational',
      structure: [
        '概要・目標設定',
        '必要な準備',
        '基本操作',
        '応用テクニック',
        'トラブルシューティング',
        'まとめ・次のステップ'
      ],
      targetLength: 12000,
      tone: 'casual',
      features: ['ステップバイステップ', '実践的', 'スクリーンショット推奨']
    },
    {
      id: 'business',
      name: 'ビジネス・マーケティング',
      description: '戦略や手法を体系的に解説',
      icon: FiTrendingUp,
      category: 'business',
      structure: [
        '現状分析',
        '課題の特定',
        '解決策の提案',
        '実装方法',
        '効果測定',
        '改善・最適化'
      ],
      targetLength: 15000,
      tone: 'formal',
      features: ['データ重視', '事例豊富', 'アクションプラン']
    },
    {
      id: 'academic',
      name: '学術・研究',
      description: '論文や研究内容を一般向けに',
      icon: FiGraduationCap,
      category: 'educational',
      structure: [
        '研究背景',
        '問題提起',
        '理論的枠組み',
        '研究方法',
        '結果と考察',
        '結論と今後の展望'
      ],
      targetLength: 20000,
      tone: 'academic',
      features: ['引用重視', '論理的構成', '専門用語解説']
    },
    {
      id: 'lifestyle',
      name: 'ライフスタイル・自己啓発',
      description: '読者の行動変容を促すストーリー',
      icon: FiUsers,
      category: 'lifestyle',
      structure: [
        '現状への問題提起',
        '理想の状態',
        '変化のステップ',
        '具体的な行動',
        '継続のコツ',
        '成功事例'
      ],
      targetLength: 10000,
      tone: 'narrative',
      features: ['共感重視', 'ストーリー性', '実践的アドバイス']
    },
    {
      id: 'technical',
      name: 'テクニカル・エンジニアリング',
      description: '技術解説や開発手法',
      icon: FiLayers,
      category: 'technical',
      structure: [
        '技術概要',
        '環境構築',
        '基本実装',
        '応用・カスタマイズ',
        'パフォーマンス最適化',
        'デプロイ・運用'
      ],
      targetLength: 18000,
      tone: 'formal',
      features: ['コード例', '図解豊富', 'ベストプラクティス']
    },
    {
      id: 'creative',
      name: 'クリエイティブ・アート',
      description: '創作活動や表現技法',
      icon: FiBookOpen,
      category: 'creative',
      structure: [
        'インスピレーション',
        '基本技法',
        '表現の幅を広げる',
        'スタイルの確立',
        '作品完成まで',
        '発表・フィードバック'
      ],
      targetLength: 8000,
      tone: 'casual',
      features: ['ビジュアル重視', '感性に訴える', 'プロセス重視']
    }
  ];

  const categories = [
    { id: 'all', name: '全て' },
    { id: 'educational', name: '教育・学習' },
    { id: 'business', name: 'ビジネス' },
    { id: 'technical', name: 'テクニカル' },
    { id: 'lifestyle', name: 'ライフスタイル' },
    { id: 'creative', name: 'クリエイティブ' }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleSelectTemplate = (template) => {
    onSelectTemplate(template);
    toast.success(`${template.name}テンプレートを適用しました`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">スマートテンプレート</h2>
              <p className="text-gray-600 mt-1">コンテンツタイプに最適化された構成を選択</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiIcons.FiX} className="text-xl" />
            </button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <SafeIcon icon={template.icon} className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">目標文字数</span>
                    <span className="font-medium">{template.targetLength.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">文体</span>
                    <span className="font-medium">
                      {template.tone === 'formal' ? 'フォーマル' :
                       template.tone === 'casual' ? 'カジュアル' :
                       template.tone === 'academic' ? '学術的' : '物語風'}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">章構成</p>
                    <div className="space-y-1">
                      {template.structure.slice(0, 3).map((chapter, index) => (
                        <div key={index} className="text-xs text-gray-500 flex items-center gap-2">
                          <span className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </span>
                          {chapter}
                        </div>
                      ))}
                      {template.structure.length > 3 && (
                        <div className="text-xs text-gray-400">
                          +{template.structure.length - 3} more chapters
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2">
                    {template.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SmartTemplates;