---
description: Design and implement polished, responsive PetsHUB admin
  interfaces using a professional red-and-white visual system,
  high-contrast cards, refined typography, and pet-shop/clinic
  workflows. Use when building or improving PetsHUB dashboard, bookings,
  products, inventory, broadcasts, or related admin screens.
name: petshub-red-white-ui
---

# PetsHUB UI Design Skill

## Goal

Create a clean, professional pet-care admin interface that feels like a
real product---not a generic AI-generated dashboard. Use the supplied
PetsHUB references as visual direction, not as a rigid screenshot to
copy.

Priorities: 1. Clear information hierarchy. 2. Visible contrast between
page background and cards. 3. Readable typography at mobile sizes. 4.
Consistent red-and-white branding. 5. Practical, scannable admin
workflows. 6. Responsive behavior across mobile, tablet, and desktop.

## Visual Direction

-   Brand personality: friendly, trustworthy, modern, practical.
-   Core palette: vivid PetsHUB red, white, warm off-white, pale neutral
    gray, and dark charcoal.
-   Use red for primary actions, active navigation, key prices,
    important icons, and selected states---not for every element.
-   Use green for confirmed/success/in-stock states, amber for pending
    states, and soft red for low-stock or destructive states.
-   Avoid making every card the same pale red. Use neutral white cards
    against a clearly different light-gray or warm-gray page background.
-   Keep the UI airy but information-dense enough for a shop admin.

## Color Tokens

Use these as starting tokens; adjust only when the existing project
already has an established brand palette.

``` css
:root {
  --brand-red: #E51E2A;
  --brand-red-hover: #C91722;
  --brand-red-soft: #FDEBED;
  --page-bg: #F3F4F6;
  --surface: #FFFFFF;
  --surface-muted: #F8F8FA;
  --border: #E2E4E8;
  --text-primary: #17191F;
  --text-secondary: #626B78;
  --text-muted: #8A929D;
  --success: #16803D;
  --success-bg: #E5F7EC;
  --warning: #A95B00;
  --warning-bg: #FFF1D6;
  --danger: #D71920;
  --danger-bg: #FDE8E9;
}
```

### Contrast rules

-   Main page background: `#F3F4F6` or a similarly visible cool/warm
    light gray.
-   Cards and main content surfaces: `#FFFFFF`.
-   Card border: subtle but visible `#E2E4E8`.
-   Optional card shadow: very light and restrained.
-   Soft red backgrounds should be reserved for selected cards, icon
    containers, alerts, or highlighted sections.
-   Do not use white cards on a pure-white page without borders or
    shadows; they will visually merge.
-   Do not use pale red for every card; the overall page will look
    washed out.
-   Maintain readable contrast for small labels and status text.

## Typography

Prefer **Inter** as the single UI font family. Manrope is an acceptable
alternative if already used consistently. Do not mix multiple font
families without a strong reason.

Suggested hierarchy: - Page title: 24--28px, weight 700--800,
line-height 1.2. - Section heading: 18--20px, weight 700. - Card
title/product name: 14--16px, weight 600--700. - Body text: 14--15px,
weight 400--500, line-height 1.45--1.6. - Labels and metadata: 12--13px,
weight 400--500. - Price: 18--20px, weight 700--800, brand red. -
Buttons: 14px, weight 600. - Avoid ultra-light weights, overly condensed
fonts, and tiny low-contrast labels. - Use tabular numerals for prices,
counts, and other values where supported. - Do not make every text
element bold; use weight to establish hierarchy.

## Layout and Spacing

Use a consistent spacing scale based on 4px: - 4px: icon/text
micro-gap. - 8px: compact control spacing. - 12px: related content
spacing. - 16px: standard card padding and section gaps. - 20--24px:
major section spacing. - 28--32px: page-level separation on larger
screens.

Recommended geometry: - Card radius: 14--18px. - Input/button radius:
10--14px. - Pill radius: fully rounded for filters and status chips. -
Borders: 1px solid neutral border. - Shadows: subtle, never heavy or
glowing. - Align card edges, titles, prices, and action rows
consistently. - Use consistent image ratios within the same product
grid. - Avoid unnecessary nested cards and excessive rounded containers.

## Shared App Shell

### Header

-   PetsHUB logo/wordmark on the left.
-   Compact `ADMIN` badge beside the brand when space allows.
-   Notification icon with a small red count badge.
-   Logout icon/action on the right.
-   Keep header height compact and align all elements vertically.
-   On narrow screens, prevent the logo, badge, and actions from
    colliding.

### Bottom navigation

Use four primary destinations: - Dashboard - Bookings - Products -
Broadcasts

Rules: - Use consistent outline icons. - Active destination uses brand
red and a soft-red background or indicator. - Inactive destinations use
dark gray. - Keep labels legible and tap targets comfortable. - Respect
mobile safe areas and ensure content is not hidden behind navigation.

## Dashboard Screen

### Summary cards

Use a 2-column grid on mobile where space allows: - Today's Schedule -
Pending Requests - Confirmed Bookings - Registered Owners

Each card should contain: - A small icon in a soft semantic-color
container. - A prominent numeric value. - A short label. - Optional
concise supporting status.

Visual rules: - Cards are white on the gray page background. - Use a
subtle border and restrained shadow. - Use soft red selectively; use
green for confirmed/success. - Keep card heights and internal spacing
consistent. - Do not let decorative icons overpower the metric.

