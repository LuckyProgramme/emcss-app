---
name: EMCSS Members App
colors:
  surface: '#1e331f'
  surface-dim: '#131408'
  surface-bright: '#393a2b'
  surface-container-lowest: '#0e0f04'
  surface-container-low: '#1b1c1c'
  surface-container: '#1f2113'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e4e2e1'
  on-surface-variant: '#c7c9ab'
  inverse-surface: '#e4e4ce'
  inverse-on-surface: '#303123'
  outline: '#919378'
  outline-variant: '#464832'
  surface-tint: '#bdd100'
  primary: '#e7ff04'
  on-primary: '#001c95'
  primary-container: '#d8ef00'
  on-primary-container: '#5f6a00'
  inverse-primary: '#5a6400'
  secondary: '#55a183'
  on-secondary: '#003828'
  secondary-container: '#046147'
  on-secondary-container: '#8cd9b8'
  tertiary: '#ffffff'
  on-tertiary: '#15353a'
  tertiary-container: '#c8e8ef'
  on-tertiary-container: '#4b696f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8ef00'
  primary-fixed-dim: '#bdd100'
  on-primary-fixed: '#1a1e00'
  on-primary-fixed-variant: '#434b00'
  secondary-fixed: '#a4f2d0'
  secondary-fixed-dim: '#89d6b5'
  on-secondary-fixed: '#002116'
  on-secondary-fixed-variant: '#00513b'
  tertiary-fixed: '#c8e8ef'
  tertiary-fixed-dim: '#acccd3'
  on-tertiary-fixed: '#001f24'
  on-tertiary-fixed-variant: '#2d4b51'
  background: '#131408'
  on-background: '#e4e4ce'
  surface-variant: '#343627'
  tertiary-text: '#adadad'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 3.5rem
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 2.5rem
    fontWeight: '700'
    lineHeight: '1.1'
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: '1.2'
  title-lg:
    fontFamily: Inter
    fontSize: 1.375rem
    fontWeight: '500'
    lineHeight: '1.4'
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Work Sans
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 0.25rem
  section-gap-lg: 4rem
  section-gap-xl: 5rem
  list-gap: 2rem
  container-padding: 2.5rem
---

