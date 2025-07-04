import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiDownload, FiBook, FiFileText, FiCode, FiCheck } = FiIcons;

const ExportModal = ({ project, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState('epub');
  const [isExporting, setIsExporting] = useState(false);

  const formats = [
    {
      id: 'epub',
      name: 'EPUB',
      description: 'Kindle、Apple Books、Google Play Books対応',
      icon: FiBook,
      fileSize: '約2.5MB'
    },
    {
      id: 'markdown',
      name: 'Markdown',
      description: '編集者向け、GitHub、Notion対応',
      icon: FiFileText,
      fileSize: '約150KB'
    },
    {
      id: 'html',
      name: 'HTML',
      description: 'ウェブブラウザで閲覧可能',
      icon: FiCode,
      fileSize: '約300KB'
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create mock file content
      let content = '';
      let mimeType = '';
      let filename = '';
      
      switch (selectedFormat) {
        case 'epub':
          content = createEPUBContent();
          mimeType = 'application/epub+zip';
          filename = `${project.title}.epub`;
          break;
        case 'markdown':
          content = createMarkdownContent();
          mimeType = 'text/markdown';
          filename = `${project.title}.md`;
          break;
        case 'html':
          content = createHTMLContent();
          mimeType = 'text/html';
          filename = `${project.title}.html`;
          break;
      }
      
      // Download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`${selectedFormat.toUpperCase()}ファイルをダウンロードしました`);
      onClose();
    } catch (error) {
      toast.error('エクスポートに失敗しました');
    } finally {
      setIsExporting(false);
    }
  };

  const createEPUBContent = () => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="uid">${project.id}</dc:identifier>
    <dc:title>${project.title}</dc:title>
    <dc:creator>YouTube→EPUB Generator</dc:creator>
    <dc:language>ja</dc:language>
    <dc:date>${new Date().toISOString().split('T')[0]}</dc:date>
    <meta property="dcterms:modified">${new Date().toISOString()}</meta>
  </metadata>
  
  <manifest>
    <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    ${project.chapters?.map((chapter, index) => 
      `<item id="chapter${index + 1}" href="chapter${index + 1}.xhtml" media-type="application/xhtml+xml"/>`
    ).join('\n    ')}
  </manifest>
  
  <spine>
    ${project.chapters?.map((chapter, index) => 
      `<itemref idref="chapter${index + 1}"/>`
    ).join('\n    ')}
  </spine>
</package>`;
  };

  const createMarkdownContent = () => {
    return `# ${project.title}

> YouTube動画から生成された電子書籍
> 
> 生成日: ${new Date().toLocaleDateString()}
> 文字数: ${project.totalChars?.toLocaleString() || 0}文字

## 目次

${project.chapters?.map((chapter, index) => 
  `${index + 1}. [${chapter.title}](#chapter-${index + 1})`
).join('\n')}

---

${project.chapters?.map((chapter, index) => `
## ${chapter.title} {#chapter-${index + 1}}

${chapter.content || 'この章の内容はまだ作成されていません。'}

---
`).join('\n')}

## 参考動画

${project.videos?.map(video => `
- [${video.title}](https://www.youtube.com/watch?v=${video.id})
  - チャンネル: ${video.channel}
  - 長さ: ${video.duration}
`).join('\n')}

---

*この電子書籍は YouTube→EPUB Generator で生成されました。*`;
  };

  const createHTMLContent = () => {
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.title}</title>
    <style>
        body {
            font-family: 'Noto Sans JP', sans-serif;
            line-height: 1.8;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            border-bottom: 2px solid #eee;
        }
        .chapter {
            margin-bottom: 3rem;
        }
        .chapter h2 {
            color: #2563eb;
            border-left: 4px solid #2563eb;
            padding-left: 1rem;
            margin-bottom: 1rem;
        }
        .toc {
            background: #f8fafc;
            padding: 2rem;
            border-radius: 8px;
            margin-bottom: 3rem;
        }
        .toc ul {
            list-style: none;
            padding: 0;
        }
        .toc li {
            margin-bottom: 0.5rem;
        }
        .toc a {
            color: #2563eb;
            text-decoration: none;
        }
        .toc a:hover {
            text-decoration: underline;
        }
        .footer {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${project.title}</h1>
        <p>YouTube動画から生成された電子書籍</p>
        <p>生成日: ${new Date().toLocaleDateString()} | 文字数: ${project.totalChars?.toLocaleString() || 0}文字</p>
    </div>

    <div class="toc">
        <h2>目次</h2>
        <ul>
            ${project.chapters?.map((chapter, index) => 
              `<li><a href="#chapter-${index + 1}">${index + 1}. ${chapter.title}</a></li>`
            ).join('')}
        </ul>
    </div>

    ${project.chapters?.map((chapter, index) => `
    <div class="chapter" id="chapter-${index + 1}">
        <h2>${chapter.title}</h2>
        <div>${(chapter.content || 'この章の内容はまだ作成されていません。').replace(/\n/g, '<br>')}</div>
    </div>
    `).join('')}

    <div class="footer">
        <p>この電子書籍は YouTube→EPUB Generator で生成されました。</p>
    </div>
</body>
</html>`;
  };

  return (
    <div className="export-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="export-content"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">エクスポート</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="text-lg" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">形式を選択</h3>
          <div className="space-y-3">
            {formats.map((format) => (
              <div
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`format-option ${selectedFormat === format.id ? 'selected' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <SafeIcon icon={format.icon} className="text-xl text-blue-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-800">{format.name}</h4>
                      {selectedFormat === format.id && (
                        <SafeIcon icon={FiCheck} className="text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{format.description}</p>
                    <p className="text-xs text-gray-500">{format.fileSize}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">プロジェクト情報</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">タイトル:</span>
                <p className="font-medium">{project.title}</p>
              </div>
              <div>
                <span className="text-gray-600">文字数:</span>
                <p className="font-medium">{project.totalChars?.toLocaleString() || 0}</p>
              </div>
              <div>
                <span className="text-gray-600">章数:</span>
                <p className="font-medium">{project.chapters?.length || 0}</p>
              </div>
              <div>
                <span className="text-gray-600">動画数:</span>
                <p className="font-medium">{project.videos?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="loading-spinner" />
                エクスポート中...
              </>
            ) : (
              <>
                <SafeIcon icon={FiDownload} className="text-lg" />
                ダウンロード
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ExportModal;