### Appointment list

Each appointment card should present information in this order: 1. Pet
name and animal type, optionally with a small pet avatar. 2. Status
badge: Pending, Confirmed, or another valid state. 3. Service name. 4.
Owner name and contact details. 5. Date/time and price. 6. Optional
note. 7. Relevant actions, such as Approve and Decline.

Rules: - Make status visible without relying on color alone; include
text. - Primary action uses solid red or a contextually appropriate
success color. - Destructive/decline action uses a white surface with
red border/text. - Keep appointment details scannable; avoid long
unbroken rows. - Do not show Approve/Decline actions on
already-confirmed appointments unless the workflow requires them.

## Inventory Screen

### Search and category filters

-   Search input should be prominent and full-width when practical.
-   Add a separate filter control only if it opens useful filters.
-   Use horizontally scrollable filter chips on small screens.
-   Selected filter: solid brand red with white text.
-   Unselected filters: white surface, subtle border, dark text.
-   Category icons are optional; keep their style and size consistent.

### Product cards

Use a clean grid: - Two columns on typical mobile widths when product
details remain readable. - One column on very narrow screens if
necessary. - Three or more columns on larger screens based on available
width.

Product card structure: 1. Product image with consistent aspect ratio
and object-fit behavior. 2. Product category or concise metadata. 3.
Product name, clamped to a sensible number of lines. 4. Price, visually
prominent in red. 5. Stock status chip. 6. Clear edit/delete actions;
avoid ambiguous icon-only controls without accessible labels.

Rules: - Product images should fill their image area without
distortion. - Use white card surfaces against the gray page
background. - Keep product title, price, stock, and actions aligned
consistently. - Use green for In Stock, amber for Pending/limited stock
where appropriate, and red for Low Stock/Out of Stock. - Keep
destructive delete action visually distinct from edit. - A floating Add
Product button may use solid red with a clear plus icon. Ensure it does
not cover product details or bottom navigation. - For a list-style
inventory variant, use small product thumbnails and clear rows with
name, category, price, stock, and overflow actions.

### Promotional banner

-   Optional; do not let it dominate the actual inventory controls.
-   Use a restrained pale-red/pink background with pet imagery.
-   Keep headline short, supporting text concise, and CTA obvious.
-   Ensure text contrast remains strong over the background.
-   Do not place essential inventory actions only inside a
    carousel/banner.

## Buttons and Controls

-   Primary: brand-red fill, white text, clear hover/pressed state.
-   Secondary: white or neutral surface with a visible border.
-   Destructive: red text/icon; use confirmation for consequential
    deletion.
-   Disabled: visibly disabled, but still legible.
-   Provide loading, success, empty, and error states where relevant.
-   Use consistent button heights and icon alignment.
-   Do not rely on color alone to communicate status or action.

## Responsive Behavior

### Mobile

-   Prioritize one-handed operation and clear tap targets.
-   Keep primary actions visible and avoid horizontal overflow.
-   Use 2-column metric cards and product grids only when content fits
    comfortably.
-   Allow filter chips to scroll horizontally.
-   Add bottom padding for fixed navigation.

### Tablet/Desktop

-   Expand grids progressively instead of stretching mobile cards.
-   Use a sidebar or wider navigation only if consistent with the
    existing application.
-   Constrain content width on very wide screens.
-   Keep form fields, tables, and card alignment consistent.
-   Do not simply scale the mobile screen up; adapt the layout to the
    viewport.

## Accessibility and Interaction

-   Use semantic headings in the correct order.
-   Give icon-only buttons accessible names/tooltips.
-   Maintain keyboard focus visibility.
-   Ensure touch targets are approximately 44px where practical.
-   Preserve sufficient contrast for text, controls, and borders.
-   Status must include readable text, not color alone.
-   Provide confirmation for destructive actions and clear feedback
    after saves/deletes.
-   Forms should show validation near the relevant field.

## Implementation Rules

-   First inspect the existing codebase, components, routes, and styling
    conventions.
-   Reuse the existing framework and component library where possible.
-   Do not rewrite business logic, routes, API contracts, or data models
    just to change the UI.
-   Preserve existing functionality while improving layout and visual
    hierarchy.
-   Build reusable components for metric cards, status badges,
    appointment cards, product cards, filter chips, and navigation.
-   Keep design tokens centralized.
-   Avoid unnecessary dependencies and animations.
-   Use restrained transitions only when they improve feedback; no
    distracting motion.
-   Use realistic data shapes and handle long product names, missing
    images, empty lists, and low-stock states.
-   Do not invent working features that the backend does not support.
-   Never use placeholder images that are unrelated to the product
    category.
-   Verify at minimum: narrow mobile width, standard mobile width,
    tablet width, and desktop width.

## Quality Checklist

Before considering the UI complete, verify: - \[ \] Cards visibly
contrast with the page background. - \[ \] The page background is not
indistinguishable from card surfaces. - \[ \] Red is used as an accent,
not applied indiscriminately. - \[ \] Typography has a clear hierarchy
and remains readable. - \[ \] Product images use consistent dimensions
and are not distorted. - \[ \] Prices and stock statuses are easy to
scan. - \[ \] Appointment status and actions are clear. - \[ \] Mobile
navigation does not cover content. - \[ \] No horizontal overflow exists
at mobile widths. - \[ \] Loading, empty, error, and destructive-action
states are handled. - \[ \] Existing application logic and navigation
remain intact.
