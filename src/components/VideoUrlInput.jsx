import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { aiService } from '../services/aiService';

const { FiPlus, FiLink } = FiIcons;

const VideoUrlInput = ({ onAddVideo }) => {
  const [urls, setUrls] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const extractVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleAddUrls = async () => {
    if (!urls.trim()) {
      toast.error('URLを入力してください');
      return;
    }

    setIsLoading(true);
    const urlList = urls.split('\n').filter(url => url.trim());
    const successfullyAdded = [];

    try {
      for (const url of urlList) {
        const videoId = extractVideoId(url.trim());
        if (!videoId) {
          toast.error(`無効なURL: ${url}`);
          continue;
        }

        // Use AI service to fetch video info
        const videoInfo = await aiService.fetchVideoInfo(videoId);
        onAddVideo(videoInfo);
        successfullyAdded.push(videoInfo.title);
      }

      if (successfullyAdded.length > 0) {
        setUrls('');
        toast.success(`${successfullyAdded.length}個の動画を追加しました`);
      }
    } catch (error) {
      toast.error('動画情報の取得に失敗しました');
      console.error('Error fetching video info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <SafeIcon icon={FiLink} className="text-lg text-white" />
        <h3 className="text-lg font-semibold text-white">YouTube URL</h3>
      </div>

      <div className="mb-4">
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="YouTube URLを入力してください（複数の場合は改行で区切る）&#10;例:&#10;https://www.youtube.com/watch?v=dQw4w9WgXcQ&#10;https://youtu.be/dQw4w9WgXcQ"
          className="w-full h-32 px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:border-opacity-60 resize-none"
        />
      </div>

      <button
        onClick={handleAddUrls}
        disabled={isLoading || !urls.trim()}
        className="w-full bg-white bg-opacity-20 text-white px-4 py-3 rounded-lg hover:bg-opacity-30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="loading-spinner" />
            処理中...
          </>
        ) : (
          <>
            <SafeIcon icon={FiPlus} className="text-lg" />
            動画を追加
          </>
        )}
      </button>
    </div>
  );
};

export default VideoUrlInput;