import React from 'react'

export const ShopHero: React.FC = () => {
  return (
    <section className="relative -mt-[10.4rem] w-full h-[40vh] lg:h-[45vh] overflow-hidden">
      
      {/* Background Image - Ready for your Flux-generated image */}
      <div className="absolute inset-0">
        <img
          src="/shop-hero-bg.jpg" // Your Flux-generated image path
          alt="Handcrafted bourbon and cigar accessories workspace"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>
      
      {/* Gradient Overlay for Content Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-deep-charcoal/90 via-deep-charcoal/70 to-deep-charcoal/30" />
      
      {/* Heritage texture overlay - subtle luxury touch */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B87333' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3Ccircle cx='0' cy='30' r='1'/%3E%3Ccircle cx='60' cy='30' r='1'/%3E%3Ccircle cx='30' cy='0' r='1'/%3E%3Ccircle cx='30' cy='60' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />
      
      {/* Hero Content - Left-aligned following "Products are the Hero" philosophy */}
      <div className="absolute inset-0 flex items-center pt-[10.4rem]">
        <div className="container">
          <div className="max-w-2xl">
            
            {/* Heritage corner accents */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-4 h-4 border-l-2 border-t-2 border-copper-bourbon/60" />
              <div className="absolute -bottom-4 -right-4 w-4 h-4 border-r-2 border-b-2 border-copper-bourbon/60" />
              
              {/* Main heading - brief and sophisticated */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wide font-playfair text-antique-white mb-4 leading-tight">
                Handcrafted Collections
              </h1>
              
              {/* Subtitle - minimal and focused */}
              <p className="text-base sm:text-lg font-sourcesans leading-relaxed text-antique-white/90 mb-6 max-w-xl">
                Premium bourbon accessories & cigar essentials, meticulously crafted for the discerning enthusiast
              </p>
              
              {/* Heritage accent line */}
              <div className="w-20 h-0.5 bg-gradient-to-r from-copper-bourbon via-copper-bourbon/80 to-transparent" />
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Subtle vignette for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/20 via-transparent to-transparent pointer-events-none" />
      
    </section>
  )
}