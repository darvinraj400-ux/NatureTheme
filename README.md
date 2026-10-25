# 🌿 Nature & Sustainability

**A Field Guide to Living with Nature**

An immersive, beautifully crafted website that helps people reconnect with nature and discover practical ways to live more thoughtfully. The experience combines the beauty of a botanical field guide, the atmosphere of a nature journal, the usefulness of a practical sustainability resource, and the clarity of a modern interactive website.

> *"Closer to nature. Lighter on the earth."*

---

## ✨ Features

### Core Experience
- **Immersive Hero** — Full-screen forest canopy with editorial typography and animated scroll cue
- **Nature Discovery Strip** — Botanical observation gallery with 6 curated natural details
- **Guiding Principles** — Three philosophical pillars: Notice More, Use What You Have, Grow at Your Own Pace

### Interactive Tools
- **Field Guide Library** — 18 searchable, filterable practical guides across 8 categories
  - Search by title and description
  - Filter by category, difficulty, and sort order
  - Detailed modal views with step-by-step instructions, safety notes, and related guides
  - Bookmark/save functionality with local persistence
- **Habit Planner** — 3-step interactive weekly routine builder
  - Preference questionnaire (area, time, style, focus)
  - Personalized recommendations based on answers
  - Day-by-day scheduling with completion tracking
  - Progress visualization with undo/reset controls
- **Impact Explorer** — Educational calculator for 5 activity types
  - Transparent assumptions and limitations
  - Honest framing (activity tracking, not environmental measurement)
  - No fabricated coefficients or misleading statistics
- **Nature Journal** — Personal field notebook
  - Create, edit, and delete entries
  - Categories and mood tags
  - Local storage with clear-all option
  - Privacy-first: nothing uploaded or shared

### Content Sections
- **Seasonal Collections** — 6 themed guide collections (Forest Floor, Kitchen Garden, Water & Weather, Keep It Growing, Everyday Wild, Mindful Consumption)
- **Field Note of the Day** — Deterministic daily observation from curated dataset
- **Editorial Journal** — 4 long-form articles with practical takeaways
- **Our Approach** — Philosophy and values statement
- **Newsletter Signup** — Demo form with validation and honest disclosure

---

## 🎨 Design System

### Color Palette
Nature-inspired tokens drawn from forest floors, foliage, soil, water, stone, and botanical specimens:

| Token | Hex | Usage |
|-------|-----|-------|
| Canopy Green | `#203F32` | Primary brand, immersive sections |
| Deep Forest | `#172C23` | Dark backgrounds, footer |
| Fern | `#52775A` | Interactive elements, links |
| Moss | `#7C9167` | Secondary accents |
| Soft Sage | `#B8C7A5` | Highlights, CTAs on dark |
| Lichen | `#D8DDC6` | Borders, subtle backgrounds |
| Mist | `#E8EDE5` | Light section backgrounds |
| River Blue | `#779B9A` | Visual contrast |
| Earth Clay | `#B7795B` | Warm accents, warnings |
| Warm Sand | `#D8C7A7` | Neutral warmth |
| Bark Brown | `#554438` | Dark text on light |
| Natural Paper | `#F5F1E7` | Editorial content base |
| Ink | `#272E28` | Primary text |

### Typography
- **Display:** Playfair Display (editorial serif for headlines)
- **Body:** Inter (clean sans-serif for interface and content)
- **Field Notes:** JetBrains Mono (monospaced for metadata, labels, annotations)

### Visual Motifs
- Botanical line illustrations (SVG)
- Growth rings and organic circular frames
- Contour-line patterns
- Pressed-flower compositions
- Paper and forest textures (CSS-based)
- Notebook lines for planner sections
- Tree ring patterns for impact explorer

### Motion Design
- Framer Motion for purposeful, organic animations
- Fade-in-up entrances on scroll
- Staggered guide card reveals
- Gentle hover transitions
- Respects `prefers-reduced-motion`

---

## 🛠 Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type safety
- **Vite** — Build tool and dev server
- **Tailwind CSS v4** — Utility-first styling with custom theme
- **Framer Motion** — Animation library
- **Lucide React** — Consistent iconography
- **LocalStorage** — Client-side persistence (no backend required)

---

## 📦 Installation & Development

### Prerequisites
- Node.js 18+ and npm

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck
```

The dev server runs at `http://localhost:3000`

---

## 🏗 Architecture

```
src/
├── App.tsx                 # Main application with all sections
├── main.tsx               # Entry point
├── index.css              # Design system, tokens, animations
├── data/
│   └── content.ts         # All content data (guides, collections, articles, etc.)
└── lib/
    ├── persistence.ts     # LocalStorage wrapper with error handling
    └── calculations.ts    # Impact explorer calculation engine
```

### Data Layer
- **Field Guides** — 18 structured entries with full practical content
- **Collections** — 6 themed groupings with curated guide selections
- **Field Notes** — 7 daily observations (deterministic by date)
- **Journal Articles** — 4 long-form editorial pieces
- **Impact Activities** — 5 calculable activities with transparent formulas

### State Management
- React `useState` for component state
- `useEffect` for localStorage synchronization
- `useCallback` for memoized handlers
- No external state library (Redux, Zustand, etc.)

### Persistence
All user data stored locally via `localStorage`:
- Saved guides (`saved_guides`)
- Habit plan (`habit_plan`)
- Journal entries (`journal_entries`)

**Privacy:** Nothing is uploaded or shared. All data stays in the user's browser.

---

## ♿ Accessibility

- Skip-to-content link
- Semantic HTML with proper heading hierarchy
- ARIA labels for icon buttons and controls
- Keyboard navigation throughout
- Visible focus indicators
- Form labels and validation messages
- Escape key closes modals
- Focus management in dialogs
- Reduced motion support
- Color is never the sole indicator of state
- Alt text for informative images, `aria-hidden` for decorative

---

## 📱 Responsive Design

Mobile-first approach with breakpoints at:
- 320px, 360px, 375px, 390px, 430px (mobile)
- 768px (tablet)
- 1024px, 1280px, 1440px+ (desktop)

### Mobile Adaptations
- Compact navigation with slide-in menu
- Touch-friendly targets (minimum 44px)
- Stacked layouts for multi-column desktop designs
- Accessible filter panels
- Readable typography at small sizes
- No horizontal overflow

---

## 🌱 Content Philosophy

### What We Do
- Provide practical, actionable guidance
- Acknowledge uncertainty and limitations
- Distinguish between activity tracking and measured environmental outcomes
- Respect local conditions and circumstances
- Encourage curiosity over judgment

### What We Don't Do
- Claim carbon neutrality or zero-waste certification
- Fabricate environmental statistics
- Prescribe identical behaviors for everyone
- Use guilt or shame as motivators
- Upload or share personal data

---

## 🔒 Privacy & Data

- **No backend required** — fully client-side
- **No analytics or tracking**
- **No cookies** (beyond browser storage for user preferences)
- **No third-party data collection**
- **Local storage only** — users can clear data via browser settings
- **No account system** — no personal information collected

---

## 📄 License

This project is provided as-is for educational and demonstration purposes.

---

## 🙏 Acknowledgments

Built with care for the living world. Inspired by botanical field guides, nature journals, and the quiet beauty of paying attention to the natural world around us.

---

## 🌍 Core User Journey

**Notice the natural world → Discover a practical idea → Learn how it works → Add it to a personal plan → Build a habit over time.**

---

*Observe · Learn · Grow*
