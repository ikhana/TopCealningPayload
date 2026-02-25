// src/collections/Pages/index.ts - Updated to include CleanTestimonials Block
import type { CollectionConfig } from 'payload'

import { admins } from '@/access/admins'
import { adminsOrPublished } from '@/access/adminsOrPublished'
import { Archive } from '@/blocks/ArchiveBlock/config'
import { ArtisanLegacy } from '@/blocks/ArtisanLegacy/config'
import { AvailableTests } from '@/blocks/AvailableTests'
import { Banner } from '@/blocks/Banner/config'
import { BlogShowcase } from '@/blocks/BlogShowcase/config'
import { CalendarBooking } from '@/blocks/CalendarBooking/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Carousel } from '@/blocks/Carousel/config'
import { CleanTestimonials } from '@/blocks/CleanTestimonials/config'; // ✨ NEW BLOCK
import { ContactForm } from '@/blocks/ContactForm/config'
import { Content } from '@/blocks/Content/config'
import { CraftsmanshipProcess } from '@/blocks/CraftsmanshipProcess/config'
import { FeaturedPromotion } from '@/blocks/FeaturedPromotion/config'
import { FormBlock } from '@/blocks/Form/config'
import { HeritageProductShowcase } from '@/blocks/HeritageProductShowcase/config'
import { HeritageStory } from '@/blocks/HeritageStory/config'
import { HeritageStorySpotlight } from '@/blocks/HeritageStorySpotlight/config'
import { HeritageTrust } from '@/blocks/HeritageTrust/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { PartnershipTrust } from '@/blocks/PartnershipTrust/config'
import { ProductSpotlight } from '@/blocks/ProductSpotlight/config'
import { ProductVariantShowcase } from '@/blocks/ProductVariantShowcase/config'
import { QualityGuarantee } from '@/blocks/QualityGuarantee/config'
import { ServiceHeroBanner } from '@/blocks/SerivceHeroBanner'
import { ServiceCoverage } from '@/blocks/ServiceCoverage'
import { ServicesExplorer } from '@/blocks/ServicesExplorer/config'
import { ShopByCategories } from '@/blocks/ShopByCategories/config'
import { TextContent } from '@/blocks/TextContent/config'
import { ThreeItemGrid } from '@/blocks/ThreeItemGrid/config'
import { Timeline } from '@/blocks/Timeline/config'
import { hero } from '@/fields/hero'
import { slugField } from '@/fields/slug'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'
import { HeroFeatures } from '@/blocks/HeroFeatures/config'
import { ClientServices } from '@/blocks/ClientServices/config'
import { AboutOwner } from '@/blocks/AboutOwner/config'
import { WhyItMatters } from '@/blocks/WhyItMatters/config'
import { AboutSplit } from '@/blocks/AboutSplit/config'
import { ServicesTabs } from '@/blocks/ServicesTabs/config'
import { ValuesGrid } from '@/blocks/ValuesGrid/config'
import { ContentShowcase } from '@/blocks/ContentShowcase/config'
import { ContactInfoCards } from '@/blocks/ContactInfoCards/config'
import { ContactHero } from '@/blocks/ContactHero/config'
import { GRIPP } from '@/blocks/GRIPP/config'
import { Faq } from '@/blocks/Faq/config'
import { VideoShowcase } from '@/blocks/VideoShowcase/config'
import { TestimonialsCarousel } from '@/blocks/TestimonialsCarousel/config'
import { ScheduleCallCTA } from '@/blocks/ScheduleCallCTA/config'




export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    create: admins,
    delete: admins,
    read: adminsOrPublished,
    update: admins,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const slug = typeof data?.slug === 'string' ? data.slug : ''
        const path = slug === 'home' ? '/' : `/${slug}`
        
        // Use the preview route with proper parameters
        const previewPath = generatePreviewPath({
          path,
          collection: 'pages',
          slug,
        })
        
        return `${process.env.NEXT_PUBLIC_SERVER_URL}${previewPath}`
      },
    },
    preview: (doc) => {
      const slug = typeof doc?.slug === 'string' ? doc.slug : ''
      const path = slug === 'home' ? '/' : `/${slug}`
      
      return generatePreviewPath({
        path,
        collection: 'pages', 
        slug,
      })
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'publishedOn',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                // Core content blocks
                Archive,
                Banner,
                CallToAction,
                Carousel,
                Content,
                FeaturedPromotion,
                FormBlock,
                ContactForm,
                MediaBlock,
                TextContent,
                ThreeItemGrid,
                
                // Product & commerce blocks
                HeritageProductShowcase,
                ProductVariantShowcase,
                ProductSpotlight,
                ShopByCategories,
                
                // Heritage & storytelling blocks  
                HeritageStory,
                HeritageStorySpotlight, // ✨ NEW: Individual heritage stories
                Timeline, // ✨ NEW: Company history timeline
                CraftsmanshipProcess, // ✨ NEW: Process showcase
                ServiceHeroBanner,
                AvailableTests,
                ServiceCoverage,
                ServicesExplorer,
                
                // Trust & social proof blocks
                ArtisanLegacy,
                HeritageTrust,
                PartnershipTrust,
                CleanTestimonials, // ✨ NEW: Clean Medical Testimonials Block
                
                // Blog & content blocks
                BlogShowcase,
                QualityGuarantee,

                // Booking and Calender Blocks 

                CalendarBooking,

                //hero blocks 

                  // Hero blocks 
                HeroFeatures, // ✅ Correct import
                ClientServices,
                AboutOwner,
                WhyItMatters,
                AboutSplit,
                ServicesTabs,
                ValuesGrid,
                ContentShowcase,
                 ContactInfoCards,
                 ContactHero,
                 GRIPP,
                 Faq,
                // VideoShowcase,
                 TestimonialsCarousel,
                 ScheduleCallCTA

              ],
              required: true,
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 50,
  },
}