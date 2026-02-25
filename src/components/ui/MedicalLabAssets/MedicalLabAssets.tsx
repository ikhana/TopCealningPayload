// src/components/ui/MedicalLabAssets/MedicalLabAssets.tsx
// New Birth Labs Brand Theme - DNA Interactive Hero Assets
import React from 'react';

interface MedicalLabAssetsProps {
  className?: string
}

// DNA Helix Segment SVG Component
export const DNAHelixSegment: React.FC<{ className?: string; active?: boolean }> = ({ 
  className = "w-8 h-8", 
  active = false 
}) => (
  <svg 
    viewBox="0 0 40 40" 
    className={className}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* DNA Base Pair Structure */}
    <circle 
      cx="10" 
      cy="20" 
      r="3" 
      className={active ? "fill-brand-blue" : "fill-orange"} 
    />
    <circle 
      cx="30" 
      cy="20" 
      r="3" 
      className={active ? "fill-brand-blue" : "fill-orange"} 
    />
    {/* Connecting Bond */}
    <line 
      x1="13" 
      y1="20" 
      x2="27" 
      y2="20" 
      className={active ? "stroke-brand-blue" : "stroke-orange"}
      strokeWidth="2"
      strokeDasharray={active ? "none" : "2,2"}
    />
    {/* Helix Curves */}
    <path 
      d="M5 8 Q15 12 25 8 Q35 4 40 8" 
      className={active ? "stroke-brand-blue" : "stroke-blue-gray"}
      strokeWidth="1.5" 
      fill="none"
    />
    <path 
      d="M5 32 Q15 28 25 32 Q35 36 40 32" 
      className={active ? "stroke-brand-blue" : "stroke-blue-gray"}
      strokeWidth="1.5" 
      fill="none"
    />
  </svg>
)

// Genetic Testing Icon
export const GeneticTestIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 3L12 21M3 12L21 12M7.5 7.5L16.5 16.5M16.5 7.5L7.5 16.5"
      className="stroke-brand-blue" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="8" className="stroke-orange" strokeWidth="1.5" fill="none"/>
    <circle cx="12" cy="12" r="4" className="stroke-coral" strokeWidth="1" fill="none"/>
  </svg>
)

// Cancer Screening Icon  
export const CancerScreenIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="2" className="fill-brand-blue"/>
    <rect x="10" y="10" width="4" height="8" rx="1" className="fill-orange"/>
    <circle cx="8" cy="16" r="1.5" className="fill-coral"/>
    <circle cx="16" cy="16" r="1.5" className="fill-coral"/>
    <path d="M12 20v2" className="stroke-blue-gray" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="10" className="stroke-brand-blue" strokeWidth="1.5" fill="none" strokeDasharray="2,2"/>
  </svg>
)

// Employment Testing Icon
export const EmploymentTestIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="16" height="12" rx="2" className="stroke-navy" strokeWidth="1.5" fill="none"/>
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" className="stroke-navy" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="2" className="fill-brand-blue"/>
    <path d="M10 15h4" className="stroke-coral" strokeWidth="2" strokeLinecap="round"/>
    <rect x="7" y="9" width="2" height="2" rx="0.5" className="fill-blue-gray"/>
    <rect x="15" y="9" width="2" height="2" rx="0.5" className="fill-blue-gray"/>
  </svg>
)

// Molecular Hexagon Structure
export const MolecularHex: React.FC<{ 
  className?: string; 
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled' | 'gradient';
}> = ({ 
  className = "w-6 h-6", 
  size = 'md',
  variant = 'outline'
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }

  const variantClasses = {
    outline: "stroke-orange fill-none",
    filled: "fill-orange stroke-none",
    gradient: "fill-url(#hexGradient) stroke-orange"
  }

  return (
    <svg 
      viewBox="0 0 24 24" 
      className={`${sizeClasses[size]} ${className}`} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--color-brand-blue))" />
          <stop offset="50%" stopColor="hsl(var(--color-coral))" />
          <stop offset="100%" stopColor="hsl(var(--color-orange))" />
        </linearGradient>
      </defs>
      <polygon 
        points="12,2 20,7 20,17 12,22 4,17 4,7"
        className={variantClasses[variant]}
        strokeWidth="1.5"
      />
      {/* Central atom */}
      <circle cx="12" cy="12" r="2" className="fill-brand-blue"/>
      {/* Electron orbits */}
      <circle cx="12" cy="12" r="6" className="stroke-blue-gray" strokeWidth="0.5" fill="none" opacity="0.6"/>
      <circle cx="12" cy="12" r="9" className="stroke-blue-gray" strokeWidth="0.5" fill="none" opacity="0.4"/>
    </svg>
  )
}

// Test Tube with Liquid
export const TestTube: React.FC<{ 
  className?: string; 
  liquidColor?: 'blue' | 'coral' | 'orange' | 'navy';
  fillLevel?: number; // 0-100
}> = ({ 
  className = "w-6 h-6", 
  liquidColor = 'blue',
  fillLevel = 60
}) => {
  const liquidColors = {
    blue: "fill-brand-blue",
    coral: "fill-coral", 
    orange: "fill-orange",
    navy: "fill-navy"
  }

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Test tube body */}
      <rect x="9" y="4" width="6" height="16" rx="3" className="stroke-navy" strokeWidth="1.5" fill="none"/>
      {/* Liquid */}
      <rect 
        x="9.5" 
        y={4 + (16 - (16 * fillLevel / 100))} 
        width="5" 
        height={16 * fillLevel / 100} 
        rx="2.5" 
        className={liquidColors[liquidColor]}
        opacity="0.7"
      />
      {/* Test tube top */}
      <rect x="8" y="2" width="8" height="2" rx="1" className="fill-blue-gray"/>
      {/* Bubbles */}
      <circle cx="11" cy="12" r="0.5" className="fill-clinical-white" opacity="0.8"/>
      <circle cx="13" cy="10" r="0.3" className="fill-clinical-white" opacity="0.6"/>
    </svg>
  )
}

