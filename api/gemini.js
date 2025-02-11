export default async function handler(req, res) {
  // Set CORS headers to allow any origin and methods (POST and OPTIONS)
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:9000");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS (preflight) request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(400).json({ error: "Only POST requests are allowed" });
  }

  const { userInput } = req.body;
  if (!userInput) {
    return res.status(400).json({ error: "User input is required" });
  }

  try {
    // ✅ Ensure API key is set
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      console.error("🚨 Missing API key in environment variables.");
      return res.status(500).json({ error: "API key not configured" });
    }

    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: { text: `Generate a structured to-do list from this request: ${userInput}` },
        }),
      }
    );

    const data = await response.json();

    // ✅ Handle missing response
    if (!data || !data.candidates || data.candidates.length === 0) {
      console.error("🚨 Invalid AI response:", data);
      return res.status(500).json({ error: "Failed to get AI response" });
    }

    // ✅ Extract tasks (ensure it's a string before splitting)
    const aiOutput = data.candidates[0]?.output || "";
    const tasksArray = typeof aiOutput === "string" ? aiOutput.split("\n") : [];

    // ✅ Get current time
    const now = new Date();
    let currentHour = now.getHours();
    let currentMinutes = now.getMinutes();

    // ✅ Process tasks
    const generatedTasks = tasksArray
      .map(task => task.trim())
      .filter(task => task.length > 0) // Remove empty lines
      .map(task => {
        // Extract duration (e.g., "Study Vue.js for 2 hours")
        const durationMatch = task.match(/(\d+)\s*(hour|minute|hours|minutes)/i);
        let duration = 60; // Default: 1 hour

        if (durationMatch) {
          let value = parseInt(durationMatch[1], 10);
          let unit = durationMatch[2].toLowerCase();
          duration = unit.includes("minute") ? value : value * 60;
        }

        // Format start time
        let startTime = new Date();
        startTime.setHours(currentHour, currentMinutes, 0);

        // Calculate end time
        let endTime = new Date(startTime.getTime() + duration * 60000);

        // Update current time for the next task
        currentHour = endTime.getHours();
        currentMinutes = endTime.getMinutes();

        return {
          title: task,
          startTime: formatTime(startTime),
          endTime: formatTime(endTime),
        };
      });

    res.json({ tasks: generatedTasks });

  } catch (error) {
    console.error("🚨 Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ✅ Helper function to format time as "hh:mm AM/PM"
function formatTime(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 24-hour to 12-hour format
  return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}
