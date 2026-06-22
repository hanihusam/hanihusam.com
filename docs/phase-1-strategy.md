# Phase 1: Strategy + IA

_Started: 2026-04-22_

---

## 1. Tagline

**Working tagline:** "Engineer who designs. Designer who ships."

Sub-tagline (used in hero below the name): "Frontend-first, design-literate,
AI-assisted — with receipts."

**Why not "UI Engineer":** Generic. Every Upwork profile says this. **Why not "I
use AI":** Saturated. designsnack\_ and 10,000 others say this. **The angle
that's actually rare:** You have taste + you have receipts. You can show the
Figma file, the GitHub commit, and the running site in the same viewport. That's
the frame.

Resolve by end of Phase 1: pick one or iterate in Figma before Phase 4 home
design.

---

## 2. Language Decision

**EN-only.** Rationale: Upwork clients are globally EN. Bilingual adds
maintenance cost, dilutes SEO, and splits voice clarity. Your written English is
already natural. Bahasa hanya untuk social content kalau mau, tapi site =
English.

---

## 3. Sitemap + URL Structure

```
/                       Home
/works                  Work index (case studies)
/works/nota             Case study: Nota
/works/currinda         Case study: Currinda (pending NDA clearance)
/works/curious-me       Case study: Curious Me
/works/this-site        Case study: This site (meta)
/process                How I work (AI-assisted design-to-code)
/about                  About
/writing                Writing index (3–5 featured → Substack)
/writing/:slug          Individual post (MDX, featured only)
/links                  Links
/uses                   Uses
/resources              Resources (paid Figma landing)
```

**Dropped:** `/blog` → rename to `/writing`. Signals "essays" not "posts",
better positioning.

**Open:** `/uses` — keep if you update it. Archive if stale.

---

## 4. Per-Page Content Map

### `/` — Home

|                   |                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Goal**          | First impression → push to Work or Process                                                                                                 |
| **Feeling**       | "This person is serious but human"                                                                                                         |
| **Primary CTA**   | View my work → `/works`                                                                                                                    |
| **Secondary CTA** | How I work → `/process`                                                                                                                    |
| **Key content**   | Name + tagline, 2–3 sentence positioning statement, featured case study cards (2–3), social proof anchor (Upwork, GitHub, Figma Community) |
| **What to kill**  | Generic "I'm a passionate developer" copy                                                                                                  |

### `/works` — Work Index

|                 |                                                                            |
| --------------- | -------------------------------------------------------------------------- |
| **Goal**        | Qualify the visitor, let work speak                                        |
| **Feeling**     | "This is a real portfolio, not a template"                                 |
| **Primary CTA** | Each card → individual case study                                          |
| **Key content** | Case study cards: project name, role, year, one-line summary, stack badges |
| **Note**        | Nota first (most complete). Others follow as they're written.              |

### `/works/:slug` — Case Study

|                    |                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **Goal**           | Demonstrate depth: problem → approach → craft → results                                            |
| **Feeling**        | "I want to work with this person"                                                                  |
| **Primary CTA**    | See next case study OR Contact                                                                     |
| **Key content**    | Hero (project, role, year, stack), Context, Problem, Approach, Key decisions, Results, What's next |
| **Differentiator** | Split-view toggle (design / code / live). This is the flagship component.                          |

### `/process` — How I Work

|                         |                                                                                                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Goal**                | This is the thesis page. Address the "do you just vibe-code with AI?" skeptic directly.                                                                         |
| **Feeling**             | "Honest, opinionated, high craft"                                                                                                                               |
| **Primary CTA**         | See this in action → `/works/this-site`                                                                                                                         |
| **Key content**         | Workflow breakdown: brief → research → Figma → code → review. Where AI enters each step. Where _judgment_ overrides AI. Real examples with prompts + diffs.     |
| **Counter-positioning** | Show designsnack\_-style AI workflow (ask AI to do everything) vs. your approach (AI for velocity, you for judgment). Don't name them — just show the contrast. |
| **Note**                | Seed this with real material from this revamp — prompts used, Claude Code diffs, Figma iterations.                                                              |

### `/about` — About

|                 |                                                                                                             |
| --------------- | ----------------------------------------------------------------------------------------------------------- |
| **Goal**        | Human signal, not resume                                                                                    |
| **Feeling**     | "I'd work well with this person"                                                                            |
| **Primary CTA** | See my work / Contact                                                                                       |
| **Key content** | Short bio (keep warmth), current stack, what I'm interested in beyond code, links (GitHub, Figma, LinkedIn) |

### `/writing` — Writing Index

