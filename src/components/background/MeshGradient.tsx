// MeshGradient.tsx
// A subtle animated background that creates a mesh-like gradient effect
// Uses CSS animations on multiple radial gradient layers
//
// Props: none (reads theme from useAppStore)
//
// Implementation:
// - Fixed position div, full viewport, z-index -1 (behind everything)
// - 4 large radial gradient circles (50-70% of viewport)
// - Each gradient uses the theme's mesh-color-1 and mesh-color-2 CSS variables
// - CSS animation: each gradient slowly moves in a circular/figure-8 path
//   using @keyframes with transform: translate()
// - Animation duration: 15-25 seconds per gradient, different for each
// - opacity: kept very subtle (the CSS variables already have low alpha)
// - Blur: large blur filter (blur(100px)) for softness
//
// Uses CSS custom properties from the theme:
//   --mesh-color-1, --mesh-color-2, --mesh-base (defined in index.css)

import { useAppStore } from '../../store/appStore';

const keyframes = `
@keyframes mesh-drift-1 {
  0%, 100% {
    transform: translate(0%, 0%);
  }
  25% {
    transform: translate(15%, -20%);
  }
  50% {
    transform: translate(-10%, 15%);
  }
  75% {
    transform: translate(-20%, -10%);
  }
}

@keyframes mesh-drift-2 {
  0%, 100% {
    transform: translate(0%, 0%);
  }
  20% {
    transform: translate(-18%, 12%);
  }
  40% {
    transform: translate(12%, 20%);
  }
  60% {
    transform: translate(20%, -15%);
  }
  80% {
    transform: translate(-8%, -18%);
  }
}

@keyframes mesh-drift-3 {
  0%, 100% {
    transform: translate(0%, 0%);
  }
  33% {
    transform: translate(20%, 15%);
  }
  66% {
    transform: translate(-15%, -20%);
  }
}

@keyframes mesh-drift-4 {
  0%, 100% {
    transform: translate(0%, 0%);
  }
  15% {
    transform: translate(-12%, -18%);
  }
  35% {
    transform: translate(18%, -8%);
  }
  55% {
    transform: translate(10%, 22%);
  }
  75% {
    transform: translate(-20%, 12%);
  }
}
`;

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: -1,
  overflow: 'hidden',
  pointerEvents: 'none',
  background: 'var(--mesh-base)',
};

const blobBase: React.CSSProperties = {
  position: 'absolute',
  borderRadius: '50%',
  filter: 'blur(100px)',
  willChange: 'transform',
  pointerEvents: 'none',
};

const blobs: {
  style: React.CSSProperties;
  animation: string;
}[] = [
  {
    // Top-left blob - large, color-1
    style: {
      width: '70vmax',
      height: '70vmax',
      top: '-15%',
      left: '-10%',
      background: 'radial-gradient(circle, var(--mesh-color-1) 0%, transparent 70%)',
    },
    animation: 'mesh-drift-1 20s ease-in-out infinite',
  },
  {
    // Bottom-right blob - large, color-2
    style: {
      width: '65vmax',
      height: '65vmax',
      bottom: '-20%',
      right: '-10%',
      background: 'radial-gradient(circle, var(--mesh-color-2) 0%, transparent 70%)',
    },
    animation: 'mesh-drift-2 25s ease-in-out infinite',
  },
  {
    // Center-right blob - medium, color-1
    style: {
      width: '55vmax',
      height: '55vmax',
      top: '30%',
      right: '5%',
      background: 'radial-gradient(circle, var(--mesh-color-1) 0%, transparent 70%)',
    },
    animation: 'mesh-drift-3 18s ease-in-out infinite',
  },
  {
    // Bottom-left blob - medium, color-2
    style: {
      width: '50vmax',
      height: '50vmax',
      bottom: '5%',
      left: '10%',
      background: 'radial-gradient(circle, var(--mesh-color-2) 0%, transparent 70%)',
    },
    animation: 'mesh-drift-4 22s ease-in-out infinite',
  },
];

export function MeshGradient() {
  // Subscribe to theme so the component re-renders on theme change,
  // picking up the new CSS variable values automatically.
  useAppStore((s) => s.theme);

  return (
    <>
      <style>{keyframes}</style>
      <div style={containerStyle} aria-hidden="true">
        {blobs.map((blob, i) => (
          <div
            key={i}
            style={{
              ...blobBase,
              ...blob.style,
              animation: blob.animation,
            }}
          />
        ))}
      </div>
    </>
  );
}
