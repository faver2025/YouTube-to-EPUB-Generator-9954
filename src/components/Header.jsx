import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiYoutube, FiBook, FiHome, FiSettings } = FiIcons;

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, label: 'ダッシュボード' },
    { path: '/input', icon: FiYoutube, label: '新規作成' },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <SafeIcon icon={FiYoutube} className="text-2xl text-red-500" />
              <span className="text-xl font-bold text-white">→</span>
              <SafeIcon icon={FiBook} className="text-2xl text-blue-500" />
            </div>
            <h1 className="text-xl font-bold text-white">
              YouTube→EPUB
            </h1>
          </Link>

          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  location.pathname === item.path
                    ? 'bg-white bg-opacity-20 text-white'
                    : 'text-white text-opacity-80 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <SafeIcon icon={item.icon} className="text-lg" />
                <span className="hidden md:block">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;