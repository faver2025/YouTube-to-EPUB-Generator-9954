import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { chapter, enhancements } = await req.json()

    const enhancementDescriptions = {
      'readability': '読みやすさを向上させる',
      'examples': '具体例や事例を追加する',
      'structure': '構造を最適化し、見出しを整理する',
      'engagement': '読者エンゲージメントを高める要素を追加する',
      'seo': 'SEOを考慮したキーワードを自然に組み込む',
      'formatting': 'フォーマットを強化し、リストや強調を適切に配置する'
    }

    const selectedEnhancements = enhancements
      .map((id: string) => enhancementDescriptions[id as keyof typeof enhancementDescriptions])
      .filter(Boolean)

    const prompt = `
以下の章を改善してください。

章タイトル: ${chapter.title}
現在の内容:
${chapter.content}

改善項目:
${selectedEnhancements.map((desc: string) => `- ${desc}`).join('\n')}

改善後の章をJSON形式で返してください:
{
  "id": ${chapter.id},
  "title": "${chapter.title}",
  "content": "改善後の内容（マークダウン形式）",
  "charCount": 数値,
  "lastEnhanced": "2024-01-01T00:00:00Z",
  "appliedEnhancements": ${JSON.stringify(enhancements)}
}

内容は自然で読みやすく、指定された改善項目を適用してください。
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