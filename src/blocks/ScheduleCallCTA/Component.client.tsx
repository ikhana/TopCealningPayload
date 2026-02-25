// blocks/ScheduleCallCTA/Component.client.tsx

'use client'

import React, { useCallback, useState, useEffect } from 'react'
import type { ScheduleCallCTABlock, Form as FormType, Media } from '@/payload-types'
import { BlockWrapper } from '@/components/BlockWrapper'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/cn'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { getClientSideURL } from '@/utilities/getURL'
import Image from 'next/image'

// Form field types
interface ScheduleCallFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  zipCode: string
  investableAssets: string
  message: string
}

// Investable Assets options - must match HubSpot dropdown values exactly
const INVESTABLE_ASSETS_OPTIONS = [
  { value: '', label: 'Select...' },
  { value: '$--', label: '$--' },
  { value: 'Under $100,000', label: 'Under $100,000' },
  { value: '$100,000 - $250,000', label: '$100,000 - $250,000' },
  { value: '$250,000 - $500,000', label: '$250,000 - $500,000' },
  { value: '$500,000 - $1,000,000', label: '$500,000 - $1,000,000' },
  { value: '$1,000,000 - $5,000,000', label: '$1,000,000 - $5,000,000' },
  { value: 'Over $5,000,000', label: 'Over $5,000,000' },
]

// HubSpot Configuration
const HUBSPOT_CONFIG = {
  portalId: '243589446',
  formId: 'db53fc39-3909-4175-ae86-ac71e1ae732c',
  region: 'na2',
}

const GradientBorders = () => (
  <>
    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
  </>
)

// Custom styled form components
const FormInput: React.FC<{
  label: string
  name: keyof ScheduleCallFormData
  type?: string
  placeholder?: string
  required?: boolean
  error?: string
  register: any
  disabled?: boolean
}> = ({ label, name, type = 'text', placeholder, required, error, register, disabled }) => (
  <div className="space-y-1.5">
    <label htmlFor={name} className="block text-sm font-medium text-foreground font-body">
      {label}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </label>
    <input
      id={name}
      type={type}
      placeholder={placeholder || label}
      disabled={disabled}
      className={cn(
        'flex h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm',
        'border border-input/60 transition-all duration-200',
        'placeholder:text-muted-foreground/60',
        'focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-destructive focus:border-destructive focus:ring-destructive/20'
      )}
      {...register(name, { required: required ? `${label} is required` : false })}
    />
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
)

const FormSelect: React.FC<{
  label: string
  name: keyof ScheduleCallFormData
  options: { value: string; label: string }[]
  required?: boolean
  error?: string
  register: any
  disabled?: boolean
}> = ({ label, name, options, required, error, register, disabled }) => (
  <div className="space-y-1.5">
    <label htmlFor={name} className="block text-sm font-medium text-foreground font-body">
      {label}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </label>
    <select
      id={name}
      disabled={disabled}
      className={cn(
        'flex h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm',
        'border border-input/60 transition-all duration-200',
        'focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")] bg-[length:1rem] bg-[right_0.5rem_center] bg-no-repeat',
        error && 'border-destructive focus:border-destructive focus:ring-destructive/20'
      )}
      {...register(name, { required: required ? `${label} is required` : false })}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
)

const FormTextarea: React.FC<{
  label: string
  name: keyof ScheduleCallFormData
  placeholder?: string
  required?: boolean
  error?: string
  register: any
  disabled?: boolean
  rows?: number
}> = ({ label, name, placeholder, required, error, register, disabled, rows = 3 }) => (
  <div className="space-y-1.5">
    <label htmlFor={name} className="block text-sm font-medium text-foreground font-body">
      {label}
      {!required && <span className="text-muted-foreground ml-1 text-xs">(optional)</span>}
    </label>
    <textarea
      id={name}
      placeholder={placeholder || label}
      rows={rows}
      disabled={disabled}
      className={cn(
        'flex w-full rounded-md bg-transparent px-3 py-2 text-sm resize-none',
        'border border-input/60 transition-all duration-200',
        'placeholder:text-muted-foreground/60',
        'focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-destructive focus:border-destructive focus:ring-destructive/20'
      )}
      {...register(name)}
    />
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
)