# Design System: EMCSS Members App
## 1. Overview & Creative North Star
Our Creative North Star for the EMCSS Members App is **"The Vibrant Hub."** 
We are building a digital space that feels alive, energetic, and community-driven. Instead of a static directory, this system uses high-contrast greens, expressive motion, and layered depth to create a truly modern hangout. The experience should feel like flipping through a cutting-edge digital zine: punchy, welcoming, and brilliantly designed. By leaning into bold typography and sleek overlapping surfaces, we’re turning everyday community tools into a joyful, curated journey.
---
## 2. Colors & Surface Philosophy
Our color palette is rooted in a lush, high-contrast foundation. We use tonal depth to define our spaces, letting our vibrant greens do the talking!
### Color Palette Highlights
*   **Primary (The Spark):** `primary: #e7ff04` | `on_primary: #001c95`
*   **Secondary (Cool Accents):** `secondary: #55a183` | `on_secondary: #003828`
*   **Surface (Our Foundation):** `surface: #1e331f` | `on_surface: #e4e2e1`
*   **Tonal Variation:** `surface_container_low: #1b1c1c` | `surface_container_high: #2a2a2a`
### Ditch the Lines!
We prefer a clean, seamless look, which means we skip 1px solid borders for sectioning. 
Instead, we define boundaries beautifully through background color shifts. For example, dropping a `surface-container-low` section onto a `surface` background creates a clear, modern edge without the clutter.
### Surface Hierarchy & Nesting
Think of the UI as a stack of sleek, physical layers:
*   **Background:** `surface` (#1e331f) - *The deep green canvas.*
*   **Sectioning:** `surface_container_low` (#1b1c1c) - *The baseline structure.*
*   **Interactive Cards:** `surface_container_high` (#2a2a2a) - *Where the action happens.*
*   **Active Overlays:** `surface_container_highest` (#353535) - *Pop-ups and focus areas.*
### Glass & Gradients
To give the app that lively "Multimedia Computing" energy, we love using semi-transparent surfaces with a `backdrop-blur` of 12px-20px for floating navigation. For our main Call-to-Actions (CTAs), a subtle linear gradient (from `primary` to `primary_container`) adds a pulse of life that flat hex codes just can't match.
---
## 3. Typography: The Community Voice
Our typography pairs the bold, brutalist energy of **Space Grotesk** with the super-friendly readability of **Inter**.
| Level | Token | Font | Size | Character |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Space Grotesk | 3.5rem | High-impact, loud-and-proud headers. |
| **Headline**| `headline-md` | Space Grotesk | 1.75rem | Section titles; confident and clear. |
| **Title**   | `title-lg` | Inter | 1.375rem | Content headers and vibrant card titles. |
| **Body**    | `body-md` | Inter | 0.875rem | Standard reading text; modern and breezy. |
| **Label**   | `label-md` | Work Sans | 0.75rem | Badges, metadata, and snappy tags. |
**Styling Tip:** Give our labels a bit of breathing room with wide tracking (0.05em) for a polished, tech-forward aesthetic. Keep headline weights bold so they pop against our airy body copy!
---
## 4. Elevation & Depth
We make things stand out through **Tonal Layering** rather than heavy drop shadows.
### Stack It Up
We create depth by "stacking" our surface containers. Placing a `surface-container-lowest` element on a `surface-container-low` section creates a natural, soft "lift." 
### Ambient Glows
Shadows are saved exclusively for "floating" elements (like Modals) to give them a glowing, ambient vibe rather than a harsh outline:
*   **Blur:** 40px - 60px
*   **Opacity:** 4% - 8%
*   **Color:** Tinted with `on-surface` (#e4e2e1) to mimic soft, natural light.
### The "Ghost Border"
If a border is absolutely necessary for accessibility, we use our **Ghost Border**: the `outline-variant` token at 15% opacity. Heavy, 100% opaque borders just weigh our lively vibe down!
---
## 5. Components
### Buttons
*   **Primary:** Solid `primary` (neon green) background. Keep those sharp 0.25rem (Default) corners for a snappy, tech-forward edge. Use `on_primary` for text.
*   **Secondary:** Ghost-style using the "Ghost Border" and `primary` text.
*   **Hover States:** Let them glow! Shift the background one tier higher on hover (e.g., `primary` to `primary_fixed_dim`).
### Cards & Lists
*   **The Vibe:** Keep it flowing! No harsh divider lines.
*   **Execution:** Give list items breathing room using the `8` (2rem) spacing scale or subtle background color shifts.
*   **Member Cards:** Use `surface_container_low` for the card body. Add a fun `label-sm` tag in the top-right corner using a `secondary_container` fill to highlight member roles or status!
### Input Fields
*   **Text Inputs:** Keep them sleek. No bottom borders or full outlines—just a subtle `surface_container_high` fill. 
*   **Focus State:** When active, transition the background to `surface_variant` and add a snappy 2px `primary` accent line on the left-most edge to say, "We're ready for you!"
### Tags & Metadata
Use the `Work Sans` label font for metadata (e.g., "MEMBER SINCE: 2024"). Treat these like fun little stamps on the UI, using `tertiary` (#adadad) text at 0.75rem.
---
## 6. Do’s and Don’ts
### Do:
*   **Do** play with asymmetry! A header offset to the left while body copy sits centered creates great visual energy.
*   **Do** give content room to breathe using our `16` (4rem) and `20` (5rem) spacing scales.
*   **Do** use `backdrop-blur` to make scrolling navigation feel like magic.
*   **Do** treat metadata and small tags with love—they add so much character!
### Don't:
*   **Don't** rely on heavy "Card Shadows" to separate content. Let our beautiful color blocks do the work.
*   **Don't** use stark 100% black (#000000). Always stick to our rich `surface` (#1e331f) for that lush, deep background.
*   **Don't** over-round the corners. Stick to our snappy `0.25rem` (md) or `none` to keep the tech-forward feel intact.
*   **Don't** clutter the screen. If it feels busy, turn up the padding by 1.5x and let the design exhale!