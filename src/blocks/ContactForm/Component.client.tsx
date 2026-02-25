// blocks/ContactForm/Component.client.tsx

'use client'

import React, { useCallback, useState } from 'react'
import type { ContactFormBlock, Form as FormType } from '@/payload-types'
import { BlockWrapper } from '@/components/BlockWrapper'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/cn'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { getClientSideURL } from '@/utilities/getURL'
import { countryOptions } from '../Form/Country/options'

// HubSpot Configuration
const HUBSPOT_CONFIG = {
  portalId: '243589446',
  formId: 'c403df04-bf71-49f1-b0b9-ee206f6a2776',
  region: 'na2',
}

// Form field types
interface ContactFormData {
  firstName: string
  lastName: string
  company: string
  email: string
  phone: string
  country: string
  message: string
}

// Gradient borders for form container
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
  name: keyof ContactFormData
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
  name: keyof ContactFormData
  options: { value: string; label: string }[]
  required?: boolean
  error?: string
  register: any
  disabled?: boolean
  placeholder?: string
}> = ({ label, name, options, required, error, register, disabled, placeholder }) => (
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
      <option value="">{placeholder || `Select ${label}`}</option>
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
  name: keyof ContactFormData
  placeholder?: string
  required?: boolean
  error?: string
  register: any
  disabled?: boolean
  rows?: number
}> = ({ label, name, placeholder, required, error, register, disabled, rows = 4 }) => (
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

export function ContactFormClient(props: ContactFormBlock) {
  const {
    sectionId,
    backgroundStyle = 'muted',
    form: formFromProps,
    leftContent,
    contactEmails,
  } = props

  const backgroundClasses = {
    default: 'bg-white dark:bg-[#1a2333f0]',
    muted: 'bg-muted dark:bg-card',
    card: 'bg-card dark:bg-card',
  }

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<{ message: string; status?: number }>()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      company: '',
      email: '',
      phone: '',
      country: '',
      message: '',
    },
  })

  const formID = (formFromProps as FormType)?.id
  const confirmationMessage = (formFromProps as FormType)?.confirmationMessage
  const confirmationType = (formFromProps as FormType)?.confirmationType
  const redirect = (formFromProps as FormType)?.redirect
  const submitButtonLabel = (formFromProps as FormType)?.submitButtonLabel

  // Submit to HubSpot via direct API
  const submitToHubSpot = async (data: ContactFormData): Promise<boolean> => {
    try {
      const hubspotData = {
        fields: [
          { name: 'firstname', value: data.firstName },
          { name: 'lastname', value: data.lastName },
          { name: '0-2/name', value: data.company },
          { name: 'email', value: data.email },
          { name: 'phone', value: data.phone },
          { name: 'country', value: data.country },
          { name: 'message', value: data.message },
        ],
        context: {
          pageUri: typeof window !== 'undefined' ? window.location.href : '',
          pageName: typeof document !== 'undefined' ? document.title : '',
        },
      }
      
      console.log('Submitting to HubSpot:', hubspotData)
      
      const response = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_CONFIG.portalId}/${HUBSPOT_CONFIG.formId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(hubspotData),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('HubSpot API error status:', response.status)
        console.error('HubSpot API error response:', errorText)
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
    async (data: ContactFormData) => {
      setIsLoading(true)
      setError(undefined)

      try {
        // Submit to both Payload and HubSpot in parallel
        const [payloadResult, hubspotResult] = await Promise.allSettled([
          // Payload submission (for CMS tracking)
          formID
            ? fetch(`${getClientSideURL()}/api/form-submissions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  form: formID,
                  submissionData: [
                    { field: 'firstName', value: data.firstName },
                    { field: 'lastName', value: data.lastName },
                    { field: 'company', value: data.company },
                    { field: 'email', value: data.email },
                    { field: 'phone', value: data.phone },
                    { field: 'country', value: data.country },
                    { field: 'message', value: data.message },
                  ],
                }),
              })
            : Promise.resolve(null),

          // HubSpot submission
          submitToHubSpot(data),
        ])

        // Check if at least one succeeded
        const payloadSuccess =
          payloadResult.status === 'fulfilled' &&
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
    [router, formID, confirmationType, redirect, reset]
  )

  if (!formFromProps || !formID) {
    return (
      <BlockWrapper sectionId={sectionId}>
        <section className={cn(backgroundClasses[backgroundStyle as keyof typeof backgroundClasses])}>
          <div className="container mx-auto py-12 px-4">
            <p className="text-center text-muted-foreground">
              No contact form configured. Please select a form in the admin.
            </p>
          </div>
        </section>
      </BlockWrapper>
    )
  }

  return (
    <BlockWrapper sectionId={sectionId}>
      <section className={cn(backgroundClasses[backgroundStyle as keyof typeof backgroundClasses])}>
        <div className="container mx-auto py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Left Column - Contact Info */}
            <div className="w-full lg:w-1/2">
              <div
                className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:font-heading prose-headings:tracking-wide prose-headings:mb-4 prose-headings:mt-0
                prose-h1:text-3xl prose-h1:sm:text-4xl prose-h1:lg:text-5xl prose-h1:font-bold prose-h1:text-foreground
                prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:font-semibold prose-h2:text-foreground
                prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:font-semibold prose-h3:text-primary
                prose-p:text-base prose-p:sm:text-lg prose-p:text-foreground prose-p:leading-relaxed prose-p:my-4
                prose-strong:text-primary prose-strong:font-semibold
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              >
                <RichText data={leftContent} enableGutter={false} enableProse={true} />
              </div>

              {/* Contact Emails */}
              {contactEmails && contactEmails.length > 0 && (
                <div className="mt-8 space-y-3">
                  {contactEmails.map((contact, idx) => (
                    <div key={idx} className="text-base sm:text-lg">
                      <span className="font-semibold text-primary">{contact.label}:</span>{' '}
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-foreground hover:text-primary transition-colors underline"
                      >
                        {contact.email}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Form */}
            <div className="w-full lg:w-1/2">
              <div className="relative bg-card dark:bg-[#0f131b] p-6 sm:p-8 lg:p-10">
                <GradientBorders />

                <div className="relative z-10">
                  {hasSubmitted ? (
                    <div className="text-center py-8">
                      {confirmationMessage ? (
                        <RichText
                          data={confirmationMessage}
                          enableGutter={false}
                          className="prose dark:prose-invert"
                        />
                      ) : (
                        <div>
                          <div className="mb-4">
                            <svg
                              className="mx-auto h-12 w-12 text-green-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold mb-2 text-foreground">Thank You!</h3>
                          <p className="text-muted-foreground">
                            We've received your message and will get back to you soon.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

                      {/* Row 2: Company Name */}
                      <FormInput
                        label="Company Name"
                        name="company"
                        placeholder="Company Name"
                        required
                        register={register}
                        error={errors.company?.message}
                        disabled={isLoading}
                      />

                      {/* Row 3: Email */}
                      <FormInput
                        label="Work Email Address"
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        required
                        register={register}
                        error={errors.email?.message}
                        disabled={isLoading}
                      />

                      {/* Row 4: Phone */}
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

                      {/* Row 5: Country */}
                      <FormSelect
                        label="Where are you located?"
                        name="country"
                        options={countryOptions}
                        placeholder="Select country/region"
                        required
                        register={register}
                        error={errors.country?.message}
                        disabled={isLoading}
                      />

                      {/* Row 6: Message */}
                      <FormTextarea
                        label="What is your message?"
                        name="message"
                        placeholder="Type something..."
                        register={register}
                        disabled={isLoading}
                        rows={4}
                      />

                      {/* Error Display */}
                      {error && (
                        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
                          {error.message}
                        </div>
                      )}

                      {/* Submit Button */}
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={cn(
                            'relative w-full px-6 py-3 font-semibold uppercase tracking-wide text-sm',
                            'bg-primary text-primary-foreground transition-all duration-300',
                            'hover:bg-transparent hover:text-primary',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            'border border-primary'
                          )}
                        >
                          {isLoading ? 'Sending...' : submitButtonLabel || 'Send Message'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BlockWrapper>
  )
}