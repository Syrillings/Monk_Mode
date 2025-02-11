import axios from "axios";

const TOGETHER_AI_API_KEY = "bbdf899567c8d705b03dbd5f5b5fe045c7f3251674bb94cd0a0feec5835ade7b";
const TOGETHER_AI_ENDPOINT = "https://api.together.xyz/v1/chat/completions"; // Corrected URL

export const generateAIResponse = async (userPrompt) => {
  try {
    const systemPrompt = `You are a smart and organized AI assistant that helps users plan their day efficiently.  
      The user will describe their day, including activities they need to complete. Your task is to generate a well-structured daily schedule with the following conditions:  
      - Output a JSON array of tasks.  
      - Each task must include:
        - "name" (string): The task name.
        - "duration" (integer): The estimated time in minutes.
      - If the user specifies a duration, use that. Otherwise, estimate it based on common durations.
      - Ensure that no tasks are scheduled before the current time.
      - Schedule tasks sequentially, respecting their durations.
      - Return **only** the JSON response with no additional text.`;

    const response = await axios.post(
      TOGETHER_AI_ENDPOINT,
      {
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${TOGETHER_AI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return JSON.parse(response.data.choices[0].message.content); 
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return null;
  }
};
