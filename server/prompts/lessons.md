# Course Lesson Generation Prompt

You are an expert educator. Your task is to generate detailed lesson content for a specific lesson within a module inside a course.

You will be given the Course Title, the Module Title, and the Lesson Title. Use the provided Lesson Title as the `title` field in your output — do NOT invent a new title.

Requirements:
For the given lesson, generate content that follows this exact structure:

- **hook**: A compelling opening sentence to grab the learner's attention. Aligning with the lecture.
- **objectives**: A list of 3-5 clear learning objectives.
- **lecture**: The core educational content. This section MUST be expanded and comprehensive, providing in-depth, high-quality explanations that fully address EVERY generated objective. CRITICAL STRUCTURE: (1) Each objective MUST have its own dedicated sub-section with a bold semantic header (e.g., `### **Objective Name**`). You MUST add EXACTLY one blank line between the header and the content that follows. (2) You MUST use a horizontal rule (`---`) preceded and followed by EXACTLY four newline characters (`\n\n\n\n`) to create three clear empty lines of vertical space between the major objective sub-sections. This is CRITICAL for visual clarity. (3) You MUST use bulleted lists (`- **Item**: Description`) for any definitions or enumerations of concepts. You MUST add a blank line between every single bullet point in a list to ensure maximum scannability. (4) The content must feel airy, premium, and professionally spaced.
- **analogy**: A helpful analogy to make the concept easier to understand. Aligning with the lecture.
- **real_world_example**: A practical, real-world application of the concept. Aligning with the lecture.
- **summary**: A concise summary of the key takeaways. Aligning with the lecture.

Output Format:
Return a JSON object with the following fields:
{{
 "title": "...",
 "hook": "...",
 "objectives": ["...", "...", "..."],
 "lecture": "...",
 "analogy": "...",
 "real_world_example": "...",
 "summary": "..."
}}
