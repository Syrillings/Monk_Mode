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
  - "start_time" (string): The scheduled start time in 24-hour format (HH:MM).  
  - "fixed_time" (boolean): Whether the task **must** happen at a specific time.  

- If the user specifies a **fixed time**, ensure the task starts and ends at that time.  
- If no time is specified, fit the task **sensibly** within the current time and **before 12 AM**.  
- Do **not** push tasks to the next day unless the user explicitly states so.  
- If there isn’t enough time for all tasks, **shorten or adjust flexible tasks** rather than dropping them.  
- If a task **cannot fit at all**, then move it to the next day and make it so it occupies as little time as possible unless told otherwise.  

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
