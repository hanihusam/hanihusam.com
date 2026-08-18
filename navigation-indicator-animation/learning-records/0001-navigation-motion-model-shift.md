# Active navigation is a sequence, not a hover preview

The learner replaced the earlier two-background model with distinct icon states
and one persistent active background: inactive icons are dim, hover or
keyboard-visible focus brightens only the icon, and route activation moves the
background before applying active icon color. Hover has precedence, so a bright
hovered icon never dims just to replay the active delay.

## Evidence

The learner described the revised state model on 2026-08-18 and explicitly
confirmed the hover-precedence behavior after its click-sequencing conflict was
identified.

## Implications

Future lessons should teach route sequencing and CSS transition delay, not a
traveling hover-preview layer.
