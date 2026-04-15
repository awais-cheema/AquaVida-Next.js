# AquaVida Design System: Floating Glassmorphism

This document defines the visual language and core design tokens for AquaVida. All new components must adhere to these standards to maintain a consistent, premium, and ultra-high-performance user experience.

---

## 🎨 Color Palette
Our palette blends deep oceanic blues with architectural gold and organic greens.

| Role | Hex | Name | Use Case |
| :--- | :--- | :--- | :--- |
| **Primary Deep** | `#0A447A` | Midnight Ocean | Tooltips, card overlays, deep gradients. |
| **Primary Brand** | `#0D5699` | Aqua Blue | Main accents, active states, button hovering. |
| **Accent Gold** | `#91792C` | Deep Brass | Premium detailing, borders, icons. |
| **Accent Gold 2** | `#A68A33` | Luminous Gold | Glow effects, text highlights, CTAs. |
| **Secondary Green** | `#63B589` | Emerald Reef | Success states, nature/organic highlights. |

### Global Background
- **Dark Mode Only**: All backgrounds should use a "True Dark" or "Near Black" base: `#0D0A07` or `linear-gradient(to bottom, #0D0A07, #0A447A)`.

---

## 🧊 Glassmorphism Specification
The "Floating" effect is achieved through high-index backdrop blurs and subtle translucent borders.

### 1. The Container
- **Background**: `rgba(255, 255, 255, 0.03)` to `rgba(13, 86, 153, 0.05)`.
- **Backdrop Blur**: `12px` to `24px` (depending on depth).
- **Border**: `1px solid rgba(255, 255, 255, 0.1)` or `rgba(145, 121, 44, 0.2)` (Gold tint).
- **Corner Radius**: `24px` (Large) for cards, `12px` (Medium) for UI elements.

### 2. The Depth (Shadows)
- **Floating Effect**: Use layered shadows to simulate height.
- **Token**: `0 20px 50px rgba(0, 0, 0, 0.5)` + `0 0 0 1px rgba(255, 255, 255, 0.05)`.

---

## Typography
- **Primary Font**: **Allomira** (Variable).
- **Weight**: 
  - `100` (Thin) for atmospheric labels.
  - `400` (Regular) for body text.
  - `700` (Bold) for headings.
- **Letter Spacing**: Heading tags (H1, H2, Label) should use `0.1em` to `0.45em` tracking for a luxury feel.

---

## ✨ Micro-Animations & Interactivity
- **Transitions**: Use `cubic-bezier(0.23, 1, 0.32, 1)` (Power3 out) for all hover effects.
- **Default Duration**: `300ms`.
- **Hover States**:
  - **Scale**: Subtle grow (`1.02x`).
  - **Brightness**: Increase exposure from `1` to `1.2`.
  - **Glow**: Add a soft outer glow using `#0D5699` (Blue) or `#A68A33` (Gold).

---

## 🛠️ Tailwind Utility Presets

```typescript
// tailwind.config.ts reference concepts
extend: {
  colors: {
    ocean: {
      deep: '#0a447a',
      brand: '#0d5699',
    },
    brass: {
      deep: '#91792c',
      light: '#a68a33',
    },
    emerald: '#63b589'
  },
  backdropBlur: {
    'glass': '16px',
  }
}
```

### Component Example (React/Tailwind)
```tsx
<div className="
  backdrop-blur-glass 
  bg-white/5 
  border border-white/10 
  rounded-[24px] 
  shadow-[0_20px_50px_rgba(0,0,0,0.5)]
  transition-all duration-300 ease-out
  hover:scale-[1.02] hover:bg-white/10
">
  {/* Content */}
</div>
```
