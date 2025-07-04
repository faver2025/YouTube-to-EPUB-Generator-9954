// YouTube Data API Service
class YouTubeService {
  constructor() {
    this.apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
  }

  async getVideoInfo(videoId) {
    if (!this.apiKey) {
      console.warn('YouTube API key not configured, using mock data');
      return this.mockVideoInfo(videoId);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        throw new Error('Video not found');
      }

      const video = data.items[0];
      
      return {
        id: videoId,
        title: video.snippet.title,
        channel: video.snippet.channelTitle,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        duration: this.formatDuration(video.contentDetails.duration),
        thumbnail: video.snippet.thumbnails.maxres?.url || 
                  video.snippet.thumbnails.high?.url ||
                  video.snippet.thumbnails.medium?.url,
        views: parseInt(video.statistics.viewCount),
        likes: parseInt(video.statistics.likeCount || 0),
        transcript: null // 字幕は別途取得が必要
      };
    } catch (error) {
      console.error('YouTube API error:', error);
      return this.mockVideoInfo(videoId);
    }
  }

  async searchVideos(query, maxResults = 10) {
    if (!this.apiKey) {
      console.warn('YouTube API key not configured, using mock data');
      return this.mockSearchResults(query, maxResults);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        duration: 'N/A' // 検索結果では取得できない
      }));
    } catch (error) {
      console.error('YouTube search error:', error);
      return this.mockSearchResults(query, maxResults);
    }
  }

  formatDuration(isoDuration) {
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  mockVideoInfo(videoId) {
    return {
      id: videoId,
      title: `Sample Video ${videoId.slice(-4)}`,
      channel: 'Sample Channel',
      description: 'This is a sample video description for development.',
      publishedAt: new Date().toISOString(),
      duration: '10:30',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      views: Math.floor(Math.random() * 1000000),
      likes: Math.floor(Math.random() * 10000),
      transcript: 'Sample transcript content for the video...'
    };
  }

  mockSearchResults(query, maxResults) {
    return Array.from({ length: maxResults }, (_, i) => ({
      id: `mock${i}${Date.now()}`,
      title: `${query} - Sample Video ${i + 1}`,
      channel: `Sample Channel ${i + 1}`,
      description: `Sample description for ${query} video ${i + 1}`,
      publishedAt: new Date().toISOString(),
      thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
      duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
    }));
  }

  // YouTube字幕取得（サードパーティサービス使用）
  async getTranscript(videoId) {
    try {
      // 実際の実装では、youtube-transcript-api などのサービスを使用
      // または Supabase Edge Functions で実装
      const response = await fetch(`/api/transcript/${videoId}`);
      if (response.ok) {
        const data = await response.json();
        return data.transcript;
      }
      return null;
    } catch (error) {
      console.error('Transcript fetch error:', error);
      return null;
    }
  }
}

export const youtubeService = new YouTubeService();
export default youtubeService;