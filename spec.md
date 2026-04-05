# QuickFix Services

## Current State
A single-page landing app with a sticky navbar, hero section, service cards grid, how-it-works, testimonials, contact CTA, and footer. Services are displayed as a grid in a dedicated section. There is no side navigation for filtering/navigating by service type.

## Requested Changes (Diff)

### Add
- A persistent collapsible side menu (left sidebar) listing all 5 service types (Plumber, Electrician, Carpenter, AC Repair, Cleaning Services)
- Each side menu item, when clicked, scrolls the page to a dedicated per-service detail section and highlights the active service
- Per-service expanded sections below (or replacing) the current grid: each service gets its own anchor-linked section with its description and a Book Now button
- A toggle button to open/close the sidebar on mobile

### Modify
- The services section layout: wrap content in a two-column layout on desktop (left = sidebar, right = service detail area)
- Active sidebar item is highlighted to indicate the current/selected service
- Clicking a sidebar item scrolls to or reveals that service's section

### Remove
- Nothing removed; the service cards grid is replaced by the sidebar + detail view within the services section

## Implementation Plan
1. Add `activeService` state to track which service is currently selected/in-view (default to first service)
2. Build a `ServiceSidebar` component rendering all services as clickable items
3. Build a `ServiceDetail` component that shows expanded info for the active service
4. Refactor the services section into a two-panel layout: sidebar on the left, detail on the right
5. On sidebar item click: set `activeService` and scroll to the services section
6. On mobile: sidebar is collapsible with a toggle button
7. Keep existing booking flow (openBooking) wired to the detail section Book Now button
