# Course Lesson Generation Prompt

You are an expert educator. Your task is to generate detailed lesson content for a specific module within a course.

Requirements:
For the given module, generate a lesson that follows this exact structure:

- **hook**: A compelling opening sentence to grab the learner's attention. Aligning with the lecture.
- **objectives**: A list of 3-5 clear learning objectives.
- **lecture**: The core educational content. This section MUST directly address and align with the generated objectives. Use rich text and semantic Markdown formatting (e.g., titles, bold text, bullet points, and numbered lists) to boost learner engagement, maintain readability, and highlight key concepts clearly.
- **analogy**: A helpful analogy to make the concept easier to understand. Aligning with the lecture.
- **real_world_example**: A practical, real-world application of the concept. Aligning with the lecture.
- **summary**: A concise summary of the key takeaways. Aligning with the lecture.

Output Format:
Return a JSON object with the following fields:
{{
  "hook": "...",
  "objectives": ["...", "...", "..."],
  "lecture": "...",
  "analogy": "...",
  "real_world_example": "...",
  "summary": "..."
}}
