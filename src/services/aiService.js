import { supabase } from '../lib/supabase';
import { geminiService } from './geminiService';
import { youtubeService } from './youtubeService';

class AIService {
  constructor() {
    this.useSupabase = !!supabase;
    this.useGemini = !!import.meta.env.VITE_GEMINI_API_KEY;
  }

  // YouTube API integration
  async fetchVideoInfo(videoId) {
    try {
      // First try YouTube API
      const videoInfo = await youtubeService.getVideoInfo(videoId);
      
      // Try to get transcript
      const transcript = await youtubeService.getTranscript(videoId);
      if (transcript) {
        videoInfo.transcript = transcript;
      }

      return videoInfo;
    } catch (error) {
      console.error('Error fetching video info:', error);
      return youtubeService.mockVideoInfo(videoId);
    }
  }

  // Search videos
  async searchVideos(query, maxResults = 10) {
    try {
      return await youtubeService.searchVideos(query, maxResults);
    } catch (error) {
      console.error('Error searching videos:', error);
      return youtubeService.mockSearchResults(query, maxResults);
    }
  }

  // Generate book content from videos
  async generateBookContent(videos, settings) {
    if (this.useSupabase) {
      try {
        const { data, error } = await supabase.functions.invoke('generate-book-content', {
          body: { videos, settings }
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Supabase function error:', error);
        // Fallback to Gemini
      }
    }

    if (this.useGemini) {
      try {
        return await geminiService.generateBookContent(videos, settings);
      } catch (error) {
        console.error('Gemini API error:', error);
        // Fallback to mock
      }
    }

    return this.mockGenerateContent(videos, settings);
  }

  // Enhance chapter content
  async enhanceChapter(chapter, enhancements) {
    if (this.useSupabase) {
      try {
        const { data, error } = await supabase.functions.invoke('enhance-chapter', {
          body: { chapter, enhancements }
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Supabase function error:', error);
      }
    }

    if (this.useGemini) {
      try {
        return await geminiService.enhanceChapter(chapter, enhancements);
      } catch (error) {
        console.error('Gemini API error:', error);
      }
    }

    return this.mockEnhanceChapter(chapter, enhancements);
  }

  // AI Assistant chat
  async sendMessage(message, context) {
    if (this.useSupabase) {
      try {
        const { data, error } = await supabase.functions.invoke('ai-chat', {
          body: { message, context }
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Supabase function error:', error);
      }
    }

    if (this.useGemini) {
      try {
        return await geminiService.chatResponse(message, context);
      } catch (error) {
        console.error('Gemini API error:', error);
      }
    }

    return this.mockAIResponse(message, context);
  }

  // Generate additional content segment
  async generateSegment(chapterTitle, existingContent, wordCount = 1000) {
    if (this.useSupabase) {
      try {
        const { data, error } = await supabase.functions.invoke('generate-segment', {
          body: { chapterTitle, existingContent, wordCount }
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Supabase function error:', error);
      }
    }

    if (this.useGemini) {
      try {
        return await geminiService.generateSegment(chapterTitle, existingContent, wordCount);
      } catch (error) {
        console.error('Gemini API error:', error);
      }
    }

    return this.mockGenerateSegment(chapterTitle, existingContent, wordCount);
  }

  // Mock implementations for fallback
  mockGenerateContent(videos, settings) {
    return new Promise(resolve => {
      setTimeout(() => {
        const chapters = [
          {
            id: 1,
            title: '序章：概要と目標',
            content: this.generateSampleContent('序章', settings.targetLength / 5),
            charCount: Math.floor(settings.targetLength / 5)
          },
          {
            id: 2,
            title: '第1章：基礎概念',
            content: this.generateSampleContent('基礎概念', settings.targetLength / 4),
            charCount: Math.floor(settings.targetLength / 4)
          },
          {
            id: 3,
            title: '第2章：実践的アプローチ',
            content: this.generateSampleContent('実践的アプローチ', settings.targetLength / 3),
            charCount: Math.floor(settings.targetLength / 3)
          },
          {
            id: 4,
            title: '第3章：応用例と事例',
            content: this.generateSampleContent('応用例', settings.targetLength / 4),
            charCount: Math.floor(settings.targetLength / 4)
          },
          {
            id: 5,
            title: '結論：まとめと今後の展望',
            content: this.generateSampleContent('結論', settings.targetLength / 6),
            charCount: Math.floor(settings.targetLength / 6)
          }
        ];

        resolve({
          chapters,
          totalChars: chapters.reduce((sum, ch) => sum + ch.charCount, 0),
          metadata: {
            generatedAt: new Date().toISOString(),
            sourceVideos: videos.length,
            tone: settings.tone,
            language: settings.language
          }
        });
      }, 5000);
    });
  }

  mockEnhanceChapter(chapter, enhancements) {
    return new Promise(resolve => {
      setTimeout(() => {
        let enhancedContent = chapter.content;

        if (enhancements.includes('readability')) {
          enhancedContent = enhancedContent.replace(/。/g, '。\n\n');
        }

        if (enhancements.includes('examples')) {
          enhancedContent += '\n\n## 実例\n\n具体的な事例を通して、この概念をより深く理解しましょう。\n\n**事例1**: 実際のビジネスシーンでの活用\n\n**事例2**: 日常生活での応用例';
        }

        if (enhancements.includes('structure')) {
          enhancedContent = '# ' + chapter.title + '\n\n' + enhancedContent;
        }

        if (enhancements.includes('engagement')) {
          enhancedContent += '\n\n## 読者への質問\n\n💭 この内容について、あなたはどう思いますか？\n\n🎯 実際に試してみたいことはありますか？';
        }

        resolve({
          ...chapter,
          content: enhancedContent,
          charCount: enhancedContent.length,
          lastEnhanced: new Date().toISOString(),
          appliedEnhancements: enhancements
        });
      }, 2000);
    });
  }

  mockAIResponse(message, context) {
    return new Promise(resolve => {
      setTimeout(() => {
        const responses = {
          '章構成': '章構成について分析しました。現在の構成は読者の理解度を考慮してよく設計されています。さらに改善するなら、各章の最後に要点をまとめるセクションを追加することをお勧めします。',
          '内容': 'コンテンツの品質を向上させるために、具体例を増やし、読者の実体験と結びつけられるような内容を追加しましょう。',
          'default': 'ご質問にお答えします。電子書籍の品質向上のために、どの部分を重点的に改善したいかお聞かせください。'
        };

        for (const [key, response] of Object.entries(responses)) {
          if (message.includes(key)) {
            return resolve({
              response,
              timestamp: new Date().toISOString()
            });
          }
        }

        resolve({
          response: responses.default,
          timestamp: new Date().toISOString()
        });
      }, 1500);
    });
  }

  mockGenerateSegment(chapterTitle, existingContent, wordCount) {
    return new Promise(resolve => {
      setTimeout(() => {
        const segment = `\n\n## AI生成セグメント\n\n${chapterTitle}に関するこの追加セクションでは、より詳細な解説を提供します。\n\n### 重要なポイント\n\n1. **理論的背景**: 基本的な概念から応用まで\n2. **実践的応用**: 実際の使用例とベストプラクティス\n3. **注意点**: 実装時に気をつけるべき事項\n\n### 詳細な説明\n\nこの部分では、${chapterTitle}について更に深く掘り下げます。読者の理解を深めるために、具体的な例や図表を用いて説明していきます。\n\n### まとめ\n\nこのセグメントで説明した内容を実践することで、より効果的な結果を得ることができるでしょう。次のステップとして、実際に試してみることをお勧めします。`;

        resolve({
          content: segment,
          charCount: segment.length,
          generatedAt: new Date().toISOString()
        });
      }, 2500);
    });
  }

  generateSampleContent(topic, targetLength) {
    const baseContent = `# ${topic}

この章では、${topic}について詳しく解説します。

## 概要

${topic}は現代において非常に重要な概念です。この章を通じて、基本的な理解から実践的な応用まで、包括的に学習していきましょう。

## 基本概念

### 定義と背景

${topic}の定義は以下の通りです：

- **基本的な概念**: 理論的な基盤となる考え方
- **歴史的背景**: これまでの発展の経緯
- **現在の位置づけ**: 現代社会での役割と重要性

### 主要な要素

${topic}を理解するために重要な要素は以下の通りです：

1. **第一の要素**: 基礎となる部分
2. **第二の要素**: 応用における重要な側面
3. **第三の要素**: 実践的な観点

## 実践的応用

### 具体例

実際の例を通して、${topic}の応用方法を見ていきましょう：

**例1**: 日常生活での活用
具体的なシナリオを想定して、どのように活用できるかを説明します。

**例2**: ビジネスでの応用
職場や業務において、この知識をどう生かすかの実例です。

### ベストプラクティス

効果的に${topic}を活用するためのコツ：

- ✅ 基本をしっかり理解する
- ✅ 段階的にステップアップする
- ✅ 継続的に実践し改善する
- ✅ 他の人と知識を共有する

## まとめ

${topic}について学習した内容をまとめると：

1. 基本概念の理解が重要
2. 実践的な応用が効果的
3. 継続的な学習が成功の鍵

次の章では、さらに発展的な内容について学習していきます。

---

💡 **学習のヒント**: この章の内容を実際に試してみることで、より深い理解が得られます。`;

    // Adjust content length to target
    const currentLength = baseContent.length;
    if (currentLength < targetLength) {
      const additionalContent = '\n\n## 補足説明\n\n' + 
        '詳細な説明がここに続きます。'.repeat(Math.floor((targetLength - currentLength) / 20));
      return baseContent + additionalContent;
    }
    return baseContent;
  }
}

export const aiService = new AIService();
export default aiService;