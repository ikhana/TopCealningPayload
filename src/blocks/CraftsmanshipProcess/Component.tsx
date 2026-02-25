// src/blocks/CraftsmanshipProcess/Component.tsx
import { SectionHeading } from '@/components/ui/SectionHeading'
import { WorkshopButton } from '@/components/ui/WorkshopButton/WorkshopButton'
import type { CraftsmanshipProcessBlock as CraftsmanshipProcessBlockType } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { Activity, Award, Shield } from 'lucide-react'
import React from 'react'
import { CraftsmanshipProcessClient } from './Component.client'

export interface ProcessedStep {
  id: string
  stepNumber: number
  stepTitle: string
  stepDescription: string
  duration?: string
  tools?: string
  highlightStep: boolean
  stepImage: any // Original media object from Payload
}

export interface ProcessedMaterial {
  materialName: string
  materialDescription?: string
}

export interface ProcessedCraftsmanshipData {
  sectionTitle: string
  sectionDescription?: string
  processType: 'general' | 'product' | 'custom'
  processSteps: ProcessedStep[]
  showStepNumbers: boolean
  materials?: ProcessedMaterial[]
  showMaterials: boolean
  enableCTA: boolean
  ctaText?: string
  ctaLink?: string
}

export const CraftsmanshipProcessBlock: React.FC<
  CraftsmanshipProcessBlockType & {
    id?: string
  }
