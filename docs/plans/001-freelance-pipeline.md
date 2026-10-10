# Plan 001: Make the website Hani's professional home and inquiry path

## Status and execution contract

- Priority: P1.
- Category: direction.
- Revised: 2026-10-10, against commit `fb76262` and the current uncommitted
  working tree.
- Status: direction agreed; implementation partially complete.
- Effort: several small implementation batches; career and review content depend
  on source material.
- Risk: low for status, links, and event attributes; medium for attribution,
  unverified career details, and third-party quotations.
- Supersedes the original sales-funnel-first plan after the owner's purpose and
  preferences were clarified.

This document records the agreed direction and future implementation steps.
Execute one bounded batch at a time when implementation is requested. Preserve
existing user edits. Keep all documentation and plans under `docs/`; root
`README.md` and `AGENTS.md` remain entry points.

Before editing source, run `git status --short`,
`git diff --stat fb76262..HEAD -- app contents`, and `git diff -- app contents`.
The existing local changes are not contained in the stamped commit. Compare the
live files with the excerpts below; reconcile differences without resetting
files. Update the stage statuses and `docs/plans/README.md` as work completes.

## Agreed purpose

> A personal professional home where people can explore my projects, products,
> writing, and experience, understand how I think and work, and easily reach me
> about freelance or contract opportunities.

The primary outcome is professional visibility and understanding beyond
LinkedIn, Figma, and Upwork. The site stands on its own. Inquiries follow from
people recognizing Hani's capabilities through his work and stories.

The professional identity is a frontend engineer who can also design, ship
interfaces, and take ownership. This is a description of capabilities, not a
mandatory list of services or client categories.

## Settled decisions

1. Preserve the casual personal voice, including “I'm Han” and “Engineer who
   designs. Designer who ships.” Do not introduce formal agency copy.
2. Projects tell the highlights Hani wants to share. Do not rewrite every story
   into a standardized commercial case study, force outcome metrics, or require
   a section describing work he accepts.
3. Writing, experiments, and independent products belong on the website. Hani
   built Selarik, his own macOS app; a public link and project material have not
   yet been supplied or verified.
4. Preferred working pattern: one sustained team engagement or ongoing
   independent responsibility, with roughly one or two short projects per month.
   Keep this as planning context; do not publish it as guaranteed capacity.
5. Preferred relationships: product teams for sustained work, selected business
   owners for shorter work, and agencies as another route.
6. Current availability wording is exactly “Open to freelance & contract work.”
   Maintain it manually as commitments change.
7. Hani remains the client's main contact and responsible for the workflow and
   delivery if colleagues contribute. Keep the personal identity; describe
   contributions accurately and do not invent solo-delivery claims.
8. Email remains the primary contact path. Upwork is a secondary professional
   profile link, not a required hiring destination.
9. Show two or three genuine Upwork reviews after Featured Projects and before
   the inquiry CTA. Exact review material remains pending.
10. About carries a compact work history. `https://cv.hanihusam.com` is intended
    to hold the detailed career record. That site could not be inspected and is
    a separate future update, not part of this repository's implementation. On
    2026-10-08, Hani explicitly deferred batch 3 until he revisits and updates
    the online résumé. Do not start career-history or CV-destination changes
    before that work is ready.
11. Discovery starts by connecting existing professional profiles to the website
    and sharing individual project stories when there is something useful to
    say. No cold-outreach quotas or mandatory publishing cadence.
12. Preserve the Works-page CTA design and Curious Me's Open Live Site link.

## Updated design reference