|                 |                                                                 |
| --------------- | --------------------------------------------------------------- |
| **Goal**        | Credibility signal, not content marketing                       |
| **Feeling**     | "This person thinks carefully"                                  |
| **Primary CTA** | Read on Substack (subscribe)                                    |
| **Key content** | 3–5 featured posts, clean list, clear link to Substack for more |

### `/resources` — Resources + Paid Figma

|                 |                                                                                               |
| --------------- | --------------------------------------------------------------------------------------------- |
| **Goal**        | Convert Figma Community traffic to buyers                                                     |
| **Feeling**     | "Worth the money, made by someone who actually uses this"                                     |
| **Primary CTA** | Buy on Gumroad                                                                                |
| **Key content** | Free files listed first (builds trust), paid all-in-one with clear value prop, preview frames |

---

## 5. Primary User Flow

```
First-time visitor (from Twitter / LinkedIn / Upwork / Figma Community)
        ↓
    Home /
        ↓
  [sees tagline + featured work]
        ↓
    Clicks → /works
        ↓
  [reads Nota case study or another]
        ↓
  Two exits:
    A) Impressed by craft → Contact (email link or simple form)
    B) Curious about process → /process → /works/this-site
        ↓
    A or B → checks GitHub / Figma links as trust signals
        ↓
    Reaches out (Upwork, email, LinkedIn)
```

Secondary flow (Figma Community visitor):

```
Figma Community profile → /resources → buys free file → follows → buys paid kit
```

---

## 6. Motion Philosophy

**Principle: motion communicates state, not decoration.**

Borrowing from Emil Kowalski (animation.dev): every animation should answer
"what changed and why."

### What animates

- Page transitions (View Transitions API — native, cheap)
- Case study split-view toggle (smooth reveal, not instant swap)
- Card hover states (subtle lift, not dramatic)
- Nav: open/close if mobile menu exists
- Loading states for any async content

### What does not animate

- Static text content
- Icons at rest
- Color-only state changes (use CSS transition, not Motion lib)

### Token defaults

```
duration-fast:   150ms   → hover states, micro-interactions
duration-base:   250ms   → panel reveals, card transitions
duration-slow:   400ms   → page-level transitions, split-view toggle
ease-out:        cubic-bezier(0, 0, 0.2, 1)   → elements entering
ease-in:         cubic-bezier(0.4, 0, 1, 1)   → elements leaving
spring-soft:     stiffness 120, damping 20     → cards, modals
spring-snappy:   stiffness 300, damping 30     → toggles, chips
```

### prefers-reduced-motion

All animations must respect this. Strategy: keep layout transitions (instant),
remove motion-only transitions. Test before launch.

### Motion library policy

`motion` (Framer Motion rebranded) — interactive components only. View
Transitions API for route-level. CSS transitions for hover/focus. Do not reach
for `motion` for anything CSS can handle.

---

## 7. Open Decisions to Resolve Before Phase 2

| Question                              | Options                                                         | Deadline         |
| ------------------------------------- | --------------------------------------------------------------- | ---------------- |
| Avatar: keep current 3D or new poses? | Keep (fastest) / New poses for process + 404 (more distinctive) | Before Phase 4   |
| Theme default                         | Light (recommended — warmth-aligned)                            | Decide now, lock |
| Paid distribution                     | Gumroad (fastest) vs Lemon Squeezy (better DX)                  | Before Phase 7   |
| Rates/availability on public site?    | No (recommend hidden — negotiate privately)                     | Before Phase 4   |
| CF Workers vs stay Fly                | CF if MDX stack dropped entirely; Fly if keeping                | Before Phase 5   |

**Recommend deciding theme default now** — it affects Figma setup from Phase 2
day 1.

---

## 8. Process Page Seed Content (start collecting now)

From this revamp, collect:

- Phase 0: `docs/before/` screenshots (done)
- Prompts used in Claude Code during revamp — copy to `docs/prompts/`
- Git diffs for notable decisions (split-view component, token migration)
- Figma iteration screenshots (each major version)
- Decision rationale for anything non-obvious

**The designsnack\_ contrast:** their AI workflow = ask AI to do everything
(brainstorming, analysis, design, prototyping, HTML/CSS, database). Your
workflow = AI for velocity at each step, but the judgment layer is yours. This
is the actual differentiation. Write 2–3 paragraphs on this for the process
page.

---

## Output Checklist

- [x] Tagline direction defined (needs final pick)
- [x] Language: EN-only
- [x] Sitemap + URL structure
- [x] Per-page content map
- [x] Primary user flow
- [x] Motion philosophy
- [x] Open decisions listed

Next: `docs/phase-2-design-system.md` scaffolding → Figma work begins.
