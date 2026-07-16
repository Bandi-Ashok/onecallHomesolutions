---
name: Home Management Authority
colors:
  surface: '#f7fafc'
  surface-dim: '#d7dadc'
  surface-bright: '#f7fafc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f6'
  surface-container: '#ebeef0'
  surface-container-high: '#e5e9eb'
  surface-container-highest: '#e0e3e5'
  on-surface: '#181c1e'
  on-surface-variant: '#43474e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eef1f3'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f88'
  primary: '#002045'
  on-primary: '#ffffff'
  primary-container: '#1a365d'
  on-primary-container: '#86a0cd'
  inverse-primary: '#adc7f7'
  secondary: '#ad3035'
  on-secondary: '#ffffff'
  secondary-container: '#fe6c6b'
  on-secondary-container: '#6d0010'
  tertiary: '#002625'
  on-tertiary: '#ffffff'
  tertiary-container: '#003d3c'
  on-tertiary-container: '#4cadab'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#adc7f7'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#ffdad8'
  secondary-fixed-dim: '#ffb3b0'
  on-secondary-fixed: '#410006'
  on-secondary-fixed-variant: '#8c1620'
  tertiary-fixed: '#94f2f0'
  tertiary-fixed-dim: '#77d6d3'
  on-tertiary-fixed: '#00201f'
  on-tertiary-fixed-variant: '#00504e'
  background: '#f7fafc'
  on-background: '#181c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is anchored in the concept of "The Professional Guardian." It targets homeowners who value reliability, speed, and technical competence. The UI must evoke a sense of calm under pressure, particularly during home emergencies, while maintaining a sophisticated, modern aesthetic for routine property management.

The chosen style is **Corporate Modern with Tactile Clarity**. It utilizes a systematic approach to hierarchy, generous white space to reduce cognitive load during stressful situations, and high-contrast interactive elements. The aesthetic is clean and institutional, yet softened by intentional rounding to ensure the service feels approachable rather than cold.

## Colors

The palette is designed to establish immediate authority while providing clear visual cues for urgency and success.

- **Primary (Navy Blue):** Used for headers, primary navigation, and core brand elements to signal stability and institutional trust.
- **Secondary (Safety Red-Orange):** Reserved strictly for "Emergency" actions, alerts, and critical status updates. This color should be used sparingly to maintain its psychological impact.
- **Tertiary (Teal):** Used for "Action" elements, success states, and "Verified" status indicators. It provides a calming counterpoint to the primary navy.
- **Surface (Cool Grey/White):** A clean, architectural base that ensures the interface feels airy and organized. 
- **Functional Neutrals:** A range of greys from `#2D3748` (Text) to `#EDF2F7` (Borders) ensures high legibility and soft structural division.

## Typography

This design system employs a dual-font strategy to balance character with utility.

- **Headlines:** Montserrat is used for all service titles and major headings. Its geometric construction feels modern and confident. Use Bold (700) weights for primary headlines to anchor the page.
- **Body & UI:** Inter is used for all functional text, descriptions, and data. It provides exceptional legibility at small sizes, which is critical for service logs and pricing details.
- **Hierarchy:** Maintain a strict "Heading-Heavy" ratio. Large, bold titles should be paired with generous paragraph spacing to ensure the user can scan service options quickly.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid Grid** system. 

- **Desktop:** A 12-column grid with a 1280px max-width. Elements like service cards should span 3 or 4 columns to maintain readability.
- **Mobile:** A single-column layout with 16px side margins. Service cards transition to a vertical stack or a horizontally scrollable "carousel" for quick browsing.
- **Spacing Rhythm:** Based on an 8px baseline. Use 16px (2x) for internal component padding and 40px-64px (5x-8x) for section vertical spacing to evoke a premium, uncluttered feel.

## Elevation & Depth

To maintain a "trustworthy" and "clean" feel, depth is communicated through **Tonal Layers** and **Soft Ambient Shadows**.

- **Level 0 (Base):** `#F7FAFC` (Surface background).
- **Level 1 (Cards/Surface):** White `#FFFFFF` with a very soft, large-radius shadow (15% opacity Primary Color, 20px blur, 4px Y-offset). This makes service cards appear to "rest" lightly on the background.
- **Level 2 (Modals/Emergency Overlays):** White `#FFFFFF` with a more defined shadow to demand immediate attention.
- **Outlines:** Use 1px borders in `#E2E8F0` for secondary elements like input fields or inactive cards to keep the UI grounded without adding visual weight.

## Shapes

The design system uses a "Medium-Large" rounding logic. Standard components (Buttons, Inputs, Cards) use a **12px (`rounded-lg`)** corner radius. This specific radius is sharp enough to look professional but rounded enough to feel safe and modern.

Large containers or hero sections may use **24px (`rounded-xl`)** to create a distinct "encapsulated" look for specific service categories.

## Components

- **Buttons:** 
  - *Primary:* Navy background, white text, 12px radius. 
  - *Emergency:* Safety Orange background, bold weight. 
  - *Secondary:* Ghost style with Navy border and text.
- **Service Cards:** White background, Level 1 elevation, 12px padding. Must include a "Verified" badge in the top right corner using the Tertiary Teal color.
- **Verified Badges:** Small, pill-shaped chips with a teal background (10% opacity) and solid teal icon/text. Use for "TrustIcons" to certify contractors.
- **Input Fields:** 12px radius, 1px light grey border. On focus, the border transitions to Primary Navy with a soft outer glow.
- **Status Indicators:** Use circular dots or small chips. Green/Teal for "On Time," Orange for "Emergency Dispatch," and Navy for "Scheduled."
- **Trust Bar:** A specific component for the footer or below the hero section featuring grey-scale logos of insurance partners and certifications.