On 2026-10-08, Hani supplied the updated
[Figma design](https://www.figma.com/design/FgO4Ew3x6leMA44NCpJ12F/hanihusam-site-v2?node-id=49-4).
The linked node is the Pages canvas. Homepage frames reviewed: desktop light
`76:2`, mobile light `481:3605`, and dark desktop hero `275:636`. After Hani
agreed to the recommendations, the Figma homepage frames were updated on
2026-10-08. These homepage design changes are implemented locally, as recorded
below.

- The hero adds the agreed availability pill and preserves the personal copy.
- The footer includes Upwork and Resume alongside existing professional links.
  The Resume label does not authorize switching the destination before the CV is
  ready.
- The centered inquiry CTA keeps the invitation and removes the repeated
  availability sentence; availability is already stated in the hero.
- All six homepage frames now show Curious Me → Cincy → motion study. Cincy is
  restored in tablet and mobile, in both themes.
- Mobile has the “Have a project in mind?” ghost button after View My Works.
- Each homepage project card now includes its existing MDX role text below the
  description. These are text overrides on existing component instances;
  component links were retained. Curious Me's Open Live Site remains present.
- Auto-layout expands the pages for the restored cards, and background coverage
  was extended to match. Screenshots were inspected for all six homepage
  variants after the edits.
- Reviewed frames do not contain review quotes. Reviews remain pending exact
  source material.

Updated frames: desktop light `76:2`, desktop dark `275:635`, tablet light
`481:2370`, tablet dark `481:2957`, mobile light `481:3605`, mobile dark
`489:1193`. This design update covers batch 1's presentation and preserves batch
0's agreed project/contact behavior. The subsequent code update implements batch
1 locally. Batch 2's case-study design was updated on 2026-10-09 as described
below; batch 2's case-study and About implementations are now complete locally.
Browser visual/interaction checks and batches 3–4 remain pending.

## Case-study design — 2026-10-09

Current file:
[Personal site | hanihusam](https://www.figma.com/design/KY28nstxhHewWXVEh4f9Iy/Personal-site-hanihusam?node-id=49-4).

- Updated the six Work Detail frames: desktop light `422:1158`, desktop dark
  `437:1464`, tablet light `749:3539`, tablet dark `753:3867`, mobile light
  `755:4042`, and mobile dark `755:4277`.
- Replaced the three shortened sections with the complete navigation-motion
  story from the repository, checked against the published case study. Each
  frame includes 13 section headings, 12 code blocks, two unordered lists, five
  video-poster figures and captions, and the navigation-state table.
- Added an article-width closing block: a divider, “Have something you’d like to
  build together?”, an orange “Let’s talk ↗” email link, and a quieter “← Back
  to projects” link. The email subject identifies the project. Home and Works
  retain their larger inquiry sections.
- Expanded the desktop TOC to cover the complete story. The links point to the
  published article's sections. Tablet/mobile retain their floating TOC
  controls.
- Added separate editable Writing elements reference frames in light
  (`3148:4678`) and dark (`3148:4732`) themes to the right of the page designs.
  They cover subordinate headings, emphasis, links, inline code, ordered lists,
  blockquotes, and callout variants. These are design specimens, not additions
  to the published story.
- Media are static posters from the existing Cloudinary videos, with links to
  the video files. Text, layout, tables, and code remain editable Figma layers;
  existing code components remain instances.
- Inspected screenshots and corrected wrapping, row sizing, and contrast. Lower
  canvas rows were moved down to avoid overlap with the longer pages. This task
  changed Figma and this plan; the subsequent source implementation is recorded
  below.

## Case-study implementation — 2026-10-09

- Reviewed Hani's latest changes in the current Figma file: the invitation and
  orange “Let’s talk” link sit together, followed by the existing ghost “Back to
  the list” button. Implemented this version on every project detail page, with
  wrapping text and intrinsic link widths on smaller screens.
- Added `ProjectClosing` beside the article in its content column, outside the
  MDX prose and TOC collection. The encoded email subject includes the project
  title; Umami records `case-study-inquiry-click`, page `project`, and the slug.
- Matched the writing references through case-study-scoped styles: 18/28 body
  text, responsive heading hierarchy, semantic link colors, lists, themed
  blockquotes, callout variants, media captions, and wrapping tables. Code
  blocks retain language/copy controls and syntax highlighting, using the
  neutral surfaces shown in the latest design in both themes.
- Preserved the authored MDX and working Cloudinary videos. Reference-only
  writing examples were not added to the published story.
- Verification: `npm run validate` passed; rendered HTML confirmed the motion
  study's 13 headings, 12 code blocks, five videos, one closing outside the
  article, and encoded title/analytics data. Browser preview was unavailable, so
  visual and browser interaction checks remain outstanding.
- This implementation was limited to the reviewed case-study design and its
  writing styles. About's direct email option was completed on 2026-10-10, as
  recorded below.

## About contact implementation — 2026-10-10

- Matched Hani's revised About CTA in all six reviewed Figma variants: existing
  “Want to work together?” heading, “Take a look at my work, or tell me what
  you’re building.” copy, primary “View my work” button, and ghost “Let’s talk”
  button within the same section.
- Reused the typography, button, dot-grid, and Phosphor icon components. Matched
  the text/action gaps, mobile heading size, tablet padding, and decorative
  visibility. The button row wraps when space is limited.
- The email link opens `me@hanihusam.com` with subject `Project inquiry` and
  records `about-inquiry-click` with page `about`. Added a visible keyboard
  focus outline to the email action.
- Verification: `npm run validate`, targeted formatting, and whitespace checks
  passed. Local rendered HTML confirms the updated copy, Works destination, one
  email action, subject, and tracking attributes. Browser access remains
  unavailable; visual layout and browser interaction checks remain pending.
- Batch 2's planned source changes are complete locally. This does not establish
  deployment or receipt of analytics events.

## Homepage implementation — 2026-10-08

- Added the static availability pill using existing theme tokens and typography.
- Matched mobile View My Works wording, stacked hero buttons, inquiry button
  sizing, project gaps, and homepage CTA spacing/copy to the updated design.
  Works retains its existing CTA copy and spacing.
- Added Upwork and Resume to the wrapping shared footer, with visible keyboard
  focus. Resume retains the existing Google Drive destination while batch 3 is
  deferred. The footer shows Bantul, Yogyakarta and updates its Jakarta time
  after hydration, with an interval cleanup.
- Corrected the shared email scheme to `mailto:hi@hanihusam.com`; existing
  inquiry and footer recipients remain `me@hanihusam.com`.
- Matched Curious Me's frontmatter summary to Figma without rewriting its story.
  Role lines use body typography and the existing MDX fields.
- Existing project images and dynamic writing content are retained. An optional
  thumbnail preference question was sent; without a reply, the implementation
  preserves existing images rather than replacing them with design placeholders.
- Verification: formatting, lint, typecheck, build, and whitespace checks;
  localhost HTML verifies status, refreshed summary, project order, role text,
  Upwork/CV/live-site destinations, and both inquiry event attributes.
- Manual visual checks at 375px/1280px in both themes, keyboard activation,
  client-side navigation, and clock rendering remain pending. Native browser
  inspection stalled repeatedly, and a preview navigation attempt was rejected
  because the user changed the app. No rendered screenshots were obtained. This
  does not establish production deployment or live Umami event receipt.

## Current state and evidence

- `app/routes/_index.tsx` explicitly selects `curious-me`,
  `cincy-dot-physicals`, then `translating-instagrams-motion-to-the-web`.
  Homepage order: Hero → Featured Projects → CTA → Recent Writing → global
  footer.
- `app/components/home/project-section.tsx` renders all three projects on
  mobile; do not restore the old third-card hiding rule.
- `app/components/projects/project-card.tsx` renders existing MDX `role` text
  beneath the description. No extra frontmatter field is needed for this.
- `app/components/home/hero-section.tsx` contains the general email link and
  `hero-inquiry-click` with `data-umami-event-page="home"`, plus the agreed
  availability status.
- `app/components/works/cta-section.tsx` contains the shared centered CTA and
  dot decorations. The load-bearing prop shape is:

```tsx
interface CallToActionProps {
	page: 'home' | 'works'
}
```

Its button currently uses:

```tsx
href="mailto:me@hanihusam.com?subject=Project%20inquiry"
data-umami-event="lets-talk-click"
data-umami-event-page={page}
```

- `app/routes/works.$slug.tsx` renders `ProjectClosing` after each story,
  outside the article's prose and TOC collection. Email subjects and event
  metadata identify the project; the closing shares the article's content
  column.
- `app/components/about/hero-section.tsx` gives a prose introduction, rather
  than a dated work history. `app/components/about/cta-section.tsx` currently
  links to Works and provides a tracked direct email action.
- `app/external-links.tsx` retains the Google Drive CV URL, includes the
  supplied Upwork profile, and uses `mailto:hi@hanihusam.com` for the shared
  email entry. Visible inquiry buttons and the footer target `me@hanihusam.com`;
  both established recipients are preserved.
- `app/root.tsx` installs Umami. Live event receipt and deployment of the local
  changes have not been verified.
- `contents/projects/curious-me.mdx` documents approximately three years of
  contract work. `contents/projects/cincy-dot-physicals.mdx` documents design,
  development, booking integration, migration, and handoff. Preserve their
  authored stories.
- The public Upwork profile supplied by the owner is
  `https://www.upwork.com/freelancers/~013306ab317c6ea0da`. Public fetch and
  browser attempts did not yield readable reviews; none have been selected or
  transcribed.

## Execution order and dependencies

| Batch | Work                                                                                          | Status                                               | Dependency                                     |
| ----- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------- |
| 0     | Homepage curation, mobile visibility, role text, shared CTA, click attributes, spacer cleanup | Implemented locally; production verification pending | None                                           |
| 1     | Availability and secondary profile links                                                      | Implemented locally; manual visual checks pending    | Production verification pending                |
| 2     | Case-study inquiry paths, writing styles, and About contact                                   | Implemented locally; browser/live checks pending     | Deployment and browser access                  |
| 3     | Compact About work history and CV connection                                                  | Deferred by owner                                    | Owner's online résumé update; verified entries |
| 4     | Genuine Upwork reviews on the homepage                                                        | Pending content                                      | Readable exact reviews and public attribution  |
| 5     | Connect professional profiles and share stories                                               | Owner-operated                                       | Site updates live and contact working          |
| 6     | Verify delivery, review visibility and inquiries                                              | Ongoing                                              | Deployment and analytics access                |

Batches 1 and 2 do not depend on reviews, work-history content, or the CV
becoming available. Do not delay them for unavailable material.

## Pull request split — 2026-10-10

Completed changes are proposed in independent branches based on
`654062e880aee74d56e33419139fb2bc8c7ea11a` (the latest fetched `origin/main`).
The original working checkout is preserved. None of these PRs has been merged or
deployed as part of this task.

| PR                                                          | Scope                                                  | Branch                           | Review status                       |
| ----------------------------------------------------------- | ------------------------------------------------------ | -------------------------------- | ----------------------------------- |
| [#179](https://github.com/hanihusam/hanihusam.com/pull/179) | About copy and direct email action                     | `feat/about-contact`             | Draft; browser checks pending       |
| [#180](https://github.com/hanihusam/hanihusam.com/pull/180) | Footer profiles, location/time and mail scheme         | `feat/footer-professional-links` | Draft; browser checks pending       |
| [#181](https://github.com/hanihusam/hanihusam.com/pull/181) | Homepage hero, featured work and shared Home/Works CTA | `feat/home-freelance-pipeline`   | Draft; browser checks pending       |
| [#182](https://github.com/hanihusam/hanihusam.com/pull/182) | Case-study inquiry closing and writing styles          | `feat/case-study-inquiries`      | Draft; browser checks pending       |
| Separate maintenance PR                                     | Documentation cleanup and Release Please configuration | `chore/docs-and-release-config`  | Code/configuration checks completed |

- Each branch passed `npm run validate`, the full formatting check and
  whitespace checks independently. Every website branch also passed an isolated
  development-server check of its relevant rendered routes, content, link
  destinations, email subjects and analytics attributes.
- The homepage PR contains the shared CTA component and both callers together;
  no PR depends on another PR's source changes. Each changed source path belongs
  to one PR only, so reviews and merge order can be independent.
- Browser accessibility inspection of the combined working checkout confirmed
  About's Works/email destinations and the hydrated footer clock. Native Arc
  scrolling failed twice with `noWindowsAvailable`. Responsive visuals in both
  themes, keyboard/email activation, client-side navigation, TOC and clipboard
  behavior remain pending where relevant. Each website PR records its own gaps.
- Maintenance verification confirms the moved changelog is byte-for-byte
  identical, index links resolve, and manifest version `1.3.0` agrees with the
  repository package and changelog. The latest published GitHub release is
  `v1.2.0`; existing repository versioning is retained, not rewritten. Live
  Release Please execution and event receipt are not established by these
  checks.
- CI and review results belong to the PRs. Keep client-review and career-history
  work in later PRs; profile sharing remains a separate owner task.

## Repository conventions and verification gates

Read `AGENTS.md`, `docs/agents/code-style.md`, `docs/agents/architecture.md`,
and `docs/agents/content-and-data.md` before source work.

Use one named component per file, `@/` imports, `clsxm`, theme tokens,
typography primitives, and `ButtonLink`/`AnchorOrLink`. Reuse existing
compositions such as `app/components/works/cta-section.tsx` and
`app/components/home/project-section.tsx`. Email and external profile navigation
use `href`. Use existing `Spacer` sizes for layout. ContentType remains
`projects`; case studies stay in `contents/projects/`, writing stays on
Substack.

| Gate                      | Command                             | Success                                |
| ------------------------- | ----------------------------------- | -------------------------------------- |
| Node                      | `node --version`                    | >=22.22.0                              |
| Formatting                | `npx oxfmt --check <changed files>` | Exit 0                                 |
| Lint                      | `npm run lint`                      | Exit 0                                 |
| Typecheck                 | `npm run typecheck`                 | Exit 0                                 |
| Whitespace                | `git diff --check`                  | Exit 0                                 |
| Dev preview               | `npm run dev`                       | Relevant routes load on localhost:3000 |
| Before an authorized push | `npm run validate`                  | Lint, typecheck, and build succeed     |

There is no automated test suite. Do not install test tooling for simple content
or attribute changes. Each UI batch needs manual checks at 375px and 1280px in
both themes, keyboard focus and activation, and client-side navigation. Inspect
rendered links and event attributes. When browser/account access is unavailable,
record the missing check; never substitute a typecheck for observed rendering or
event receipt.

Do not commit or push unless requested. Use Conventional Commits without AI
attribution if committing is authorized. Keep operational lead records out of
this repository.

## Batch 1 — Make availability and professional links visible

Effort: S. Risk: LOW.

Scope: `app/components/home/hero-section.tsx`, `app/external-links.tsx`,
`app/components/footer.tsx`; `app/components/about/hero-section.tsx` only for a
CV link when ready.

1. Add “Open to freelance & contract work” near the hero introduction using
   `Text` and theme tokens. Keep it readable on mobile, subtle enough to fit the
   personal tone, and unanimated. A status dot is optional decoration, never the
   only indication of availability. Do not rearrange the approved hero or
   replace its headline.
2. Add the supplied Upwork URL to `externalLinks` and expose it as a secondary
   professional link in the footer. Keep the mail contact primary. The website
   must remain usable without opening Upwork or logging in.
3. Inspect CV readiness. If accessible and ready, update the central CV
   destination and add a clear link on About. Otherwise retain the existing
   working CV destination and record the planned move; do not replace it with an
   inaccessible page merely because a URL exists.
4. Inspect uses of the malformed email entry. Correct its scheme while retaining
   its current recipient; only unify the recipient with the existing CTA address
   after confirmation of the intended inbox. Do not silently change established
   visible mail destinations.
5. Run formatting, lint, types, and whitespace gates. In preview, inspect status
   readability, footer wrapping, keyboard focus, Upwork destination, and any
   changed CV link.

Done: agreed availability text is visible on desktop and mobile; Upwork is a
secondary link; no extra address is added beneath the hero email button;
existing hero copy is preserved. Availability remains one manually editable text
value.

## Batch 2 — Let readers inquire after a project story

Effort: S. Risk: LOW.

Status: the compact case-study closing, writing styles, and About contact option
are implemented locally. Browser visual/interaction checks remain pending.

Scope: a new compact project-closing component, `app/routes/works.$slug.tsx`,
and `app/components/about/cta-section.tsx`.

1. Build an article-width closing block with a divider, the casual invitation,
   an orange email link, and Hani's ghost “Back to the list” button. Supply
   `projectTitle` and `projectSlug`; preserve the current Home/Works design and
   copy. Do not repeat their full centered CTA section on case studies.
2. Add the closing after the project article, outside its prose and TOC layouts.
   Supply title and slug from loader frontmatter. Inspect adjacent spacing,
   accounting for the article's padding; do not change MDX story content.
3. Use `encodeURIComponent` to build `Project inquiry — <title>` subjects for
   project pages; keep `Project inquiry` for general contact.
4. Preserve `hero-inquiry-click` and `lets-talk-click`. Use
   `case-study-inquiry-click` on project CTAs with page and project slug data.
   Use Umami data attributes through the existing anchor primitive, not a
   duplicate click handler.
5. Add a direct email option alongside About's existing Works link. If tracked,
   use `about-inquiry-click` and page `about`.
6. Run the standard gates. Inspect encoded subjects, actual anchor attributes,
   keyboard activation, both themes, and direct entry versus client-side
   navigation to case studies.

Done: readers can inquire after a story; subjects and metadata accurately
identify the project; existing project/live links are retained; no story is
rewritten as a services page.

## Batch 3 — Connect About to a structured career record

Deferred by Hani on 2026-10-08 until he revisits and updates his online résumé.
Keep existing career content and CV destination in place in the meantime.

Effort: S/M once source material exists. Risk: MED until dates/roles are
verified.

Scope: a new `app/components/about/work-history-section.tsx`, a small data file
under `app/data/` if needed, `app/routes/about.tsx`, and
`app/external-links.tsx` for the CV destination when ready. The external CV app
is out of scope.

1. Obtain verified career entries from the owner or the ready CV. Do not infer
   employment dates or company relationships from project publication dates.
2. Select approximately three to five relevant entries for About. Each contains
   organization, role, period, and at most a short context line. This is an
   overview, not a second full résumé.
3. Add the history after the About introduction and before personal
   material/writing, preserving the existing personality sections.
4. Link to the detailed CV as “View my CV” when it is ready. Maintain the full
   career record there and update the compact overview deliberately when
   significant roles change; do not introduce live scraping or a network
   dependency between the sites.
5. Run standard gates and inspect responsive chronology and links. Check each
   entry against source material.

Done: About provides career orientation without duplicating the full CV;
role/date statements are verified; the linked CV is reachable. If CV work is
pending, the compact section can proceed with independently verified owner
material.

## Batch 4 — Add a client's perspective to the homepage

Effort: S/M after content is supplied. Risk: MED for inaccurate quotation or
attribution.

Scope: a new `app/components/home/client-feedback-section.tsx`, a small data
file under `app/data/`, and `app/routes/_index.tsx`. No changes to authored MDX
are required.

1. Obtain readable review text or screenshots from the owner, or verified access
   to the supplied profile. Select two or three reviews that add concrete
   information about collaboration, reliability, judgment, or delivered work.
2. Preserve exact wording. A shorter excerpt is acceptable only if it retains
   meaning; label material omissions and never generate a substitute
   testimonial. Use only public/source-supported attribution. Do not invent
   company names, reviewer identity, star ratings, dates, or job titles.
3. Render a static selection after Featured Projects and before the existing
   inquiry CTA. Use a heading such as “A few words from clients,” typography
   primitives, semantic quotations, theme tokens, and a stacked mobile layout.
   No autoplay carousel, review-count claims, or oversized rating banner.
4. Provide a clear Upwork source link. If a verified quote belongs to a featured
   project, link to its case study as additional context. Do not force a project
   association when uncertain.
5. Run standard gates. Compare every displayed quote and attribution to its
   source, inspect mobile wrapping and both themes, and verify source links. If
   content is unavailable, leave the source unchanged rather than publishing
   placeholder praise.

Done: actual client feedback supports the personal stories without dominating
the page. Target homepage order is Hero → Featured Projects → Client Feedback →
Inquiry CTA → Recent Writing → Footer. The section waits for evidence; the other
batches do not.

## Independent products and project storytelling

Selarik should be considered for a project story once Hani has material he wants
to share. Its purpose is to reveal his interests and judgment, not to claim a
new macOS development service. The owner chooses the story, media, and
publication timing. Do not invent app features or outcomes: public material has
not been inspected.

Maintain the current curated homepage selection until a published Selarik story
or another project warrants a deliberate selection change. Do not automatically
replace one of the current three because a new post exists.

Existing stories need changes only when Hani requests them or a factual/link
problem is identified. A summary, metrics block, or standardized commercial
narrative is not a prerequisite for publishing or featuring a project.

## Discovery and practical inquiry handling

The owner connects LinkedIn, Figma, and Upwork to the main site where profile
capabilities permit, then shares individual stories when there is a useful
insight. Profile edits and messages require a separate task; this plan does not
perform them. Preserve the platforms' role while keeping the website
independently understandable.

Use a direct case-study link when sharing a specific story. Optional UTMs may
distinguish external placements, using stable source/medium/content names
without personal identifiers. Do not tag internal links or set compulsory weekly
publishing/outreach quotas.

For received inquiries, keep a private minimal record: received date, source as
reported, requested help, next action/date, and outcome. Ask for missing project
context, timeline and budget when needed, without turning the website into a
qualification questionnaire. A call is useful when clarification warrants one,
not a compulsory gateway.

## Success and verification

Evaluate the site against its agreed purpose:

- Visibility: visitors arrive from professional profiles and shared work.
- Understanding: people explore project stories, About, and the CV; qualitative
  feedback indicates they understand Hani's capabilities. Pageviews alone do not
  prove understanding.
- Trust: actual feedback adds context and source links are accurate.
- Reachability: contact links work, inquiries reach the intended inbox, and
  people can start a conversation easily.
- Opportunity quality: resulting conversations fit the
  sustained-work-plus-selected-projects pattern, where available.

Keep the current event names stable and distinguish page/project metadata. Email
clicks are intent signals, not received leads or hires. Verify event delivery
after an authorized deployment, including mobile, keyboard and client-side
navigation; annotate deliberate smoke clicks.

Review periodically using raw visit/event/inquiry counts and qualitative
evidence. There is no fixed traffic target, conversion guarantee, or A/B-test
conclusion from small samples. Investigate contact friction or distribution
before adding more sections. A form is an optional later response to observed
friction, not assumed necessary now.

## Stop conditions and maintenance

- If source excerpts drift, reconcile changes before implementation; never reset
  user work.
- If verified quotes, career details, CV readiness, inbox confirmation, or
  account access are missing, defer only the dependent part and record it
  accurately.
- If a change requires modifying the external CV app, database schema, or
  content model, stop that scope expansion and define a separate task.
- If verification fails twice after a reasonable fix attempt, report the failure
  rather than broadening the change.
- Update availability when commitments change. Keep project selection explicit,
  review quotes sourced, and About history aligned with significant career
  changes.
- Preserve casual tone, personal writing, current CTA design, and Curious Me's
  Open Live Site link.
- No whole-site redesign, service catalog, forced niche, paid campaign, custom
  CRM, automated outreach, or inflated solo/product outcome claims in this plan.

## References

These are examples of presentation and inquiry structure, not evidence of
conversion rates:

- [Michael Pumo](https://michaelpumo.com/): availability, client feedback,
  personal work and inquiry guidance.
- [Ben Dodson](https://bendodson.com/): client experience and independent apps
  alongside consulting availability.
- [Prashant Sani](https://prashantsani.com/): expressive personal introduction
  and agency-oriented frontend work.
- [Dennis Snellenberg's work](https://dennissnellenberg.com/work): service
  contribution labels and an inquiry path after projects.
- [Clarence](https://theodorusclarence.com/) and [Benji](https://benji.org/):
  personal tone and professional context.
- [Umami event attributes](https://docs.umami.is/docs/track-events) and
  [UTM reporting](https://docs.umami.is/docs/utm): measurement mechanisms
  already compatible with the site.
