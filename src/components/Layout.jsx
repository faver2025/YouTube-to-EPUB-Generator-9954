import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="app-container min-h-screen">
      <Header />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-16"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;