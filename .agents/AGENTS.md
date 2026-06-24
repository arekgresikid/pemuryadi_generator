# Antigravity Rules for pemuryadi_generator

## 1. AI Vibe Coding (Visual-Only Changes)
If the user requests visual, UI/UX, or layout changes (commonly referred to as "Vibe Coding"), apply the following strict rules to prevent breaking the application's functionality:
- **Do Not Modify Logic & State:** DO NOT touch, alter, or add `useState`, `useEffect`, `Context`, API connections (`api.ts`), or any currently functioning logic.
- **Focus on Tailwind:** Restrict your changes **ONLY** to modifying Tailwind CSS class names, inline styles, HTML tags, or simple DOM structures for layout design purposes.
- **Do Not Refactor Components:** DO NOT break down components into new files, merge components, or modify component properties (props) unless explicitly instructed by the user.

## 2. Preventing Context Degradation & Code Mutilation
When engaging in long conversations or making minor tweaks:
- **Never Use Placeholders:** Do NOT output abbreviated code like `// ...existing code...` in a way that overwrites the actual file with comments. Always use the precise replacement tools to target specific lines without destroying the rest of the file.
- **Atomic Edits Only:** Target the absolute minimum number of lines required to fulfill the request.
- **DO NOT Delete Old Code:** Leave comments, unused variables, or old code that is unrelated to the current task exactly as it is. Do not attempt to silently refactor or "clean up" the codebase.

## 3. Backend & Architecture Safeguards (Cloudflare D1 & Hono)
This project uses Cloudflare Workers (Hono) and a D1 Database. 
- **No Unsolicited Schema Changes:** Do NOT modify `schema.sql` or create new database migrations unless the user explicitly requests a database structural change.
- **API Endpoint Stability:** Do NOT alter existing routes in `functions/api/[[route]].ts` or the authentication logic in `src/AuthContext.tsx` unless explicitly instructed.
- **No Unapproved Dependencies:** Do not add new `npm` packages or libraries to `package.json` unless it is strictly necessary and you have obtained explicit permission from the user.

## 4. Planning First for Major Features
- If a request involves complex logic (e.g., adding a new AI generator tool, creating a new database table, or implementing a new feature module), you **MUST** first generate a short plan using the `implementation_plan.md` artifact and await the user's approval before touching any code.