> = (props) => {
  const {
    sectionTitle,
    sectionDescription,
    processType = 'general',
    processSteps,
    showStepNumbers = true,
    enableCTA = false,
    ctaText,
    ctaLink,
    linkedProduct,
    showMaterials = false,
    materials,
  } = props

  // Process steps with safe defaults and sorting
  const processedSteps: ProcessedStep[] = React.useMemo(() => {
    if (!processSteps?.length) return []
    
    return processSteps
      .map((step, index) => {
        return {
          id: `process-step-${step.stepNumber || index + 1}`,
          stepNumber: step.stepNumber || index + 1,
          stepTitle: step.stepTitle || `Step ${index + 1}`,
          stepDescription: step.stepDescription || 'Medical testing process step',
          duration: step.duration || undefined,
          tools: step.tools || undefined,
          highlightStep: step.highlightStep || false,
          stepImage: step.stepImage || null, // Pass original media object
        }
      })
      .sort((a, b) => a.stepNumber - b.stepNumber) // Ensure proper order
  }, [processSteps])

  // Process materials with safe defaults (equipment/tools for medical context)
  const processedMaterials: ProcessedMaterial[] = React.useMemo(() => {
    if (!materials?.length) return []
    
    return materials.map((material) => ({
      materialName: material.materialName || 'Professional Equipment',
      materialDescription: material.materialDescription || undefined,
    }))
  }, [materials])

  // Don't render if no steps
  if (processedSteps.length === 0) {
    return null
  }

  // Process data for client component
  const processedData: ProcessedCraftsmanshipData = {
    sectionTitle: sectionTitle || 'Our Medical Testing Process',
    sectionDescription: sectionDescription || undefined,
    processType: processType || 'general',
    processSteps: processedSteps,
    showStepNumbers: showStepNumbers !== false,
    materials: processedMaterials,
    showMaterials: Boolean(showMaterials) && processedMaterials.length > 0,
    enableCTA: Boolean(enableCTA),
    ctaText: ctaText || undefined,
    ctaLink: ctaLink || undefined,
  }

  // Clean medical background classes - professional only
  const getBackgroundStyle = (type: string) => {
    switch (type) {
      case 'product':
        return 'bg-clinical-white dark:bg-navy'
      case 'custom':
        return 'bg-gradient-to-br from-clinical-white to-coral/3 dark:from-navy dark:to-coral/5'
      default:
        return 'bg-clinical-white dark:bg-navy'
    }
  }

  return (
    <section className={cn(
      'relative py-16 lg:py-24',
      getBackgroundStyle(processedData.processType),
      'transition-colors duration-300'
    )}>
      <div className="container mx-auto px-6">
        
        {/* Section Header - Clean Medical Style */}
        <div className="mb-16">
          <SectionHeading
            title={processedData.sectionTitle}
            subtitle={processedData.sectionDescription}
            level="h2"
            size="lg"
            align="center"
            theme="auto"
            className="max-w-4xl mx-auto"
          />
        </div>

        {/* Medical Equipment/Tools Showcase - Clean Professional Cards */}
        {processedData.showMaterials && processedData.materials && processedData.materials.length > 0 && (
          <div className="mb-20">
            <div className="max-w-6xl mx-auto">
              
              {/* Medical Equipment Title */}
              <div className="text-center mb-12">
                <h3 className={cn(
                  'text-2xl lg:text-3xl font-bold font-heading mb-4',
                  'text-dark-navy dark:text-clinical-white',
                  'tracking-wide'
                )}>
                  Professional Medical Equipment
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-coral to-transparent mx-auto" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedData.materials.map((material, index) => (
                  <div
                    key={index}
                    className={cn(
                      'relative p-6 border-2 transition-all duration-300 group',
                      // Clean medical background
                      'bg-clinical-white dark:bg-navy/90',
                      // Professional border
                      'border-blue-gray/20 dark:border-blue-gray/30',
                      // Clean hover effects
                      'hover:border-coral/40 dark:hover:border-coral/50',
                      'hover:shadow-lg hover:-translate-y-1'
                    )}
                  >
                    {/* Medical equipment title */}
                    <h4 className={cn(
                      'font-bold font-heading mb-3 text-lg lg:text-xl',
                      'text-coral dark:text-coral',
                      'transition-colors duration-300'
                    )}>
                      {material.materialName}
                    </h4>
                    
                    {material.materialDescription && (
                      <p className={cn(
                        'font-body leading-relaxed text-base',
                        'text-blue-gray dark:text-clinical-white/80',
                        'transition-colors duration-300'
                      )}>
                        {material.materialDescription}
                      </p>
                    )}
                    
                    {/* Square corner accents - minimal */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-coral/30 opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-brand-blue/30 opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Medical Process Steps - Clean Professional Design */}
        <CraftsmanshipProcessClient data={processedData} />

        {/* Optional CTA - Clean Medical Button */}
        {processedData.enableCTA && processedData.ctaText && processedData.ctaLink && (
          <div className="text-center mt-16">
            <WorkshopButton
              href={processedData.ctaLink}
              variant="primary"
              size="lg"
              className="px-8 py-4"
            >
              {processedData.ctaText}
            </WorkshopButton>
          </div>
        )}

        {/* Medical Process Type Badge - Clean Professional */}
        <div className={cn(
          'absolute top-8 right-8 px-5 py-3 text-sm font-body font-bold',
          'opacity-70 transition-all duration-300 hover:opacity-100',
          'backdrop-blur-sm border-2 shadow-sm',
          'hover:scale-105 hover:-translate-y-1',
          processedData.processType === 'product' && [
            'bg-brand-blue/10 dark:bg-brand-blue/15',
            'text-brand-blue border-brand-blue/30',
            'shadow-brand-blue/10'
          ],
          processedData.processType === 'custom' && [
            'bg-coral/10 dark:bg-coral/15',
            'text-coral border-coral/30',
            'shadow-coral/10'
          ],
          processedData.processType === 'general' && [
            'bg-orange/10 dark:bg-orange/15',
            'text-orange border-orange/30',
            'shadow-orange/10'
          ]
        )}>
          <div className="flex items-center gap-2">
            {processedData.processType === 'product' && (
              <>
                <Shield className="w-4 h-4" />
                <span className="uppercase tracking-wider">Testing Process</span>
              </>
            )}
            {processedData.processType === 'custom' && (
              <>
                <Activity className="w-4 h-4" />
                <span className="uppercase tracking-wider">Custom Testing</span>
              </>
            )}
            {processedData.processType === 'general' && (
              <>
                <Award className="w-4 h-4" />
                <span className="uppercase tracking-wider">Medical Process</span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// Export types for reuse
export type { CraftsmanshipProcessBlockType }
