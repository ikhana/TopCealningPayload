// src/components/Footer/index.tsx - SERVER COMPONENT

import config from '@payload-config'
import { getPayload } from 'payload'
import { FooterClient } from './index.client'

export async function Footer() {
  try {
    const payload = await getPayload({ config })
    
    const footer = await payload.findGlobal({
      slug: 'footer',
      depth: 2,
      draft: false,
    })
    
    return <FooterClient footer={footer} />
  } catch (error) {
    console.error('Error fetching footer:', error)
    
    // Fallback footer
    const fallbackFooter = {
      logo: null,
      tagline: 'Professional cleaning services dedicated to excellence. Making your space spotless, one cleaning at a time.',
      sections: [],
      contactInfo: {
        phone1: '',
        phone2: '',
        email:  '',
        hours:  '',
      },
      socialLinks: {},
      legalLinks: [],
      copyright: '© {year} TOP CLEANING. ALL RIGHTS RESERVED.',
      id: '',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }
    
    return <FooterClient footer={fallbackFooter as any} />
  }
}