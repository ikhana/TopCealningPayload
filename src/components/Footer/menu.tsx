import { CMSLink } from '@/components/Link'
import type { Footer } from '@/payload-types'

interface Props {
  labSections: Footer['labSections']
}

export function FooterMenu({ labSections }: Props) {
  if (!labSections?.length) return null

  return (
    <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {labSections.map((section, sectionIndex) => (
        <div key={section.id || sectionIndex} className="space-y-4">
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 border-2 border-coral bg-coral/10 flex items-center justify-center">
                <div className="w-1 h-1 bg-coral"></div>
              </div>
              <h4 className="text-lg font-bold text-dark-navy dark:text-clinical-white font-heading">
                {section.title}
              </h4>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-coral/40 via-coral/20 to-transparent"></div>
          </div>
          
          <ul className="space-y-3">
            {section.items?.map((item, itemIndex) => (
              <li key={item.id || itemIndex}>
                <CMSLink 
                  appearance="link" 
                  {...item.link}
                  className="group flex items-center gap-3 text-blue-gray dark:text-clinical-white/80 hover:text-coral transition-all duration-300 font-body text-sm"
                >
                  <div className="w-4 h-px bg-coral/30 group-hover:bg-coral transition-colors duration-300"></div>
                  <div className="w-1.5 h-1.5 border border-coral/40 group-hover:border-coral group-hover:bg-coral transition-all duration-300"></div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {item.link?.label}
                  </span>
                </CMSLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}