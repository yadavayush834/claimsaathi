# ClaimSaathi design system

## Direction

ClaimSaathi should feel like a calm, capable companion sitting beside the citizen—not a government portal, a banking dashboard, or a marketing template. The interface uses quiet civic-blue structure, paper-like working surfaces, and marigold route markers to make the next action visible without creating urgency.

The signature element is the interactive claim route. On the landing page it lets a reviewer click through planning, preparation, tracking, and recovery. The same route language appears in planner progress, timelines, next-action panels, and status markers.

## Palette

| Token            | Hex       | Role                                      |
| ---------------- | --------- | ----------------------------------------- |
| Cloud canvas     | `#F4F6FB` | Quiet page background                     |
| Paper            | `#FFFFFF` | Primary working surface                   |
| Deep indigo ink  | `#101735` | Primary text and high-trust structure     |
| Companion violet | `#5B56D6` | Primary action and active route           |
| Marigold marker  | `#F2A23A` | Current step and human attention          |
| Assurance green  | `#27886D` | Completion, safety, and positive feedback |

Semantic information, warning, critical, muted, border, and focus tokens are defined in `src/styles/tokens.css`. Marigold uses dark ink rather than white text for accessible contrast.

## Typography

- **Display:** Bricolage Grotesque for the wordmark and short headings. Its uneven details give the product a human voice without becoming decorative.
- **Body:** DM Sans for instructions, labels, and longer explanations.
- **Utility:** IBM Plex Mono for amounts, references, policy metadata, and route labels.
- **Future Hindi:** Noto Sans Devanagari remains loaded for the dedicated language phase.

All fonts use `next/font`, are self-hosted by the build, and do not make browser requests to Google.

## Motion and interaction

- The landing hero has one orchestrated entrance; interior sections do not animate merely for decoration.
- The claim-route preview changes only after a citizen clicks a stage.
- Buttons have visible lift and press states; citizen cases behave like physical case files.
- Planner transitions reinforce progress without blocking input.
- `prefers-reduced-motion` removes animation and smooth scrolling.

## Accessibility and restraint

- Interactive controls keep a minimum practical touch height of 44 pixels.
- Keyboard focus uses a high-contrast indigo outline with offset.
- Status never depends on color alone; every state includes text and a marker.
- Fields keep labels, hints, and errors programmatically associated.
- The layout must not overflow at a 320-pixel viewport.
- Rounded shapes are reserved for working surfaces and controls; route lines, document slips, and borders carry the structure.
