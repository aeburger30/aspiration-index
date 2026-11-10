# Aspiration Index — Self-Determination Theory Learning Lab

An interactive, 100% client-side educational lab built around **Kasser & Ryan's (1996) Aspiration Index** and **Self-Determination Theory (SDT)**.

## What Students & Learners Explore

1. **Blind 35-Item Aspiration Index Questionnaire**
   - Preserves all 35 canonical goals across 7 subscales (*Personal Growth, Relationships, Community, Wealth, Fame, Image,* and *Health*), rated on **Importance**, **Future Likelihood**, and **Current Attainment** (`1–7`).
   - Hides subscale labels during rating to avoid social-desirability bias, supporting single-card keyboard flow (`1–7`, `←/→`) or a `5-per-page` list view.

2. **Interactive Score & Psychometric Debrief**
   - **Raw Scores & Gaps vs. Mean-Centered Relative Priority**: Toggle between raw subscale averages (`1–7`) and Kasser & Ryan's relative centering (subtracting each learner's personal mean across all 35 items to control for response-style bias).
   - **Subscale Unmasking**: Click any of the 7 domains to see its 5 constituent items, your item-level scores, and your Importance–Attainment gap diagnosis.

3. **Core Self-Determination Theory Concepts**
   - **Basic Psychological Needs**: Maps your scores onto **Autonomy**, **Competence**, and **Relatedness** (Deci & Ryan, 2000; Bradshaw et al., 2023).
   - **"What" vs. "Why" Explorer**: Contrasts *goal content* with *autonomous vs. controlled motives* across financial ambition, public recognition, fitness/style, and academic achievement.

4. **Tailored Reflection Prompts**
   - Generates four reflection questions anchored in your own score profile with an optional browser-local scratchpad that formats cleanly for printing / saving as PDF.

## Development

```bash
npm install
npm run dev      # Start local Vite dev server
npm run build    # Run strict TypeScript check + static production build in dist/
```

No backend server, API keys, or external services are required—`dist/` deploys directly to any static host (GitHub Pages, Netlify, Cloudflare Pages, or Vercel).
