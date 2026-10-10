# Plans

| Plan                                                                  | Status                                                |
| --------------------------------------------------------------------- | ----------------------------------------------------- |
| [Professional home and freelance pipeline](001-freelance-pipeline.md) | Batches 0–2 implemented locally; verification pending |
| [OG image migration](og-image-migration.md)                           | Shipped and verified in production                    |

## Professional home and freelance pipeline

Revised on 2026-10-10 against commit `fb76262` and the current uncommitted
working tree after clarifying the website's purpose and reviewing the updated
homepage design with Hani.

> A personal professional home where people can explore my projects, products,
> writing, and experience, understand how I think and work, and easily reach me
> about freelance or contract opportunities.

| Batch | Work                                                                              | Status              | Dependencies                              |
| ----- | --------------------------------------------------------------------------------- | ------------------- | ----------------------------------------- |
| 0     | Curated projects, mobile visibility, roles, shared CTA, click attributes, spacing | Implemented locally | Production verification pending           |
| 1     | Availability and secondary profile links                                          | Implemented locally | Manual visual / production checks pending |
| 2     | Case-study closing, writing styles, and About contact                             | Implemented locally | Browser / production checks pending       |
| 3     | Compact About career overview and CV link                                         | Deferred by owner   | Hani's online résumé update               |
| 4     | Two or three genuine Upwork reviews                                               | Pending content     | Exact review text and attribution         |
| 5     | Connect professional profiles and share project stories                           | Owner-operated      | Site live and contact working             |
| 6     | Verify and review visibility, exploration, and inquiries                          | Ongoing             | Deployment/analytics access               |

Full instructions, bounded file scopes, verification gates, and maintenance
notes are in [the plan](001-freelance-pipeline.md). Batches 0–2 are implemented
locally; browser and production verification remain pending independently of
reviews and career material.

The updated Figma reference and completed design changes are recorded in the
plan. All six homepage frames now use the agreed project order, show all three
projects, and include role text; mobile has the hero inquiry button. Batch 3 is
explicitly deferred until Hani updates the online résumé. Batch 1 is implemented
locally with availability, footer profiles/location/time, and the homepage copy
and spacing adjustments. Batch 2 adds the compact project closing, writing
styles, and direct About email option. Code checks and rendered HTML pass;
manual visual and interaction checks remain pending because native browser
inspection stalled.

## Pull requests

The completed work is split into standalone proposals against `main`:

- [#179 — About contact](https://github.com/hanihusam/hanihusam.com/pull/179)
- [#180 — Footer and profiles](https://github.com/hanihusam/hanihusam.com/pull/180)
- [#181 — Homepage](https://github.com/hanihusam/hanihusam.com/pull/181)
- [#182 — Case studies](https://github.com/hanihusam/hanihusam.com/pull/182)
- Documentation/release maintenance: `chore/docs-and-release-config`

Each branch passes independent validation and formatting. Website branches also
pass isolated rendered-route checks. They remain drafts for browser visual and
interaction verification; they are not deployed. About links and the hydrated
footer clock were observed through browser accessibility inspection, but native
window controls prevented completion of the remaining checks. Full evidence and
scope ownership are recorded in the plan's PR split section.

## Decisions preserved

- Casual personal voice and authored project highlights; no service catalog or
  forced commercial rewrite.
- Current availability: “Open to freelance & contract work.”
- Sustained product/team work plus selected shorter projects; Hani remains the
  client contact and responsible for delivery.
- The main site stands on its own; Upwork is a secondary link and review source.
- Compact history on About; detailed record planned at `cv.hanihusam.com`.
- Existing Works-page CTA design and Curious Me's Open Live Site link.
- Independent products and writing support the professional story; content
  remains projects-only.

## Superseded recommendations

The original sales-funnel-first direction, compulsory buyer/service positioning,
standardized case-study rewrites, and weekly outreach quotas were replaced by
the agreed professional-home purpose. Mandatory contact forms, custom CRM, paid
campaigns, and removing personal writing remain deferred without evidence of
need.
