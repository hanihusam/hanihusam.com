# Writing handoff — translating Instagram's navbar motion for the web

## Purpose

This document gives another Codex agent enough context to craft a publishable
post about the floating-navigation work on `hanihusam.com`. The intended outcome
is a thoughtful Design Engineer story, not a generic animation tutorial or a
claim that the site reproduces Instagram exactly.

## Central thesis

> Design engineering is not reproducing a reference. It is identifying the
> principle behind it, translating that principle into the product's own
> structure and constraints, testing it in context, and being willing to revise
> an elegant assumption when real use proves it wrong.

The strongest recent development is that real-device testing overturned an
earlier decision. We initially kept the navbar compact during indicator dragging
to avoid changing the gesture's coordinate system beneath the finger. On a real
phone, that technically safe choice made the interaction harder to perform. An
Instagram screen recording showed a better behavioral rule: interaction intent
overrides the passive compact state, so the navigation expands when the user
engages the active indicator.

The implementation then had to solve the original coordinate-risk problem rather
than avoiding it.

## Project references

- Site: <https://hanihusam.com>
- First navbar motion PR: <https://github.com/hanihusam/hanihusam.com/pull/160>
- Latest drag-polish PR: <https://github.com/hanihusam/hanihusam.com/pull/161>
- Latest implementation commit: `dc7dfc0` —
  `feat: refine navbar drag interaction`
- Latest branch: `codex/navbar-drag-polish`
- Reference recording:
  `/Users/hanihusam/Downloads/ScreenRecording_08-26-2026 06-43-17_1.MP4`
- Earlier decision plans:
  [navbar-motion plans](../plans/navbar-motion/README.md)

PR #160 is merged. PR #161 contains the latest compact-engagement and elastic
endpoint work and was open when this handoff was written.

## Product and visual direction

The site is a personal portfolio. Its motion should feel restrained, responsive,
and intentional. Instagram is a behavioral reference, not a visual target.

Explicit product preferences:

- Borrow the motion grammar, not Liquid Glass material.
- Do not add blur, refraction, glow, jelly effects, or decorative bounce.
- Keep the navbar's two stable scroll states rather than continuously scaling it
  with scroll progress.
- Do not collapse the navbar into a single item.
- Preserve reduced-motion behavior.
- Keep internal routes and external utilities semantically distinct.

## The story so far

### 1. The initial observation

The project began with a question: why does Instagram's floating mobile
navigation feel more physical than a conventional web navbar?

The useful observations were behavioral:

- The bar becomes smaller while content is being scrolled down and returns to
  full size when navigation needs attention.
- The active surface feels like one object from press through drag and release.
- The indicator tracks the finger directly.
- Gesture settlement is restrained and interruptible.
- The bar communicates its endpoints instead of letting the indicator appear to
  leak outside its container.

The desired result was never an Instagram clone. The task was to determine which
of those principles belonged on this portfolio.

### 2. The information architecture did not match Instagram

The original visible order was:

```text
Home · Projects · About · Substack | Theme
```

Only Home, Projects, and About were internal draggable routes. Substack is an
external link and Theme is an action. Presenting them as one continuous track
made Substack look like a possible drag destination.

The navigation was reorganized as:

```text
Home · Projects · About | Substack · Theme
```

The resulting model is:

- Primary route track: Home, Projects, About.
- Utility group: Substack, Theme.
- Divider: a fixed visual and semantic boundary.
- Drag-release can never navigate to Substack or activate Theme.

This is a deliberate product difference. Instagram can treat every visible tab
as part of one native navigation system. This website cannot safely treat an
external destination as another draggable route.

### 3. The first motion system

The first implementation established:

- Expanded navbar: `scale(1)`.
- Compact navbar: `scale(0.88)`.
- Scroll-scale transition: `200ms` with `[0.77, 0, 0.175, 1]`.
- Phone-only minimization below `640px`.
- Three route slots at `40px` each.
- Touch/pen dragging from the active indicator only.
- Direct position tracking while dragging.
- Release spring: stiffness `520`, damping `42`, mass `0.7`.
- Position-first release targeting so velocity cannot double-count distance and
  accidentally skip a route.
- An armed press state: `scale(1.06)`, `translateY(-1px)`, `150ms`, using
  `[0.25, 1, 0.5, 1]`.
- Reduced-motion branches that remove scale, lift, deformation, and springs.

The active icon already presses inward to `scale(0.97)`, while the armed
background grows outward. That contrast creates a small depth cue without a
material effect.

### 4. Edge leakage became a structural problem

The indicator originally used resisted overshoot but could paint beyond its
intended route track. On the right, that made it appear to enter the Substack
utility area.

The first fix kept `0.15` resistance and a maximum `6px` overshoot but clipped
the indicator background to the primary track. It prevented leakage, although
the plan explicitly noted that clipping might later be replaced with controlled
compression if real-device evidence showed it looked cropped.

That caveat became important later.

### 5. Floating controls needed one state owner

The globally mounted navbar could carry its compact state across route changes.
Programmatic scroll restoration then looked like user-driven navbar motion on
the destination page.

The minimization state moved into one shared floating-navigation owner:

- Route changes expand the controls synchronously with no tween.
- Scroll direction and accumulated distance reset on navigation.
- The next intentional scroll determines the next compact state.
- The work-detail TOC trigger and navbar consume the same minimized signal.
- Both controls share a `50px` expanded size and become approximately `44px` at
  `scale(0.88)`.
- Global smooth scrolling was removed; deliberate same-page TOC navigation calls
  reduced-motion-aware `scrollIntoView` explicitly.

This solved a motion problem by clarifying state ownership rather than tuning an
easing curve.

## The latest discovery: testing changed the decision

### The problem found on a real phone

After testing the implementation on mobile, dragging the indicator while the
navbar was compact felt difficult. The interactive route slots were visibly and
physically smaller, and the bar stayed small even after the user had clearly
expressed navigation intent.

Our earlier plan had explicitly said not to expand the navbar mid-gesture
because changing parent scale changes the coordinate system beneath the finger.
That was a legitimate engineering concern, but it produced the wrong interaction
outcome.

### Evidence from the Instagram recording

The supplied recording is approximately `18.9s` at `1206 × 2622`. Frame-by-frame
inspection showed two relevant behaviors. These are visual observations, not
claims about Instagram's internal implementation.

#### Compact engagement

Around `3.3–3.7s`, the compact bar expands as the active navigation surface is
engaged and dragging begins. Expansion and drag read as one continuous response.

The inferred rule is:

```text
compact → engage active indicator → expand → drag
```

The compact state expresses passive scroll context. Once the user directly
engages navigation, usability takes priority and the bar returns to full size.

#### Elastic endpoints

Around `5.2–5.4s` on the left and `10.0–10.5s` on the right, continued dragging
beyond the first or last item does not move the whole navigation structure
freely. Instead:

- The selected surface remains attached to the endpoint.
- Further movement is resisted and saturates.
- The active surface subtly yields toward the finger.
- The nearest outer edge appears to yield with it.
- Other icons remain nearly stationary.
- Reversing direction removes the deformation immediately.

The valuable principle is a rubber-band boundary: the interface acknowledges
continued force without implying that another destination exists.

## Latest decisions

### Decision 1 — interaction overrides minimization

When touch or pen presses the currently active route while the navbar is
compact:

- Expand the shared floating-navigation state from `0.88` to `1`.
- Use the existing `200ms` on-screen transition and `[0.77, 0, 0.175, 1]`
  easing.
- Arm the indicator at the same time using its existing `150ms` response.
- Keep the navbar expanded after release.
- Let the next intentional downward scroll minimize it again.

Inactive routes, Substack, Theme, and mouse input do not activate draggable
engagement.

The shared state adds an explicit `interaction` reason alongside `scroll`,
`focus`, and `route`.

### Decision 2 — solve coordinate continuity instead of avoiding expansion

The old drag calculation divided cumulative pointer offset by either `0.88` or
`1`. Switching that divisor during a gesture would create a jump.

The new implementation maps each pointer event through the primary track's live
rendered bounds:

1. Record where inside the active slot the pointer began.
2. Read the track's current `getBoundingClientRect()` while dragging.
3. Convert viewport `clientX` into the logical `120px` route-track space.
4. Subtract the recorded grab offset.
5. Update Motion values outside React render.

This keeps the indicator connected to the pointer while its parent is changing
scale. It is the technical resolution to the original design concern.

Relevant implementation:

- [navigation.tsx](../../app/components/navigation.tsx)
- [floating navigation state](../../app/hooks/useFloatingNavigationMotion.tsx)

### Decision 3 — make endpoint force visible as local deformation

The endpoint response now keeps the existing resistance constants:

```text
EDGE_RESISTANCE = 0.15
MAX_EDGE_OVERSHOOT = 6px
```

But positional travel clamps at Home or About. The resisted overshoot becomes a
normalized edge-pressure value instead of painted leakage.

The active indicator uses separate horizontal and vertical scale values:

- Armed: `scaleX(1.06) scaleY(1.06)`.
- Maximum edge pressure: `scaleX(1.075) scaleY(1.06)`.
- Left endpoint origin moves from center toward `100% 50%`.
- Right endpoint origin moves from center toward `0% 50%`.
- The final horizontal surface is approximately `43px`, a restrained `3px`
  extension from the logical `40px` slot.
- Reversing direction removes pressure directly.
- Release restores presence while route position uses the existing settlement
  spring.

The indicator background receives a `3px` visual gutter on both sides. At About,
that fits inside the existing `4px` space before the divider.

### Decision 4 — the divider does not animate

The divider remains completely static when the user keeps dragging right from
About.

It does not:

- Move or bend.
- Glow or change color.
- Pulse or vibrate.
- Pull Substack or Theme.

Animating it would imply that it is interactive or that another draggable
destination exists. The indicator supplies the feedback; the divider supplies
the rule.

### Decision 5 — do not stretch the complete shell

Instagram's draggable endpoints coincide with the ends of its tab system. This
site's right draggable endpoint is internal to a larger shell because Substack
and Theme follow it.

Stretching the whole shell would make utilities react to a gesture they do not
own. The adaptation therefore localizes deformation to the selected route
surface while keeping the route structure and utility group stationary.

This is another example of translating the interaction principle rather than
copying its literal geometry.

## Motion state summary

| State                 | Floating navigation             | Indicator                                                      |
| --------------------- | ------------------------------- | -------------------------------------------------------------- |
| Expanded resting      | `scale(1)`                      | `x` at active route, scale `1`                                 |
| Compact resting       | `scale(0.88)`                   | `x` at active route, scale `1`                                 |
| Active touch/pen down | Expand toward `1` over `200ms`  | `scaleX/Y(1.06)`, `y: -1px` over `150ms`                       |
| Dragging              | Hold expanded                   | Pointer maps directly through live track bounds                |
| Home edge pressure    | Hold expanded                   | Clamp `x`; scale X toward `1.075`; origin toward right edge    |
| About edge pressure   | Hold expanded                   | Clamp `x`; scale X toward `1.075`; origin toward left edge     |
| Release/cancel        | Stay expanded                   | Presence returns to rest; `x` settles with `520/42/0.7` spring |
| Route change          | Immediate `scale(1)` correction | Settle and align to destination route                          |
| Reduced motion        | Always `scale(1)`               | No lift, inflation, deformation, or spring movement            |

## What was deliberately rejected

- Liquid Glass styling.
- Blur, refraction, glow, or color effects.
- Jelly-like deformation or decorative bounce.
- A delayed long-press timer or context menu.
- Mouse dragging.
- Drag initiation from inactive routes or utilities.
- Drag-release navigation to the external Substack origin.
- Animated divider feedback.
- Whole-shell endpoint stretching.
- Interactive page swiping or content scrubbing.
- Continuous scroll-progress scaling.
- Preserving compact state across route changes.

## Design Engineering lessons worth emphasizing

### Motion exposed information architecture

The drag model revealed that Substack looked like a route even though it could
not safely behave like one. Fixing the animation required clarifying navigation
semantics and visual hierarchy.

### Motion exposed state ownership

The strange route-transition animation was not primarily an easing problem. It
was caused by locally owned compact state surviving across globally mounted
navigation. A shared state owner fixed the behavior.

### Physical feedback depends on boundaries

Resistance is not enough if its visual representation looks like clipping or
leakage. The user needs to perceive both continued force and a firm limit.

### Real-device evidence outranks a clean plan

Keeping scale fixed during drag was technically easy to reason about, but it
made the compact interaction harder. The final solution accepted the desirable
product behavior and did the engineering work needed to preserve coordinate
continuity.

### Restraint is part of implementation quality

The divider, utilities, and shell remain static because moving them would weaken
the interaction model. The result is not improved by maximizing the amount of
motion.

## Recommended post structure

### Opening

Begin with the mobile test, not with implementation details:

> I thought I had finished the navbar motion. Then I tried dragging it on my
> phone while it was compact.

That creates a concrete problem and establishes that the work was tested rather
than designed only in a desktop preview.

### Development

1. Explain the original goal: study Instagram's motion behavior without copying
   Liquid Glass.
2. Show why the first solution kept the navbar compact during dragging.
3. Describe what felt wrong on the phone.
4. Use the recording to show Instagram treating interaction as a reason to
   expand.
5. Explain the engineering tension: expanding the parent changes pointer
   coordinates.
6. Show the live-bounds mapping that resolved that tension.
7. Introduce endpoint pressure and explain why the divider stays static.
8. Close on translation, testing, and revision as Design Engineering practice.

### Closing idea

Potential closing line:

> The final motion is closer to Instagram in principle and more different from
> it in implementation—which is exactly what adapting a reference should
> produce.

Do not treat that sentence as mandatory copy. Preserve the idea if a different
line better matches Han's voice.

## Suggested visual evidence

The post will be stronger with concise evidence rather than many screenshots.

1. **Before clip:** compact navbar remains small while the indicator is dragged.
2. **Instagram reference clip:** crop around `3.3–3.7s` for expansion and either
   `5.2–5.4s` or `10.0–10.5s` for endpoint pressure.
3. **After clip:** compact press expands the navbar and drag continues without a
   jump.
4. **Endpoint clip:** hold beyond Home and About, reverse direction, then
   release.
5. **Small diagram:** viewport pointer coordinate → live track bounds → logical
   route coordinate → indicator Motion value.
6. **Structure diagram:** `Home · Projects · About | Substack · Theme`, labeling
   routes and utilities.

Avoid a long code walkthrough. One small coordinate-mapping excerpt and one
state diagram are enough to establish technical depth.

## Accuracy guardrails for the writer

- Do not claim the exact Instagram spring, scale, duration, or implementation is
  known. The recording supports visible behavior only.
- Do not say the project copied Instagram or recreated its navbar.
- Do not imply that Liquid Glass was implemented.
- Do not imply that all navbar items are draggable.
- Do not describe Substack as an internal route.
- Do not claim whole-shell rubber banding in this implementation; deformation is
  localized because utilities share the shell.
- Do not claim an automated test suite exists. The repository has no automated
  interaction tests.
- `npm run validate` passed for the latest implementation. Lint retains one
  unrelated existing unused `Paragraph` warning in
  `app/components/home/hero-section.tsx`.
- A final real-device feel check remains more meaningful than code inspection
  for the exact timing and strength of the interaction.
- `.DS_Store` cleanup was included in PR #161 as repository housekeeping but is
  not part of the Design Engineer story.

## Desired writing voice

- First person and reflective.
- Concrete rather than promotional.
- Technically credible without becoming a code tutorial.
- Comfortable admitting that the first decision was reasonable but incomplete.
- Emphasize observation, judgment, iteration, and restraint.
- Avoid generic phrases such as “delightful experience,” “pixel perfect,” or
  “seamless UX” unless the sentence demonstrates what they mean.
- Avoid presenting exact values as universal best practices; they are restrained
  choices for this product.

## Prompt for the receiving Codex agent

Use this handoff to help craft a publishable post positioning Han as a Design
Engineer. First identify the sharpest thesis and recommend a suitable format and
length. Then draft the post around the real-device discovery: a technically safe
choice made the compact drag harder, reference evidence changed the product
decision, and live coordinate mapping made the better interaction possible.

Keep Instagram as the opening reference, not the protagonist. The protagonist is
the process of translating motion into semantics, state ownership, gesture
geometry, accessibility, and product-specific restraint.