export function ScheduleCallCTAClient(props: ScheduleCallCTABlock) {
  const {
    sectionId,
    negativeOffset = true,
    showLogos = true,
    logos,
    heading,
    leftContent,
    founderSection,
    phoneNumber,
    phoneDisplay,
    form: formFromProps,
    disclaimer,
    enableCalendarToggle = false,
    calendarUrl,
    displayDuration = 5,
  } = props

  const [showCalendar, setShowCalendar] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<{ message: string; status?: number }>()

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ScheduleCallFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      zipCode: '',
      investableAssets: '',
      message: '',
    },
  })

  // Calendar toggle effect
  useEffect(() => {
    if (!enableCalendarToggle || !calendarUrl || isPaused) return
    const duration = displayDuration ?? 5
    const interval = setInterval(() => {
      setShowCalendar((prev) => !prev)
    }, duration * 1000)
    return () => clearInterval(interval)
  }, [enableCalendarToggle, calendarUrl, displayDuration, isPaused])

  // Submit to HubSpot via direct API (no hidden form needed)
  const submitToHubSpot = async (data: ScheduleCallFormData): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_CONFIG.portalId}/${HUBSPOT_CONFIG.formId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: [
              { name: 'firstname', value: data.firstName },
              { name: 'lastname', value: data.lastName },
              { name: 'email', value: data.email },
              { name: 'phone', value: data.phone },
              { name: 'zip_code', value: data.zipCode },
              { name: 'investable_assets', value: data.investableAssets },
              { name: 'message', value: data.message },
            ],
            context: {
              pageUri: typeof window !== 'undefined' ? window.location.href : '',
              pageName: typeof document !== 'undefined' ? document.title : '',
            },
          }),
        }
      )
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('HubSpot API error:', errorData)
        return false
      }
      
      console.log('HubSpot submission successful!')
      return true
    } catch (err) {
      console.error('HubSpot API error:', err)
      return false
    }
  }

  const onSubmit = useCallback(
    async (data: ScheduleCallFormData) => {
      const formID = (formFromProps as FormType)?.id
      const confirmationType = (formFromProps as FormType)?.confirmationType
      const redirect = (formFromProps as FormType)?.redirect

      setIsLoading(true)
      setError(undefined)

      try {
        // Submit to both Payload and HubSpot in parallel
        const [payloadResult, hubspotResult] = await Promise.allSettled([
          // Payload submission (for CMS tracking)
          formID ? fetch(`${getClientSideURL()}/api/form-submissions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              form: formID,
              submissionData: [
                { field: 'firstName', value: data.firstName },
                { field: 'lastName', value: data.lastName },
                { field: 'email', value: data.email },
                { field: 'phone', value: data.phone },
                { field: 'zipCode', value: data.zipCode },
                { field: 'investableAssets', value: data.investableAssets },
                { field: 'message', value: data.message },
              ],
            }),
          }) : Promise.resolve(null),
          
          // HubSpot submission
          submitToHubSpot(data),
        ])

        // Check if at least one succeeded
        const payloadSuccess = payloadResult.status === 'fulfilled' && 
          (payloadResult.value === null || (payloadResult.value as Response).ok)
        const hubspotSuccess = hubspotResult.status === 'fulfilled' && hubspotResult.value

        if (payloadSuccess || hubspotSuccess) {
          setHasSubmitted(true)
          reset()

          if (confirmationType === 'redirect' && redirect) {
            const redirectUrl = typeof redirect === 'object' ? redirect.url : redirect
            if (redirectUrl) router.push(redirectUrl)
          }
        } else {
          setError({ message: 'Failed to submit form. Please try again.' })
        }
      } catch (err) {
        console.error('Form submission error:', err)
        setError({ message: 'An unexpected error occurred. Please try again.' })
      } finally {
        setIsLoading(false)
      }
    },
    [router, formFromProps, reset]
  )

  const formID = (formFromProps as FormType)?.id
  const confirmationMessage = (formFromProps as FormType)?.confirmationMessage
  const submitButtonLabel = (formFromProps as FormType)?.submitButtonLabel

  const getImageUrl = (img: any): string | null => {
    if (typeof img === 'object' && img !== null && (img as Media).url) {
      return (img as Media).url!
    }
    return null
  }

  const getImageAlt = (img: any): string => {
    if (typeof img === 'object' && img !== null && (img as Media).alt) {
      return (img as Media).alt
    }
    return 'Image'
  }

  return (
    <BlockWrapper sectionId={sectionId}>
      <section 
        className={cn(
          'bg-muted dark:bg-[#1a2335] py-16',
          negativeOffset && '-mb-20 md:-mb-24'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Logos Section */}
          {showLogos && logos && logos.length > 0 && (
            <div className="flex flex-wrap justify-center items-center gap-6 py-10 mb-6">
              {logos.map((logo, idx) => {
                const logoUrl = getImageUrl(logo.logo)
                if (!logoUrl) return null
                return (
                  <div key={idx} className="flex items-center justify-center">
                    <Image
                      src={logoUrl}
                      alt={getImageAlt(logo.logo)}
                      width={logo.width || 120}
                      height={logo.height || 60}
                      className="object-contain"
                    />
                  </div>
                )
              })}
              <hr className="border-border w-full max-w-5xl" />
            </div>
          )}

          {/* Heading */}
          {heading && (
            <div className="text-center mt-6 mb-8 md:mb-12 px-4">
              <div className="prose prose-lg dark:prose-invert max-w-none mx-auto prose-headings:font-heading prose-headings:tracking-wide prose-headings:mb-0 prose-headings:mt-0 prose-h1:text-2xl prose-h1:sm:text-3xl prose-h1:font-bold prose-h1:text-primary prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:font-semibold prose-h2:text-primary prose-p:text-base prose-p:text-foreground">
                <RichText data={heading} enableGutter={false} enableProse={true} />
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="relative z-20 bg-card dark:bg-[#0b111a] max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto rounded-lg overflow-hidden border border-primary min-h-[500px] md:min-h-[600px]">
            <div className="flex flex-col md:flex-row min-h-[500px] md:min-h-[600px]">
              
              {/* Founder Image Section */}
              {founderSection?.image && getImageUrl(founderSection.image) && (
                <div className="md:w-[30%] flex flex-col justify-end md:border-r md:border-r-border p-6 pb-0">
                  <div className="relative w-full">
                    <GradientBorders />
                    <Image
                      src={getImageUrl(founderSection.image)!}
                      alt={getImageAlt(founderSection.image)}
                      width={300}
                      height={400}
                      className="w-full object-cover"
                    />
                    {(founderSection.name || founderSection.title) && (
                      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 border-l-8 border-l-primary bg-black/90 backdrop-blur-sm">
                        {founderSection.name && (
                          <p className="font-semibold text-sm text-white">{founderSection.name}</p>
                        )}
                        {founderSection.title && (
                          <p className="text-xs text-primary">{founderSection.title}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Form Section */}
              <div 
                className={cn(
                  "flex-1 p-6 md:p-8 relative overflow-hidden min-h-[500px] md:min-h-[600px] flex flex-col",
                  founderSection?.image ? "md:w-[70%]" : "w-full"
                )}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {/* Form View */}
                <div className={cn(
                  "transition-all duration-700 ease-in-out flex-1 flex flex-col",
                  enableCalendarToggle && calendarUrl && showCalendar 
                    ? "opacity-0 translate-x-full absolute inset-0 p-6 md:p-8 pointer-events-none" 
                    : "opacity-100 translate-x-0"
                )}>
                  {/* Left Content */}
                  <div className="prose prose-base dark:prose-invert max-w-none mb-6 prose-headings:font-heading prose-headings:tracking-wide prose-headings:mb-3 prose-headings:mt-0 prose-h1:text-xl prose-h1:font-semibold prose-h1:text-primary prose-h2:text-lg prose-h2:font-semibold prose-h2:text-primary prose-h3:text-base prose-h3:font-semibold prose-h3:text-foreground prose-p:text-sm prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:my-2 prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
                    <RichText data={leftContent} enableGutter={false} enableProse={true} />
                  </div>

                  {/* Phone Number */}
                  {phoneNumber && phoneDisplay && (
                    <div className="text-sm mb-4 flex items-center gap-2 font-medium border-b border-border pb-3">
                      <span className="text-foreground font-body uppercase text-xs tracking-wide">
                        Call us to schedule:
                      </span>
                      <a href={`tel:${phoneNumber}`} className="text-primary text-lg hover:underline font-semibold">
                        {phoneDisplay}
                      </a>
                    </div>
                  )}

                  {/* Form */}
                  <div className="flex-1 flex flex-col justify-center">
                    {hasSubmitted ? (
                      <div className="text-center py-8">
                        {confirmationMessage ? (
                          <RichText data={confirmationMessage} enableGutter={false} className="prose dark:prose-invert" />
                        ) : (
                          <div>
                            <div className="mb-4">
                              <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-foreground">Thank You!</h3>
                            <p className="text-muted-foreground">We'll be in touch with you shortly.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Row 1: First Name / Last Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormInput
                            label="First Name"
                            name="firstName"
                            placeholder="First Name"
                            required
                            register={register}
                            error={errors.firstName?.message}
                            disabled={isLoading}
                          />
                          <FormInput
                            label="Last Name"
                            name="lastName"
                            placeholder="Last Name"
                            required
                            register={register}
                            error={errors.lastName?.message}
                            disabled={isLoading}
                          />
                        </div>

                        {/* Row 2: Email / Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormInput
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            required
                            register={register}
                            error={errors.email?.message}
                            disabled={isLoading}
                          />
                          <FormInput
                            label="Phone Number"
                            name="phone"
                            type="tel"
                            placeholder="Phone Number"
                            required
                            register={register}
                            error={errors.phone?.message}
                            disabled={isLoading}
                          />
                        </div>

                        {/* Row 3: ZIP Code / Investable Assets */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormInput
                            label="ZIP Code"
                            name="zipCode"
                            placeholder="ZIP Code"
                            required
                            register={register}
                            error={errors.zipCode?.message}
                            disabled={isLoading}
                          />
                          <FormSelect
                            label="Investable Assets"
                            name="investableAssets"
                            options={INVESTABLE_ASSETS_OPTIONS}
                            required
                            register={register}
                            error={errors.investableAssets?.message}
                            disabled={isLoading}
                          />
                        </div>

                        {/* Row 4: Message */}
                        <FormTextarea
                          label="Message"
                          name="message"
                          placeholder="Message (optional)"
                          register={register}
                          disabled={isLoading}
                          rows={3}
                        />

                        {/* Error Display */}
                        {error && (
                          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
                            {error.message}
                          </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                              "relative w-full px-6 py-3 font-semibold uppercase tracking-wide text-sm",
                              "bg-primary text-primary-foreground transition-all duration-300",
                              "hover:bg-transparent hover:text-primary",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                              "disabled:opacity-50 disabled:cursor-not-allowed",
                              "border border-primary"
                            )}
                          >
                            {isLoading ? 'Sending...' : (submitButtonLabel || 'Talk to an Advisor')}
                          </button>
                        </div>

                        {/* Disclaimer */}
                        {disclaimer && (
                          <p className="text-[11px] text-muted-foreground leading-relaxed mt-3">
                            {disclaimer}
                          </p>
                        )}
                      </form>
                    )}
                  </div>
                </div>

                {/* Calendar View */}
                {enableCalendarToggle && calendarUrl && (
                  <div className={cn(
                    "transition-all duration-700 ease-in-out absolute inset-0 flex flex-col",
                    showCalendar 
                      ? "opacity-100 translate-x-0 pointer-events-auto" 
                      : "opacity-0 -translate-x-full pointer-events-none"
                  )}>
                    <div className="flex-1 p-6 md:p-8">
                      <iframe
                        src={calendarUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        className="w-full h-full min-h-[450px] rounded-md"
                        title="Schedule Appointment"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </BlockWrapper>
  )
}