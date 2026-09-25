# Task Plan for Vanguard 15 Sailing Website Project

## Subtask Breakdown
The project is divided into 7 subtasks to optimize token usage and maintain focused conversations. Each subtask will be completed in sequence, transitioning via the new_task tool with summarized context.

1. **Project Setup**
   - Initialize Node.js project (done: npm init -y).
   - Install dependencies: next, react, react-dom, tailwindcss (dev), postcss (dev), autoprefixer (dev) (done).
   - Initialize Tailwind CSS configuration (pending: resolve npx tailwindcss init -p error).
   - Create config files: next.config.js, tailwind.config.js, postcss.config.js, netlify.toml.
   - Set up directory structure: /pages, /components, /content, /public, /static/admin.
   - Status: In progress.

2. **Basic Structure and Navigation**
   - Create main pages (e.g., index.js, articles.js, parts.js, regattas.js, **about.js**).
   - Develop reusable components (e.g., Navbar, Footer, ArticleCard).
   - Implement site navigation and routing.
   - Status: Not started.

3. **Content Integration**
   - Migrate and organize content from v15-content/ into /content (Markdown/JSON files).
   - Implement dynamic content loading for articles, parts recommendations, and regatta info.
   - Add client-side search using Lunr.js.
   - **Create sample JSON/Markdown content** for at least 5 articles, 5 parts vendors, and 5 regatta events to populate /content.
   - Status: Not started.

4. **Styling and Design**
   - Apply Tailwind CSS classes for responsive, mobile-first design.
   - Use sailing-themed color palette (navy blue, white, sky blue).
   - Add subtle animations and ensure accessibility.
   - Status: Not started.

5. **CMS and Admin Integration**
   - Configure Netlify CMS for content management.
   - Set up admin interface at /admin.
   - Integrate with Git repo for content updates.
   - Status: Not started.

6. **Optimization, Security, and Testing**
   - Optimize for performance (target Lighthouse score 90+).
   - Implement security headers (e.g., Content-Security-Policy).
   - Ensure mobile responsiveness and cross-browser compatibility.
   - Add tests if necessary.
   - Status: Not started.

7. **Deployment and Finalization**
   - Configure Netlify deployment with CI/CD from GitHub.
   - Set up custom domain (https://v-15.org) and admin email (skipper@v-15.org).
   - Perform final testing and optimizations.
   - **Write a comprehensive README.md** covering deployment instructions (linking GitHub repo to Netlify, build settings, custom domain setup, inviting skipper@v-15.org as admin, enabling GitHub OAuth for Netlify CMS).
   - Status: Not started.

## Overall Status
- Current Subtask: 1 (Project Setup).
- Next Immediate Steps: Resolve Tailwind init error, create remaining config files, complete directory setup.
- Transition Plan: Upon completing a subtask, update summaries and use new_task to preload context for the next subtask.

This plan will be updated as subtasks progress.

## Backlog

### CMS editing via Netlify Identity + Git Gateway — DEFERRED (2026-09, user decision)
Decap CMS files exist at `public/admin/` and `config.yml` is already `backend: name: git-gateway`,
but the CMS is intentionally not active. /admin/ will load the UI but cannot save until enabled.
To activate later (Netlify dashboard only, no code changes needed):
1. app.netlify.com → site → Identity → Enable
2. Identity → Services → Git Gateway → Enable
3. Identity → Invite users (editors need no GitHub account; commits land on `main` and redeploy)
Optional: enable external OAuth providers (Google/GitHub) for editor login.
If unused long-term, consider deleting `public/admin/` and the CSP exception in netlify.toml.
