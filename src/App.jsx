import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Dashboard from './components/Dashboard';
import InputScreen from './components/InputScreen';
import GenerateScreen from './components/GenerateScreen';
import Editor from './components/Editor';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/input" element={<InputScreen />} />
            <Route path="/generate/:projectId" element={<GenerateScreen />} />
            <Route path="/editor/:projectId" element={<Editor />} />
          </Routes>
        </Layout>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              fontFamily: 'Noto Sans JP, sans-serif',
            },
          }}
        />
      </Router>
    </DndProvider>
  );
}

export default App;