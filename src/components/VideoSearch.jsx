import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { aiService } from '../services/aiService';

const { FiSearch, FiPlus } = FiIcons;

const VideoSearch = ({ onAddVideo }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchVideos = async () => {
    if (!query.trim()) {
      toast.error('検索キーワードを入力してください');
      return;
    }

    setIsLoading(true);
    try {
      // Mock search results - in real implementation, this would call YouTube API via Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResults = [
        {
          id: 'dQw4w9WgXcQ',
          title: `${query} - Introduction and Basics`,
          channel: 'Educational Channel',
          duration: '15:30',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
          description: `Learn the fundamentals of ${query}...`,
          publishedAt: new Date().toISOString(),
          views: '1.2M views'
        },
        {
          id: 'dQw4w9WgXcR',
          title: `Advanced ${query} Techniques`,
          channel: 'Pro Academy',
          duration: '22:45',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcR/maxresdefault.jpg',
          description: `Deep dive into advanced ${query} techniques...`,
          publishedAt: new Date().toISOString(),
          views: '850K views'
        },
        {
          id: 'dQw4w9WgXcS',
          title: `${query} Best Practices and Tips`,
          channel: 'Expert Guide',
          duration: '18:20',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcS/maxresdefault.jpg',
          description: `Best practices and professional tips for ${query}...`,
          publishedAt: new Date().toISOString(),
          views: '650K views'
        }
      ];

      setResults(mockResults);
      toast.success(`${mockResults.length}件の動画が見つかりました`);
    } catch (error) {
      toast.error('検索に失敗しました');
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVideo = async (video) => {
    try {
      // Fetch detailed video info using AI service
      const detailedVideo = await aiService.fetchVideoInfo(video.id);
      onAddVideo(detailedVideo);
      toast.success(`「${video.title}」を追加しました`);
    } catch (error) {
      toast.error('動画の追加に失敗しました');
      console.error('Error adding video:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchVideos();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <SafeIcon icon={FiSearch} className="text-lg text-white" />
        <h3 className="text-lg font-semibold text-white">YouTube検索</h3>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="検索キーワードを入力（例: AI, 機械学習, プログラミング）"
          className="flex-1 px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:border-opacity-60"
        />
        <button
          onClick={searchVideos}
          disabled={isLoading || !query.trim()}
          className="px-6 py-3 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <div className="loading-spinner" />
          ) : (
            <SafeIcon icon={FiSearch} className="text-lg" />
          )}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-white font-medium">検索結果 ({results.length}件)</h4>
          {results.map((video) => (
            <div key={video.id} className="flex gap-4 p-4 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-15 transition-colors">
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-32 h-20 object-cover rounded-lg"
                />
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              
              <div className="flex-1">
                <h5 className="text-white font-medium text-sm mb-1 line-clamp-2">
                  {video.title}
                </h5>
                <p className="text-white text-opacity-60 text-xs mb-2">
                  {video.channel} • {video.duration} • {video.views}
                </p>
                <p className="text-white text-opacity-60 text-xs line-clamp-2">
                  {video.description}
                </p>
              </div>
              
              <button
                onClick={() => handleAddVideo(video)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 self-start"
              >
                <SafeIcon icon={FiPlus} className="text-sm" />
                追加
              </button>
            </div>
          ))}
        </div>
      )}

      {query && results.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-white text-opacity-60">
            検索結果がありません。別のキーワードで試してください。
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoSearch;