# 001 — Separate navbar routes from utilities

- **Commit:** 41a4b8d
- **Severity:** MEDIUM
- **Category:** Cohesion, hierarchy & spatial consistency
- **Estimated scope:** 2–3 files, ~60 lines

## Problem

The visible order is currently `Home · Projects · About · Substack | Theme`, but
only the first three items participate in the active indicator and drag model.
Substack therefore looks like a fourth draggable destination even though it is
an external utility link. This weakens the spatial boundary of the gesture and
lets right-edge indicator overshoot read as though Substack can be selected.

The outer landmark is also a `<nav>` containing the Theme action, which is not
navigation. The visual shell should contain a primary navigation landmark and a
separate utility group.

## Where

| File                                    | Lines   | What's there                                                          |
| --------------------------------------- | ------- | --------------------------------------------------------------------- |
| `app/components/navigation.tsx`         | 20–42   | Three internal routes and one separately declared external link       |
| `app/components/navigation.tsx`         | 190–237 | Primary links, Substack, divider, and Theme inside one `<motion.nav>` |
| `app/components/ui/navigation-item.tsx` | 13–64   | Every item renders as a React Router `NavLink`                        |

### Current code

```tsx
// app/components/navigation.tsx:222
{routeLinks.map((link) => (
	<NavigationItem key={link.href} href={link.href} label={link.label}>
		<link.icon className="size-5" />
	</NavigationItem>
))}

<NavigationItem href={substackLink.href} label={substackLink.label}>
	<substackLink.icon className="size-5" />
</NavigationItem>

<div className="h-11 w-px bg-(--border-primary) transition-colors" />

<ThemeSwitcher />
```

## Target

The visual and semantic order must be:

```text
Home · Projects · About | Substack · Theme
```

Use this structure:

```tsx
<motion.div /* floating visual shell and scroll-scale motion */>
	<nav aria-label="Primary">
		{/* draggable route track: Home, Projects, About only */}
	</nav>

	<div aria-hidden className="h-11 w-px bg-(--border-primary)" />

	<div aria-label="Utilities" className="flex items-center">
		<ExternalNavigationItem
			href="https://bapak2dev.substack.com/"
			label="Substack"
		/>
		<ThemeSwitcher />
	</div>
</motion.div>
```

`ExternalNavigationItem` must render a native `<a href>` rather than a
`NavLink`. Keep same-tab navigation by default; being external is not sufficient
reason to force a new tab. If product direction later chooses `target="_blank"`,
also add `rel="noreferrer"` and expose “opens in a new tab” in the accessible
label.

Substack and Theme must not be included in `routeLinks`, `activeIndex`,
`MAX_INDICATOR_X`, pointer-index calculations, velocity targeting, or the
indicator mask.

## Conventions to follow

- UI components are one component per file with named exports; follow
  `docs/agents/code-style.md`.
- Reuse the tooltip structure and `size-10` visual rhythm from
  `app/components/ui/navigation-item.tsx`.
- Use `clsxm` for composed classes.
- Keep all colors on existing theme tokens.

## Steps

1. Change the outer animated landmark in `app/components/navigation.tsx` from
   `<motion.nav>` to `<motion.div>` without changing its fixed position, size,
   scroll-scale transition, or transform origin.
2. Wrap the three-item draggable track in `<nav aria-label="Primary">`.
3. Move the existing divider so it appears immediately after the primary nav.
4. Add a named `ExternalNavigationItem` component under `app/components/ui/`
   that renders a native anchor and reuses the existing tooltip, icon color,
   focus, and `scale(0.97)` press feedback.
5. Render Substack first in the utility group and Theme last.
6. Confirm the draggable route constants still derive exclusively from the three
   internal routes.

## Out of scope

- Do not add an external-arrow icon to the compact navbar.
- Do not open Substack in a new tab unless explicitly requested later.
- Do not change the route order `Home → Projects → About`.
- Do not add Liquid Glass material, blur, refraction, or color changes.
- Do not change navbar dimensions or bottom positioning.

## Verification

**Build**

- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes with no new warnings.
- [ ] `npm run format:check` passes.

**Behavior**

- [ ] Accessibility inspection shows one “Primary” nav landmark containing only
      Home, Projects, and About.
- [ ] Substack renders as a native external anchor and Theme remains a button.
- [ ] Dragging right from About cannot select or navigate to Substack.
- [ ] Keyboard focus order is Home, Projects, About, Substack, Theme.

**Feel**

- [ ] At a glance, the divider makes the three draggable destinations read as
      one track and Substack/Theme as utilities.
- [ ] Test at 390px and 1280px; the grouping must remain legible without making
      the navbar look wider or heavier.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

Instagram can treat every item in its primary tab bar as one continuous
navigation system. This project cannot do that with Substack because a drag
release should never unexpectedly eject the user to another origin. The visual
divider is therefore a deliberate product difference, not a failure to copy the
reference.
