import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBook, FiPlus, FiFileText } = FiIcons;

const ChapterSidebar = ({ chapters, activeChapter, onSelectChapter, onAddSegment }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col"
    >
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">章構成</h2>
        
        <div className="space-y-2">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => onSelectChapter(chapter)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                activeChapter?.id === chapter.id
                  ? 'bg-blue-100 border-blue-300 text-blue-800'
                  : 'bg-white hover:bg-gray-100 border-gray-200 text-gray-700'
              } border`}
            >
              <div className="flex items-start gap-3">
                <SafeIcon icon={FiBook} className="text-lg mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-sm mb-1">
                    {chapter.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs opacity-75">
                    <SafeIcon icon={FiFileText} className="text-xs" />
                    <span>{chapter.charCount?.toLocaleString() || 0} 文字</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">クイックアクション</h3>
        <button
          onClick={() => activeChapter && onAddSegment(activeChapter.id)}
          disabled={!activeChapter}
          className="w-full flex items-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SafeIcon icon={FiPlus} className="text-lg" />
          現在の章に1,000文字追加
        </button>
      </div>
    </motion.div>
  );
};

export default ChapterSidebar;