// src/components/Wholesale/WholesaleInquiry.tsx
'use client'

import { SectionHeading } from '@/components/ui/SectionHeading'
import { WorkshopButton } from '@/components/ui/WorkshopButton/WorkshopButton'
import { cn } from '@/utilities/cn'
import {
    Award,
    CheckCircle,
    DollarSign,
    Download,
    Mail,
    Package,
    Phone,
    Shield,
    Star,
    TrendingUp,
    Truck,
    Users
} from 'lucide-react'
import React, { useState } from 'react'

interface WholesaleInquiryProps {
  className?: string
}

export const WholesaleInquiry: React.FC<WholesaleInquiryProps> = ({ className }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    location: '',
    experience: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In real app, this would submit to an API
    console.log('Wholesale inquiry submitted:', formData)
  }

  return (
    <section className={cn(
      'py-16 lg:py-24 transition-colors duration-300',
      'bg-antique-white dark:bg-charcoal-black',
      className
    )}>
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <SectionHeading
            title="Wholesale Partnership"
            subtitle="Join our exclusive network of premium retailers and grow your business with Buford's luxury accessories"
            level="h2"
            size="lg"
            align="center"
            theme="auto"
            className="max-w-4xl mx-auto"
          />
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: TrendingUp,
              title: 'High Margins',
              description: 'Competitive wholesale pricing with strong profit margins for premium positioning.',
              color: 'copper-bourbon'
            },
            {
              icon: Award,
              title: 'Premium Brand',
              description: 'Associate with a respected luxury brand known for craftsmanship and quality.',
              color: 'charcoal-gold'
            },
            {
              icon: Users,
              title: 'Dedicated Support',
              description: 'Personal account management and ongoing business development support.',
              color: 'antique-brass'
            },
            {
              icon: Package,
              title: 'Marketing Materials',
              description: 'Professional displays, catalogs, and marketing support to drive sales.',
              color: 'smoky-gray'
            }
          ].map((benefit, index) => (
            <div
              key={index}
              className={cn(
                'text-center p-6 rounded-lg transition-all duration-300 hover:scale-105',
                'bg-white/60 border border-antique-brass/20',
                'dark:bg-deep-charcoal/60 dark:border-charcoal-gold/20'
              )}
            >
              <div className={cn(
                'w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center',
                `bg-${benefit.color}/10`,
                `text-${benefit.color}`
              )}>
                <benefit.icon className="w-8 h-8" />
              </div>
              <h3 className={cn(
                'font-playfair text-lg font-semibold mb-2 transition-colors duration-300',
                'text-deep-charcoal dark:text-antique-white'
              )}>
                {benefit.title}
              </h3>
              <p className={cn(
                'text-sm transition-colors duration-300',
                'text-antique-brass dark:text-smoky-gray'
              )}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Left Column - Requirements & Info */}
          <div>
            
            {/* Dealer Requirements */}
            <div className={cn(
              'mb-8 p-6 rounded-lg transition-colors duration-300',
              'bg-white/60 border border-antique-brass/20',
              'dark:bg-deep-charcoal/60 dark:border-charcoal-gold/20'
            )}>
              <h3 className={cn(
                'font-playfair text-xl font-semibold mb-4 transition-colors duration-300',
                'text-deep-charcoal dark:text-antique-white'
              )}>
                Dealer Requirements
              </h3>
              <ul className="space-y-3">
                {[
                  'Established retail business with appropriate licenses',
                  'Physical storefront or premium online presence',
                  'Experience in luxury goods or premium accessories',
                  'Commitment to brand standards and customer service',
                  'Minimum initial order requirements',
                  'Dedicated display space for Buford products'
                ].map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className={cn(
                      'w-5 h-5 mt-0.5 flex-shrink-0 transition-colors duration-300',
                      'text-copper-bourbon dark:text-charcoal-gold'
                    )} />
                    <span className={cn(
                      'text-sm transition-colors duration-300',
                      'text-antique-brass dark:text-smoky-gray'
                    )}>
                      {requirement}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What We Offer */}
            <div className={cn(
              'mb-8 p-6 rounded-lg transition-colors duration-300',
              'bg-white/60 border border-antique-brass/20',
              'dark:bg-deep-charcoal/60 dark:border-charcoal-gold/20'
            )}>
              <h3 className={cn(
                'font-playfair text-xl font-semibold mb-4 transition-colors duration-300',
                'text-deep-charcoal dark:text-antique-white'
              )}>
                What We Offer
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: DollarSign, text: 'Competitive Pricing' },
                  { icon: Truck, text: 'Fast Shipping' },
                  { icon: Shield, text: 'Quality Guarantee' },
                  { icon: Star, text: 'Marketing Support' }
                ].map((offer, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <offer.icon className={cn(
                      'w-4 h-4 transition-colors duration-300',
                      'text-copper-bourbon dark:text-charcoal-gold'
                    )} />
                    <span className={cn(
                      'text-sm transition-colors duration-300',
                      'text-antique-brass dark:text-smoky-gray'
                    )}>
                      {offer.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className={cn(
              'p-6 rounded-lg transition-colors duration-300',
              'bg-white/60 border border-antique-brass/20',
              'dark:bg-deep-charcoal/60 dark:border-charcoal-gold/20'
            )}>
              <h3 className={cn(
                'font-playfair text-xl font-semibold mb-4 transition-colors duration-300',
                'text-deep-charcoal dark:text-antique-white'
              )}>
                Wholesale Contact
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className={cn(
                    'w-4 h-4 transition-colors duration-300',
                    'text-copper-bourbon dark:text-charcoal-gold'
                  )} />
                  <a 
                    href="tel:+1-502-555-0100"
                    className={cn(
                      'text-sm transition-colors duration-200 hover:underline',
                      'text-antique-brass hover:text-copper-bourbon',
                      'dark:text-smoky-gray dark:hover:text-charcoal-gold'
                    )}
                  >
                    (502) 555-0100
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className={cn(
                    'w-4 h-4 transition-colors duration-300',
                    'text-copper-bourbon dark:text-charcoal-gold'
                  )} />
                  <a 
                    href="mailto:wholesale@buford.com"
                    className={cn(
                      'text-sm transition-colors duration-200 hover:underline',
                      'text-antique-brass hover:text-copper-bourbon',
                      'dark:text-smoky-gray dark:hover:text-charcoal-gold'
                    )}
                  >
                    wholesale@buford.com
                  </a>
                </div>
              </div>
              
              <div className="mt-4">
                <WorkshopButton
                  as="link"
                  href="/catalog.pdf"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Catalog
                </WorkshopButton>
              </div>
            </div>
          </div>

          {/* Right Column - Inquiry Form */}
          <div>
            <div className={cn(
              'p-8 rounded-lg transition-colors duration-300',
              'bg-white/60 border border-antique-brass/20',
              'dark:bg-deep-charcoal/60 dark:border-charcoal-gold/20'
            )}>
              <h3 className={cn(
                'font-playfair text-2xl font-semibold mb-6 transition-colors duration-300',
                'text-deep-charcoal dark:text-antique-white'
              )}>
                Become a Dealer
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Business Name */}
                <div>
                  <label className={cn(
                    'block text-sm font-semibold mb-2 transition-colors duration-300',
                    'text-deep-charcoal dark:text-antique-white'
                  )}>
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                    className={cn(
                      'w-full px-4 py-3 rounded-lg transition-colors duration-300',
                      'bg-white/80 dark:bg-charcoal-black/40',
                      'border border-antique-brass/30 dark:border-charcoal-gold/30',
                      'text-deep-charcoal dark:text-antique-white',
                      'placeholder:text-smoky-gray/60',
                      'focus:outline-none focus:ring-2 focus:ring-copper-bourbon/40'
                    )}
                    placeholder="Your Business Name"
                  />
                </div>

                {/* Contact Name */}
                <div>
                  <label className={cn(
                    'block text-sm font-semibold mb-2 transition-colors duration-300',
                    'text-deep-charcoal dark:text-antique-white'
                  )}>
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    required
                    className={cn(
                      'w-full px-4 py-3 rounded-lg transition-colors duration-300',
                      'bg-white/80 dark:bg-charcoal-black/40',
                      'border border-antique-brass/30 dark:border-charcoal-gold/30',
                      'text-deep-charcoal dark:text-antique-white',
                      'placeholder:text-smoky-gray/60',
                      'focus:outline-none focus:ring-2 focus:ring-copper-bourbon/40'
                    )}
                    placeholder="Your Full Name"
                  />
                </div>

                {/* Email & Phone Row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={cn(
                      'block text-sm font-semibold mb-2 transition-colors duration-300',
                      'text-deep-charcoal dark:text-antique-white'
                    )}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={cn(
                        'w-full px-4 py-3 rounded-lg transition-colors duration-300',
                        'bg-white/80 dark:bg-charcoal-black/40',
                        'border border-antique-brass/30 dark:border-charcoal-gold/30',
                        'text-deep-charcoal dark:text-antique-white',
                        'placeholder:text-smoky-gray/60',
                        'focus:outline-none focus:ring-2 focus:ring-copper-bourbon/40'
                      )}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className={cn(
                      'block text-sm font-semibold mb-2 transition-colors duration-300',
                      'text-deep-charcoal dark:text-antique-white'
                    )}>
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={cn(
                        'w-full px-4 py-3 rounded-lg transition-colors duration-300',
                        'bg-white/80 dark:bg-charcoal-black/40',
                        'border border-antique-brass/30 dark:border-charcoal-gold/30',
                        'text-deep-charcoal dark:text-antique-white',
                        'placeholder:text-smoky-gray/60',
                        'focus:outline-none focus:ring-2 focus:ring-copper-bourbon/40'
                      )}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {/* Business Type */}
                <div>
                  <label className={cn(
                    'block text-sm font-semibold mb-2 transition-colors duration-300',
                    'text-deep-charcoal dark:text-antique-white'
                  )}>
                    Business Type *
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    required
                    className={cn(
                      'w-full px-4 py-3 rounded-lg transition-colors duration-300',
                      'bg-white/80 dark:bg-charcoal-black/40',
                      'border border-antique-brass/30 dark:border-charcoal-gold/30',
                      'text-deep-charcoal dark:text-antique-white',
                      'focus:outline-none focus:ring-2 focus:ring-copper-bourbon/40'
                    )}
                  >
                    <option value="">Select Business Type</option>
                    <option value="cigar-lounge">Cigar Lounge</option>
                    <option value="tobacco-shop">Tobacco Shop</option>
                    <option value="liquor-store">Liquor Store</option>
                    <option value="gift-shop">Gift Shop</option>
                    <option value="luxury-boutique">Luxury Boutique</option>
                    <option value="online-retailer">Online Retailer</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className={cn(
                    'block text-sm font-semibold mb-2 transition-colors duration-300',
                    'text-deep-charcoal dark:text-antique-white'
                  )}>
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className={cn(
                      'w-full px-4 py-3 rounded-lg transition-colors duration-300',
                      'bg-white/80 dark:bg-charcoal-black/40',
                      'border border-antique-brass/30 dark:border-charcoal-gold/30',
                      'text-deep-charcoal dark:text-antique-white',
                      'placeholder:text-smoky-gray/60',
                      'focus:outline-none focus:ring-2 focus:ring-copper-bourbon/40'
                    )}
                    placeholder="City, State"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className={cn(
                    'block text-sm font-semibold mb-2 transition-colors duration-300',
                    'text-deep-charcoal dark:text-antique-white'
                  )}>
                    Years in Business
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={cn(
                      'w-full px-4 py-3 rounded-lg transition-colors duration-300',
                      'bg-white/80 dark:bg-charcoal-black/40',
                      'border border-antique-brass/30 dark:border-charcoal-gold/30',
                      'text-deep-charcoal dark:text-antique-white',
                      'focus:outline-none focus:ring-2 focus:ring-copper-bourbon/40'
                    )}
                  >
                    <option value="">Select Experience</option>
                    <option value="less-than-1">Less than 1 year</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10-plus">10+ years</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className={cn(
                    'block text-sm font-semibold mb-2 transition-colors duration-300',
                    'text-deep-charcoal dark:text-antique-white'
                  )}>
                    Tell Us About Your Business
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className={cn(
                      'w-full px-4 py-3 rounded-lg transition-colors duration-300',
                      'bg-white/80 dark:bg-charcoal-black/40',
                      'border border-antique-brass/30 dark:border-charcoal-gold/30',
                      'text-deep-charcoal dark:text-antique-white',
                      'placeholder:text-smoky-gray/60',
                      'focus:outline-none focus:ring-2 focus:ring-copper-bourbon/40'
                    )}
                    placeholder="Describe your business, target customers, and why you'd like to carry Buford products..."
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <WorkshopButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    Submit Wholesale Inquiry
                  </WorkshopButton>
                </div>

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}