// Lab Grid Pattern Background
export const LabGridPattern: React.FC<{ className?: string }> = ({ className }) => (
  <div 
    className={`absolute inset-0 opacity-5 ${className}`}
    style={{
      backgroundImage: `
        linear-gradient(hsl(var(--color-blue-gray)) 1px, transparent 1px),
        linear-gradient(90deg, hsl(var(--color-blue-gray)) 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px'
    }}
  />
)

// Floating Molecular Particle
export const MolecularParticle: React.FC<{
  className?: string;
  type?: 'atom' | 'molecule' | 'bond';
  animate?: boolean;
}> = ({ 
  className = "w-2 h-2", 
  type = 'atom',
  animate = true 
}) => {
  const particleTypes = {
    atom: (
      <circle 
        cx="12" 
        cy="12" 
        r="10" 
        className="fill-orange" 
        opacity="0.6"
      />
    ),
    molecule: (
      <g>
        <circle cx="8" cy="12" r="4" className="fill-brand-blue" opacity="0.5"/>
        <circle cx="16" cy="12" r="4" className="fill-coral" opacity="0.5"/>
        <line x1="12" y1="12" x2="12" y2="12" className="stroke-blue-gray" strokeWidth="2"/>
      </g>
    ),
    bond: (
      <line 
        x1="4" 
        y1="12" 
        x2="20" 
        y2="12" 
        className="stroke-orange" 
        strokeWidth="2" 
        opacity="0.4"
      />
    )
  }

  return (
    <svg 
      viewBox="0 0 24 24" 
      className={`${className} ${animate ? 'animate-gentle-pulse' : ''}`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {particleTypes[type]}
    </svg>
  )
}

// Medical Lab Background Pattern with Organic Elements
export const OrganicLabPattern: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`absolute inset-0 ${className}`}>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="organicMedicalGrid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(var(--color-brand-blue))" strokeWidth="0.5" opacity="0.4"/>
          <circle cx="30" cy="30" r="1" fill="hsl(var(--color-coral))" opacity="0.3"/>
          <path d="M 30 25 L 30 35 M 25 30 L 35 30" stroke="hsl(var(--color-orange))" strokeWidth="0.5" opacity="0.2"/>
        </pattern>
        <radialGradient id="organicGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--color-brand-blue))" stopOpacity="0.1"/>
          <stop offset="50%" stopColor="hsl(var(--color-coral))" stopOpacity="0.05"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#organicMedicalGrid)" />
      <ellipse cx="20%" cy="30%" rx="200" ry="150" fill="url(#organicGlow)" opacity="0.6" className="animate-organic-float"/>
      <ellipse cx="80%" cy="70%" rx="180" ry="120" fill="url(#organicGlow)" opacity="0.4" style={{animationDelay: '2s'}} className="animate-organic-float"/>
    </svg>
  </div>
)

// Main Assets Export
export const MedicalLabAssets: React.FC<MedicalLabAssetsProps> = ({ className }) => {
  return (
    <div className={`medical-lab-assets ${className}`}>
      {/* This component serves as a container for all medical lab assets */}
      {/* Individual components exported above can be used directly */}
    </div>
  )
}

// Asset collections for easy import
export const DNAAssets = {
  HelixSegment: DNAHelixSegment,
  MolecularHex,
  MolecularParticle,
}

export const TestIcons = {
  Genetic: GeneticTestIcon,
  Cancer: CancerScreenIcon,
  Employment: EmploymentTestIcon,
}

export const LabElements = {
  TestTube,
  LabGridPattern,
  OrganicLabPattern,
}

// Updated dummy content for admin interface with new brand colors
export const MEDICAL_LAB_DUMMY_DATA = {
  heroTitle: "Advanced Medical Testing",
  heroSubtitle: "Precision diagnostics with cutting-edge technology and compassionate care",
  backgroundImage: "/images/medical-lab-hero-bg.jpg", // For admin upload
  dnaHelixConfig: {
    segments: 8,
    rotationSpeed: 20, // seconds
    interactiveSegments: 3
  },
  testCategories: [
    {
      id: "genetic",
      name: "Genetic Testing", 
      description: "Comprehensive genetic analysis and predisposition testing",
      icon: "genetic",
      color: "blue" // Maps to brand-blue
    },
    {
      id: "cancer", 
      name: "Cancer Screening",
      description: "Early detection and diagnostic cancer screening services", 
      icon: "cancer",
      color: "coral" // Maps to coral
    },
    {
      id: "employment",
      name: "Employment Testing", 
      description: "Professional health assessments and workplace testing",
      icon: "employment", 
      color: "orange" // Maps to orange
    }
  ],
  labStats: [
    { label: "Tests Processed", value: "50,000+", icon: "test-tube" },
    { label: "Accuracy Rate", value: "99.9%", icon: "molecular" },
    { label: "Turnaround Time", value: "24-48hrs", icon: "dna" }
  ]
}

export default MedicalLabAssets