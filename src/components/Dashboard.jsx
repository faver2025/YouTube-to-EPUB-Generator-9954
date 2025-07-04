import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiBook, FiClock, FiFileText, FiEdit3, FiTrash2, FiDownload, FiZap, FiTrendingUp, FiUsers, FiStar } = FiIcons;

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalWords: 0,
    completedBooks: 0,
    avgRating: 0
  });

  useEffect(() => {
    // Load projects from localStorage
    const savedProjects = localStorage.getItem('youtube-epub-projects');
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      setProjects(parsedProjects);
      
      // Calculate stats
      const totalWords = parsedProjects.reduce((sum, p) => sum + (p.totalChars || 0), 0);
      const completedBooks = parsedProjects.filter(p => p.status === 'completed').length;
      
      setStats({
        totalProjects: parsedProjects.length,
        totalWords,
        completedBooks,
        avgRating: 4.8 // Mock rating
      });
    }
  }, []);

  const deleteProject = (projectId) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem('youtube-epub-projects', JSON.stringify(updatedProjects));
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-badge status-pending',
      processing: 'status-badge status-processing',
      completed: 'status-badge status-completed',
      error: 'status-badge status-error'
    };

    return (
      <span className={statusClasses[status] || statusClasses.pending}>
        {status === 'pending' && '待機中'}
        {status === 'processing' && '処理中'}
        {status === 'completed' && '完了'}
        {status === 'error' && 'エラー'}
      </span>
    );
  };

  const StatCard = ({ icon, label, value, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-opacity-80 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <SafeIcon icon={icon} className="text-white text-xl" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            プロジェクト一覧
          </h1>
          <p className="text-white text-opacity-80 text-lg">
            YouTube動画から高品質な電子書籍を作成・管理
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FiBook}
            label="総プロジェクト数"
            value={stats.totalProjects}
            color="bg-blue-500"
          />
          <StatCard
            icon={FiFileText}
            label="総文字数"
            value={stats.totalWords.toLocaleString()}
            color="bg-green-500"
          />
          <StatCard
            icon={FiTrendingUp}
            label="完成書籍"
            value={stats.completedBooks}
            color="bg-purple-500"
          />
          <StatCard
            icon={FiStar}
            label="平均評価"
            value={stats.avgRating}
            color="bg-yellow-500"
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-4">
            <Link
              to="/input"
              className="flex items-center gap-2 px-6 py-3 bg-white bg-opacity-20 text-white rounded-xl hover:bg-opacity-30 transition-all backdrop-blur-sm border border-white border-opacity-20"
            >
              <SafeIcon icon={FiPlus} className="text-lg" />
              新規プロジェクト
            </Link>
            <button className="flex items-center gap-2 px-6 py-3 bg-white bg-opacity-20 text-white rounded-xl hover:bg-opacity-30 transition-all backdrop-blur-sm border border-white border-opacity-20">
              <SafeIcon icon={FiZap} className="text-lg" />
              AIアシスタント
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white bg-opacity-20 text-white rounded-xl hover:bg-opacity-30 transition-all backdrop-blur-sm border border-white border-opacity-20">
              <SafeIcon icon={FiUsers} className="text-lg" />
              コミュニティ
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Project Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/input" className="block">
              <div className="project-card border-2 border-dashed border-white border-opacity-30 hover:border-opacity-50 text-center min-h-[280px] flex flex-col items-center justify-center group">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 group-hover:bg-opacity-30 transition-all">
                  <SafeIcon icon={FiPlus} className="text-3xl text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  新規プロジェクト
                </h3>
                <p className="text-white text-opacity-60 text-sm">
                  YouTube動画から電子書籍を作成
                </p>
                <div className="mt-4 px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white text-sm">
                  AIアシスタント付き
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Existing Projects */}
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * (index + 2) }}
              className="project-card group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiBook} className="text-white text-lg" />
                  </div>
                  {getStatusBadge(project.status)}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {project.status === 'completed' && (
                    <Link
                      to={`/editor/${project.id}`}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiEdit3} className="text-lg" />
                    </Link>
                  )}
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="text-lg" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {project.title}
              </h3>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <SafeIcon icon={FiFileText} className="text-sm" />
                  <span>{project.totalChars?.toLocaleString() || 0} 文字</span>
                </div>
                <div className="flex items-center gap-1">
                  <SafeIcon icon={FiClock} className="text-sm" />
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span>動画数: {project.videos?.length || 0}</span>
                <span>•</span>
                <span>章数: {project.chapters?.length || 0}</span>
                {project.appliedEnhancements && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <SafeIcon icon={FiZap} className="text-xs text-yellow-500" />
                      AI強化済み
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {project.status === 'processing' && (
                  <Link
                    to={`/generate/${project.id}`}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    進行状況を見る
                  </Link>
                )}
                {project.status === 'completed' && (
                  <>
                    <Link
                      to={`/editor/${project.id}`}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                    >
                      編集
                    </Link>
                    <button className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <SafeIcon icon={FiDownload} className="text-lg" />
                    </button>
                  </>
                )}
                {project.status === 'pending' && (
                  <Link
                    to={`/generate/${project.id}`}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-center"
                  >
                    生成開始
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <SafeIcon icon={FiBook} className="text-4xl text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              まだプロジェクトがありません
            </h3>
            <p className="text-white text-opacity-60 mb-8 max-w-md mx-auto">
              YouTube動画から高品質な電子書籍を作成して始めましょう。AIアシスタントがサポートします。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/input"
                className="inline-flex items-center gap-2 bg-white bg-opacity-20 text-white px-6 py-3 rounded-xl hover:bg-opacity-30 transition-colors backdrop-blur-sm border border-white border-opacity-20"
              >
                <SafeIcon icon={FiPlus} className="text-lg" />
                新規プロジェクトを作成
              </Link>
              <button className="inline-flex items-center gap-2 bg-white bg-opacity-20 text-white px-6 py-3 rounded-xl hover:bg-opacity-30 transition-colors backdrop-blur-sm border border-white border-opacity-20">
                <SafeIcon icon={FiZap} className="text-lg" />
                AIアシスタントを試す
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;