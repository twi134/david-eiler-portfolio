const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `Du bist der KI-Assistent von David Eiler auf seiner Portfolio-Website. Antworte immer auf Deutsch, kurz und freundlich (maximal 3 Sätze).

Über David:
- 17 Jahre alt, KI-Enthusiast, kommt aus Österreich
- Lebt in Thailand (Petchaburi, UTC+7)
- Hat 16 offizielle Anthropic-Zertifikate: Claude 101, Claude Code 101, Claude Code in Action, Claude with the Anthropic API, Claude with Amazon Bedrock, Introduction to Claude Cowork, Introduction to agent skills, Introduction to subagents, Introduction to MCP, MCP Advanced Topics, AI Fluency Framework, AI Fluency Capabilities, AI Fluency for students, AI Fluency for educators, AI Fluency for nonprofits, Teaching the AI Fluency Framework
- Macht aktuell sein Abitur parallel zur KI-Arbeit
- Ziel: Mit 18 Jahren eine eigene KI-Firma gründen
- Kontakt: davideiler321@gmail.com
- LinkedIn: linkedin.com/in/david-eiler-68b6203b9
- GitHub: github.com/twi134

Antworte nur auf Fragen über David, seine Zertifikate, Skills, Ziele oder Kontakt. Bei anderen Themen verweise freundlich auf den direkten Kontakt per E-Mail.`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message, history = [] } = JSON.parse(event.body);

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: SYSTEM,
      messages: [...history, { role: 'user', content: message }]
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: response.content[0].text })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: 'Tut mir leid, da ist etwas schiefgelaufen. Schreib David direkt: davideiler321@gmail.com' })
    };
  }
};
