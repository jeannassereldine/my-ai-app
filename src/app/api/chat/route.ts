
import { streamText, UIMessage, convertToModelMessages } from 'ai';
// import { ollama } from 'ollama-ai-provider-v2';
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({
  // custom settings, e.g.
  baseURL: 'http://localhost:8000',
    // example fetch wrapper that logs the input to the API call:
  fetch: async (url, options) => {
    console.log('URL', url);
    console.log('body', options!.body);
    // console.log('Headers', JSON.stringify(options!.headers, null, 2));
    // console.log(
    //   `Body ${JSON.stringify(JSON.parse(options!.body! as string), null, 2)}`,
    // );
    return await fetch(url, options);
  },

  headers: {
    'header-name': 'header-value',
  },
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;



export async function POST(req: Request) {
  
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: openai.chat('gpt-4'),
    messages: convertToModelMessages(messages),
  });

  // console.log(result)

  return result.toUIMessageStreamResponse();
}