// src/fields/hero.ts
import type { Field } from 'payload';

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';

import { linkGroup } from './linkGroup';

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Heritage Craftsmanship',
          value: 'heritageCraftsmanship',
        },
        {
          label: 'Barrel Cross-Section',
          value: 'barrelCrossSection',
        },
        {
          label: 'Craftsman Workbench',
          value: 'craftsmanWorkbench',
        },
        {
          label: 'Typewriter Contact Hero',
          value: 'typewriter',
        },
        {
          label: 'DNA Interactive Lab',
          value: 'dnaInteractiveLab',
        },
        {
    label: 'Clinical Grid Matrix',
    value: 'clinicalGridMatrix',
  },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },

    // DNA Interactive Lab Hero Fields
    {
      name: 'heroTitle',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'dnaInteractiveLab',
        description: 'Main hero title (e.g., "Advanced Medical Testing")',
      },
      defaultValue: 'Advanced Medical Testing',
    },
    {
      name: 'heroSubtitle',
      type: 'textarea',
      admin: {
        condition: (_, { type } = {}) => type === 'dnaInteractiveLab',
        description: 'Hero subtitle/description',
      },
      defaultValue: 'Precision diagnostics with cutting-edge technology and compassionate care',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, { type } = {}) => type === 'dnaInteractiveLab',
        description: 'Background image for the hero section (medical lab, technology, etc.)',
      },
    },
    {
      name: 'overlayStrength',
      type: 'select',
      admin: {
        condition: (_, { type } = {}) => type === 'dnaInteractiveLab',
        description: 'Background overlay intensity for text readability',
      },
      defaultValue: 'medium',
      options: [
        {
          label: 'No Overlay',
          value: 'none',
        },
        {
          label: 'Light Overlay',
          value: 'light',
        },
        {
          label: 'Medium Overlay',
          value: 'medium',
        },
        {
          label: 'Strong Overlay',
          value: 'strong',
        },
      ],
    },
    {
      name: 'enableDNAAnimation',
      type: 'checkbox',
      admin: {
        condition: (_, { type } = {}) => type === 'dnaInteractiveLab',
        description: 'Enable DNA helix rotation animation',
      },
      defaultValue: true,
    },
    {
      name: 'enableParticleAnimation',
      type: 'checkbox',
      admin: {
        condition: (_, { type } = {}) => type === 'dnaInteractiveLab',
        description: 'Enable floating molecular particle animations',
      },
      defaultValue: true,
    },
    {
      name: 'testCategories',
      type: 'array',
      admin: {
        condition: (_, { type } = {}) => type === 'dnaInteractiveLab',
        description: 'Test categories displayed as DNA segments (3-4 recommended)',
      },
      maxRows: 6,
      minRows: 3,
      fields: [
        {
          name: 'categoryId',
          type: 'text',
          required: true,
          admin: {
            description: 'Unique identifier (e.g., "genetic", "cancer")',
          },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Category name (e.g., "Genetic Testing")',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Category description',
          },
        },
        
        {
          name: 'color',
          type: 'select',
          defaultValue: 'blue',
          options: [
            {
              label: 'Blue Theme',
              value: 'blue',
            },
            {
              label: 'Teal Theme',
              value: 'teal',
            },
            {
              label: 'Green Theme',
              value: 'green',
            },
            {
              label: 'Coral Theme',
              value: 'coral',
            },
          ],
        },
        {
          name: 'ctaLink',
          type: 'text',
          admin: {
            description: 'Optional direct link for this category',
          },
        },
      ],
      defaultValue: [
        {
          id: 'genetic',
          name: 'Genetic Testing',
          description: 'Comprehensive genetic analysis and predisposition testing',
          icon: 'genetic',
          color: 'blue',
        },
        {
          id: 'cancer',
          name: 'Cancer Screening',
          description: 'Early detection and diagnostic cancer screening services',
          icon: 'cancer',
          color: 'teal',
        },
        {
          id: 'employment',
          name: 'Employment Testing',
          description: 'Professional health assessments and workplace testing',
          icon: 'employment',
          color: 'green',
        },
      ],
    },
    {
      name: 'showLabStats',
      type: 'checkbox',
      admin: {
        condition: (_, { type } = {}) => type === 'dnaInteractiveLab',
        description: 'Show laboratory statistics grid',
      },
      defaultValue: true,
    },
    {
      name: 'customStats',
      type: 'array',
      admin: {
        condition: (_, { type } = {}) => type === 'dnaInteractiveLab',
        description: 'Custom statistics (leave empty to use defaults)',
      },
      maxRows: 6,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Stat label (e.g., "Tests Processed")',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'Stat value (e.g., "50K+")',
          },
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Optional icon identifier',
          },
        },
      ],
    },
    {
      name: 'dnaLabPrimaryButton',
      type: 'group',
      admin: {
        condition: (_, { type } = {}) => type === 'dnaInteractiveLab',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'View All Tests',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          defaultValue: '/available-tests',
          required: true,
        },
      ],
    },
    {
      name: 'dnaLabSecondaryButton',
      type: 'group',
      admin: {
        condition: (_, { type } = {}) => type === 'dnaInteractiveLab',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Find Locations',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          defaultValue: '/find-us',
          required: true,
        },
      ],
    },
    {
      name: 'animationSpeed',
      type: 'number',
      admin: {
        condition: (_, { type } = {}) => type === 'dnaInteractiveLab',
        description: 'DNA rotation speed in seconds (default: 20)',
      },
      defaultValue: 20,
      min: 5,
      max: 60,
    },
    {
      name: 'segmentTransitionSpeed',
      type: 'number',
      admin: {
        condition: (_, { type } = {}) => type === 'dnaInteractiveLab',
        description: 'Segment transition speed in seconds (default: 4)',
      },
      defaultValue: 4,
      min: 2,
      max: 10,
    },
    {
      name: 'particleCount',
      type: 'number',
      admin: {
        condition: (_, { type } = {}) => type === 'dnaInteractiveLab',
        description: 'Number of floating particles (default: 12)',
      },
      defaultValue: 12,
      min: 0,
      max: 24,
    },
    {
      name: 'enableTextTrail',
      type: 'checkbox',
      admin: {
        condition: (_, { type } = {}) => type === 'dnaInteractiveLab',
        description: 'Enable circular animated text trail around DNA spinner',
      },
      defaultValue: true,
    },
    {
      name: 'textTrailText',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'dnaInteractiveLab',
        description: 'Text to display in the circular trail around DNA spinner',
      },
      defaultValue: "WE'RE NEW BIRTH LABS.",
    },
    {
      name: 'textTrailColor',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'dnaInteractiveLab',
        description: 'Text trail color (hex code, default: black)',
      },
      defaultValue: '#000000',
      validate: (val) => {
        if (!val) return true; // Allow empty
        if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val)) {
          return 'Please enter a valid hex color (e.g., #000000)';
        }
        return true;
      },
    },
    // Clinical Grid Matrix Hero Fields
    {
      name: 'clinicalGridTitle',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'clinicalGridMatrix',
        description: 'Main hero headline',
      },
      defaultValue: 'Precision Testing, Delivered',
    },
    {
      name: 'clinicalGridSubtitle',
      type: 'textarea',
      admin: {
        condition: (_, { type } = {}) => type === 'clinicalGridMatrix',
        description: 'Hero subtitle/description',
      },
      defaultValue: 'Professional laboratory services that come to you - because healthcare should fit your schedule, not the other way around.',
    },
    {
      name: 'clinicalGridPrimaryCTA',
      type: 'group',
      admin: {
        condition: (_, { type } = {}) => type === 'clinicalGridMatrix',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Schedule Test',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          defaultValue: '/schedule',
          required: true,
        },
      ],
    },
    {
      name: 'clinicalGridSecondaryCTA',
      type: 'group',
      admin: {
        condition: (_, { type } = {}) => type === 'clinicalGridMatrix',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'Leave empty to hide secondary button',
          },
        },
        {
          name: 'link',
          type: 'text',
          defaultValue: '/services',
        },
      ],
    },
    {
      name: 'clinicalGridAnimationSpeed',
      type: 'select',
      admin: {
        condition: (_, { type } = {}) => type === 'clinicalGridMatrix',
        description: 'Grid cell animation speed',
      },
      defaultValue: 'medium',
      options: [
        {
          label: 'Slow & Elegant',
          value: 'slow',
        },
        {
          label: 'Medium Pace',
          value: 'medium',
        },
        {
          label: 'Fast & Dynamic',
          value: 'fast',
        },
      ],
    },
    {
      name: 'clinicalGridBackgroundStyle',
      type: 'select',
      admin: {
        condition: (_, { type } = {}) => type === 'clinicalGridMatrix',
        description: 'Background style affects header visibility',
      },
      defaultValue: 'light',
      options: [
        {
          label: 'Light Background',
          value: 'light',
        },
        {
          label: 'Dark Background', 
          value: 'dark',
        },
      ],
    },

    // Typewriter Contact Hero Fields
    {
      name: 'typewriterHeadline',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'typewriter',
        description: 'Static text before the animated phrases (e.g., "Go ahead, ")',
      },
      defaultValue: 'Go ahead, ',
      required: true,
    },
    {
      name: 'typewriterPhrases',
      type: 'array',
      admin: {
        condition: (_, { type } = {}) => type === 'typewriter',
        description: 'Phrases that cycle in the typewriter effect (8-12 recommended)',
      },
      minRows: 6,
      maxRows: 18,
      fields: [
        {
          name: 'phrase',
          type: 'text',
          required: true,
          admin: {
            description: 'Phrase to animate (e.g., "pour us your thoughts.")',
          },
        },
      ],
      defaultValue: [
        { phrase: 'pour us your thoughts.' },
        { phrase: 'share your spirit.' },
        { phrase: 'raise a glass with us.' },
        { phrase: 'send us a message.' },
        { phrase: "let's talk bourbon." },
        { phrase: 'connect with connoisseurs.' },
        { phrase: 'join our circle.' },
        { phrase: 'craft your inquiry.' },
        { phrase: 'light up a conversation.' },
        { phrase: 'send smoke signals.' },
        { phrase: 'savor the connection.' },
        { phrase: 'uncork your questions.' },
      ],
    },
    {
      name: 'typewriterBackground',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, { type } = {}) => type === 'typewriter',
        description: 'Background image for typewriter hero (bourbon bar, distillery, etc.)',
      },
      required: true,
    },
    {
      name: 'typewriterOverlayStrength',
      type: 'select',
      admin: {
        condition: (_, { type } = {}) => type === 'typewriter',
        description: 'Overlay intensity for text readability',
      },
      defaultValue: 'medium',
      options: [
        {
          label: 'Light Overlay',
          value: 'light',
        },
        {
          label: 'Medium Overlay',
          value: 'medium',
        },
        {
          label: 'Strong Overlay',
          value: 'strong',
        },
      ],
    },
    {
      name: 'typewriterTypingSpeed',
      type: 'number',
      admin: {
        condition: (_, { type } = {}) => type === 'typewriter',
        description: 'Typing speed in milliseconds (default: 150)',
      },
      defaultValue: 150,
      min: 50,
      max: 500,
    },
    {
      name: 'typewriterPauseTime',
      type: 'number',
      admin: {
        condition: (_, { type } = {}) => type === 'typewriter',
        description: 'Pause time at end of phrase in milliseconds (default: 3000)',
      },
      defaultValue: 3000,
      min: 1000,
      max: 8000,
    },
    
    // Heritage Craftsmanship Hero Fields
    {
      name: 'headline',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'heritageCraftsmanship',
        description: 'Main headline before animated words (e.g., "Crafting")',
      },
      defaultValue: 'Crafting',
    },
    {
      name: 'animatedWords',
      type: 'array',
      admin: {
        condition: (_, { type } = {}) => type === 'heritageCraftsmanship',
        description: 'Words that cycle after the headline (3-5 recommended)',
      },
      maxRows: 5,
      minRows: 3,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          admin: {
            description: 'Word to animate (e.g., "Excellence", "Heritage")',
          },
        },
        {
          name: 'colorStyle',
          type: 'select',
          defaultValue: 'word1',
          options: [
            {
              label: 'Bourbon Brown',
              value: 'word1',
            },
            {
              label: 'Charcoal Dark',
              value: 'word2',
            },
            {
              label: 'Saddle Brown',
              value: 'word3',
            },
          ],
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        condition: (_, { type } = {}) => type === 'heritageCraftsmanship',
        description: 'Description text below the headline',
      },
      defaultValue: 'Where traditional artistry meets contemporary design. Every piece tells a story of dedication, precision, and time-honored techniques passed down through generations.',
    },
    {
      name: 'primaryButton',
      type: 'group',
      admin: {
        condition: (_, { type } = {}) => type === 'heritageCraftsmanship',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Explore Collection',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          defaultValue: '/products',
          required: true,
        },
      ],
    },
    {
      name: 'secondaryButton',
      type: 'group',
      admin: {
        condition: (_, { type } = {}) => type === 'heritageCraftsmanship',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Our Story',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          defaultValue: '/about',
          required: true,
        },
      ],
    },
    {
      name: 'workshopImages',
      type: 'array',
      admin: {
        condition: (_, { type } = {}) => type === 'heritageCraftsmanship',
        description: 'Workshop images that sync with animated words (3-5 images recommended)',
      },
      maxRows: 5,
      minRows: 3,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'heritageYear',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'heritageCraftsmanship',
        description: 'Year your business was established (e.g., "1985")',
      },
      defaultValue: '1985',
    },
    {
      name: 'craftmanshipLabel',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'heritageCraftsmanship',
        description: 'Heritage badge label',
      },
      defaultValue: 'Handcrafted Excellence',
    },
    {
      name: 'workshopBackgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, { type } = {}) => type === 'heritageCraftsmanship',
        description: 'Wood background image for the right workshop area (optional - will overlay behind workshop images)',
      },
    },

    // Barrel Cross-Section Hero Fields
    {
      name: 'barrelHeadline',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'barrelCrossSection',
        description: 'Main headline prefix (e.g., "Our")',
      },
      defaultValue: 'Our',
    },
    {
      name: 'barrelWoodBackground',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, { type } = {}) => type === 'barrelCrossSection',
        description: 'Optional wood grain background image for the barrel section (will overlay behind logo)',
      },
    },
    {
      name: 'brandPillars',
      type: 'array',
      admin: {
        condition: (_, { type } = {}) => type === 'barrelCrossSection',
        description: 'Brand pillars displayed as barrel rings (4 recommended)',
      },
      maxRows: 4,
      minRows: 4,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Pillar name (e.g., "Heritage", "Quality")',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Description that appears when this pillar is active',
          },
        },
        {
          name: 'ringPosition',
          type: 'select',
          defaultValue: 'outer',
          options: [
            {
              label: 'Outer Ring',
              value: 'outer',
            },
            {
              label: 'Middle Outer',
              value: 'middleOuter',
            },
            {
              label: 'Middle Inner',
              value: 'middleInner',
            },
            {
              label: 'Inner Ring',
              value: 'inner',
            },
          ],
          admin: {
            description: 'Position of this pillar in the barrel cross-section',
          },
        },
      ],
    },
    {
      name: 'barrelBadgeText',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'barrelCrossSection',
        description: 'Badge text (e.g., "Heritage Crafted Excellence")',
      },
      defaultValue: 'Heritage Crafted Excellence',
    },
    {
      name: 'barrelPrimaryButton',
      type: 'group',
      admin: {
        condition: (_, { type } = {}) => type === 'barrelCrossSection',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Explore Heritage',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          defaultValue: '/products',
          required: true,
        },
      ],
    },
    {
      name: 'barrelSecondaryButton',
      type: 'group',
      admin: {
        condition: (_, { type } = {}) => type === 'barrelCrossSection',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Our Legacy',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          defaultValue: '/about',
          required: true,
        },
      ],
    },
    {
      name: 'craftsmanshipSteps',
      type: 'array',
      admin: {
        condition: (_, { type } = {}) => type === 'barrelCrossSection',
        description: 'Heritage process steps shown in bottom timeline (4 recommended)',
      },
      maxRows: 4,
      minRows: 4,
      fields: [
        {
          name: 'step',
          type: 'text',
          required: true,
          admin: {
            description: 'Heritage step name (e.g., "Select", "Craft", "Perfect")',
          },
        },
      ],
    },
    {
      name: 'barrelImages',
      type: 'array',
      admin: {
        condition: (_, { type } = {}) => type === 'barrelCrossSection',
        description: 'Heritage background images that sync with brand pillars (4 recommended)',
      },
      maxRows: 4,
      minRows: 0,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Heritage image that represents this brand pillar',
          },
        },
      ],
    },
    {
      name: 'logoImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, { type } = {}) => type === 'barrelCrossSection',
        description: 'Logo image to display as background behind the barrel rings',
      },
    },

    // Craftsman Workbench Hero Fields
    {
      name: 'workbenchHeadline',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'craftsmanWorkbench',
        description: 'Main headline (e.g., "Crafting")',
      },
      defaultValue: 'Crafting',
    },
    {
      name: 'workbenchSubheadline',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'craftsmanWorkbench',
        description: 'Subheadline (e.g., "Excellence by Hand")',
      },
      defaultValue: 'Excellence by Hand',
    },
    {
      name: 'workbenchAreas',
      type: 'array',
      admin: {
        condition: (_, { type } = {}) => type === 'craftsmanWorkbench',
        description: 'Interactive workbench areas (4 recommended)',
      },
      maxRows: 4,
      minRows: 4,
      fields: [
        {
          name: 'areaName',
          type: 'text',
          required: true,
          admin: {
            description: 'Area name (e.g., "Tools", "Materials")',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Title that appears when area is active (e.g., "Precision Tools")',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Description for this workbench area',
          },
        },
        {
          name: 'areaType',
          type: 'select',
          defaultValue: 'tools',
          options: [
            {
              label: 'Tools Section',
              value: 'tools',
            },
            {
              label: 'Wood Materials',
              value: 'materials',
            },
            {
              label: 'Blueprints',
              value: 'blueprints',
            },
            {
              label: 'Finish Samples',
              value: 'finishes',
            },
          ],
          admin: {
            description: 'Type of workbench area',
          },
        },
        {
          name: 'position',
          type: 'group',
          fields: [
            {
              name: 'x',
              type: 'number',
              required: true,
              min: 0,
              max: 100,
              admin: {
                description: 'X position on workbench (0-100%)',
              },
            },
            {
              name: 'y',
              type: 'number',
              required: true,
              min: 0,
              max: 100,
              admin: {
                description: 'Y position on workbench (0-100%)',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'workbenchBadgeText',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'craftsmanWorkbench',
        description: 'Badge text (e.g., "Master Crafted")',
      },
      defaultValue: 'Master Crafted',
    },
    {
      name: 'workbenchPrimaryButton',
      type: 'group',
      admin: {
        condition: (_, { type } = {}) => type === 'craftsmanWorkbench',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Visit Workshop',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          defaultValue: '/products',
          required: true,
        },
      ],
    },
    {
      name: 'workbenchSecondaryButton',
      type: 'group',
      admin: {
        condition: (_, { type } = {}) => type === 'craftsmanWorkbench',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Our Process',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          defaultValue: '/about',
          required: true,
        },
      ],
    },
    {
      name: 'workbenchBackgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, { type } = {}) => type === 'craftsmanWorkbench',
        description: 'Workbench background image (top-down view recommended)',
      },
    },
    {
      name: 'sectionBackgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, { type } = {}) => type === 'craftsmanWorkbench',
        description: 'Wood background image for the entire left section behind the workbench',
      },
    },
    {
      name: 'enableWoodEffects',
      type: 'checkbox',
      admin: {
        condition: (_, { type } = {}) => type === 'craftsmanWorkbench',
        description: 'Enable wood grain enhancement effects for background images',
      },
      defaultValue: true,
    },
    
    // Original Hero Fields (for other hero types)
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact', 'lowImpact'].includes(type),
      },
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          condition: (_, { type } = {}) => ['highImpact', 'mediumImpact', 'lowImpact'].includes(type),
        },
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}