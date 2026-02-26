// src/blocks/RenderBlocks.tsx - UPDATED WITH CleanTestimonials Block
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component';
import { ArtisanLegacyBlock } from '@/blocks/ArtisanLegacy/Component';
import { CallToActionBlock } from '@/blocks/CallToAction/Component';
import { CarouselBlock } from '@/blocks/Carousel/Component';
import { CleanTestimonialsBlock } from '@/blocks/CleanTestimonials/Component'; // ✨ NEW BLOCK
import { ContactFormBlock } from '@/blocks/ContactForm/Component';
import { ContentBlock } from '@/blocks/Content/Component';
import { CraftsmanshipProcessBlock } from '@/blocks/CraftsmanshipProcess/Component';
import { FeaturedPromotionBlock } from '@/blocks/FeaturedPromotion/Component';
import { FormBlock } from '@/blocks/Form/Component';
import { HeritageStoryBlock } from '@/blocks/HeritageStory/Component';
import { HeritageStorySpotlightBlock } from '@/blocks/HeritageStorySpotlight/Component';
import { MediaBlock } from '@/blocks/MediaBlock/Component';
import { PartnerTrustBlock } from '@/blocks/PartnershipTrust/Component';
import { ProductSpotlightBlock } from '@/blocks/ProductSpotlight/Component';
import { VariantShowBlock } from '@/blocks/ProductVariantShowcase/Component';
import { QualityGuaranteeBlock } from '@/blocks/QualityGuarantee/Component';
import { ShopByCategoriesBlock } from '@/blocks/ShopByCategories/Component';
import { TextContentBlock } from '@/blocks/TextContent/Component';
import { ThreeItemGridBlock } from '@/blocks/ThreeItemGrid/Component';
import { TimelineBlock } from '@/blocks/Timeline/Component';
import { toKebabCase } from '@/utilities/toKebabCase';
import React, { Fragment } from 'react';
import type { Page } from '../payload-types';
import { AvailableTestsBlock } from './AvailableTests';
import { BlogShowcaseBlock } from './BlogShowcase/Component';
import { CalendarBookingBlock } from './CalendarBooking/Component';
import { HeritageProductShowcaseBlock } from './HeritageProductShowcase';
import { HeritageTrustBlock } from './HeritageTrust/Component';
import { ServiceHeroBannerBlock } from './SerivceHeroBanner';
import { ServiceCoverageBlock } from './ServiceCoverage';
import { ServicesExplorerBlock } from './ServicesExplorer/Component';
import { HeroFeaturesBlock } from './HeroFeatures/Component';
import { ClientServicesBlock } from './ClientServices';
import { AboutOwnerBlock } from './AboutOwner';
import { WhyItMattersBlock } from './WhyItMatters';
import { AboutSplitBlock } from './AboutSplit';
import { ServicesTabsBlock } from './ServicesTabs';
import { ValuesGridBlock } from './ValuesGrid';
import { ContentShowcaseBlock } from './ContentShowcase';
import { ContactInfoCardsBlock } from './ContactInfoCards';
import { ContactHeroBlock } from './ContactHero';
import { GRIPPBlock } from './GRIPP';
import { FaqBlock } from './Faq';
import { VideoShowcaseBlock } from '@/blocks/VideoShowcase/Component';
import { TestimonialsCarouselBlock } from './TestimonialsCarousel';
import { ScheduleCallCTABlock } from './ScheduleCallCTA';


const blockComponents = {
  // Existing blocks
  /*variantShow: VariantShowBlock,
  archive: ArchiveBlock,
  carousel: CarouselBlock,
  content: ContentBlock,
  contactForm: ContactFormBlock, 
  cta: CallToActionBlock,
  featuredPromotion: FeaturedPromotionBlock,
  formBlock: FormBlock,
  heritageStory: HeritageStoryBlock,
  productShowcase: HeritageProductShowcaseBlock,
  partnerTrust: PartnerTrustBlock,
  heritageTrust: HeritageTrustBlock,
  artisanLegacy: ArtisanLegacyBlock,
  productSpotlight: ProductSpotlightBlock,
  mediaBlock: MediaBlock,
  blogShowcase: BlogShowcaseBlock,
  shopByCategories: ShopByCategoriesBlock,
  textContent: TextContentBlock,
  threeItemGrid: ThreeItemGridBlock,
  availableTests: AvailableTestsBlock,
  serviceCoverage: ServiceCoverageBlock,
  servicesExplorer: ServicesExplorerBlock,
  
  // NEW BLOCKS - Our custom heritage blocks ✨
  timeline: TimelineBlock,
  serviceHeroBanner: ServiceHeroBannerBlock, 
  heritageStorySpotlight: HeritageStorySpotlightBlock,
  craftsmanshipProcess: CraftsmanshipProcessBlock,
  qualityGuarantee: QualityGuaranteeBlock,
  cleanTestimonials: CleanTestimonialsBlock, // ✨ NEW: Clean Medical Testimonials
  calendarBooking: CalendarBookingBlock,

  //Heroblocks

heroFeatures: HeroFeaturesBlock,
clientServices:ClientServicesBlock,
aboutOwner: AboutOwnerBlock,
whyItMatters: WhyItMattersBlock,
aboutSplit: AboutSplitBlock,
servicesTabs: ServicesTabsBlock,
valuesGrid: ValuesGridBlock,
contentShowcase: ContentShowcaseBlock,
 contactInfoCards: ContactInfoCardsBlock,
 contactHero: ContactHeroBlock,
 gripp: GRIPPBlock,
 faq: FaqBlock,
videoShowcase: VideoShowcaseBlock,
testimonialsCarousel: TestimonialsCarouselBlock,
scheduleCallCTA: ScheduleCallCTABlock*/
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
             return (
  <div key={index}>  {/* No margin classes at all */}
    <Block id={toKebabCase(blockName!)} {...block} />
  </div>
)
            }
          }
          
          // Debug: Log unmatched blocks
          if (blockType && !(blockType in blockComponents)) {
            console.warn(`Block type "${blockType}" not found in blockComponents`)
          }
          
          return null
        })}
      </Fragment>
    )
  }

  return null
}