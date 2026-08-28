# ClaimSaathi design system

## Direction

The interface borrows from a well-organized claim docket: clear sections, explicit status, durable typography, and a route that always shows where the citizen is. It avoids government insignia, portal mimicry, decorative gradients, and dashboard density.

The signature element is the connected claim-route line. It becomes a vertical rail on wider screens and a compact horizontal route on mobile, so progress remains visible without consuming the task area.

## Palette

| Token           | Hex       | Role                               |
| --------------- | --------- | ---------------------------------- |
| Canvas          | `#EDF3F7` | Quiet cool background              |
| Paper           | `#FFFFFF` | Primary working surface            |
| Ink             | `#13263F` | Primary text and structure         |
| Assurance teal  | `#0E5C61` | Primary action and completion      |
| Marigold signal | `#E4A72C` | Current step and focused attention |
| Critical brick  | `#A33B3B` | Errors and action-required state   |

Semantic success, information, warning, muted, border, and focus tokens are defined in `src/styles/tokens.css`. Marigold is never paired with white text; it uses dark ink for contrast.

## Typography

- **Display:** Anek Devanagari variable, used for brand and headings. Its Latin and Devanagari coverage gives the product an Indian typographic voice without imitating an official service.
- **Body:** Noto Sans Devanagari variable, used for controls and long-form guidance across English and future Hindi content.
- Both fonts are loaded through `next/font` and self-hosted by the application build.

## Interaction rules

- Controls have a minimum height of 46 pixels.
- Keyboard focus uses a high-contrast blue outline with offset.
- Status never depends on color alone; badges include text and a marker.
- Fields keep labels, hints, and errors programmatically associated.
- Motion is limited to short control feedback and disabled when reduced motion is requested.
- Layouts must not overflow at a 320-pixel viewport.
