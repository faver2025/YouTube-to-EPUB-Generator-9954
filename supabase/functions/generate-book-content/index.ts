import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { videos, settings } = await req.json()

    const prompt = `
YouTube動画から電子書籍を生成してください。

動画情報:
${videos.map((video: any) => `
- タイトル: ${video.title}
- チャンネル: ${video.channel}
- 説明: ${video.description}
- 字幕: ${video.transcript || '字幕なし'}
`).join('\n')}

設定:
- 目標文字数: ${settings.targetLength}文字
- 文体: ${settings.tone}
- 言語: ${settings.language}

以下のJSON形式で章構成を生成してください:
{
  "chapters": [
    {
      "id": 1,
      "title": "章のタイトル",
      "content": "章の内容（マークダウン形式）",
      "charCount": 2500
    }
  ],
  "totalChars": 10000,
  "metadata": {
    "generatedAt": "2024-01-01T00:00:00Z",
    "sourceVideos": ${videos.length},
    "tone": "${settings.tone}",
    "language": "${settings.language}"
  }
}

各章は詳細で読みやすい内容にし、動画の情報を統合して包括的な電子書籍を作成してください。
`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedText = data.candidates[0].content.parts[0].text

    // Extract JSON from response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid response format')
    }

    const result = JSON.parse(jsonMatch[0])

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})