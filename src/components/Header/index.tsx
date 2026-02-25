// src/components/Header/index.tsx

import config from '@payload-config';
import { getPayload } from 'payload';
import { HeaderClient } from './index.client';
import './index.css';

export async function Header() {
  try {
    const payload = await getPayload({ config })
    
    const header = await payload.findGlobal({
      slug: 'header',
      depth: 2,
      draft: false,
    })
    
    return <HeaderClient header={header} />
  } catch (error) {
    console.error('Error fetching header:', error)
    
    const fallbackHeader = {
      navItems: [],
      logo: null,
      ctaButton: null,
      promotionalBanner: {
        enabled: false,
        content: null,
        cta: null,
      },
      socialLinks: {},
      topBarActions: [],
      id: '',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }
    
    return <HeaderClient header={fallbackHeader as any} />
  }
}