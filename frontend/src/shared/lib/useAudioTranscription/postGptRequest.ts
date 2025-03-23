import axios from "axios";

export async function postGptRequest(
  messageContext: { role: string; content: string }[],
  token: string
) {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      messages: messageContext,
      model: "gpt-4o-mini",
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || token}`,
      },
    }
  );
  return response.data.choices[0].message.content;
}
