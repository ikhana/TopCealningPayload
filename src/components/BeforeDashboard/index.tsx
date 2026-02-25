
import React from 'react'
//import { SeedButton } from './SeedButton'
import './styles.scss'


export const BeforeDashboard: React.FC = () => {
  return (
    <div className="brand-bloom-header">
      <img 
        src="/admin-assets/logo-main-new-brandbloom.png" 
        alt="Brand Bloom" 
        className="brand-logo"
      />
      <p className="brand-tagline">
     MANAGING YOUR DEGITAL PRESENCE
      </p>
 { /**<SeedButton/>*/}
    </div>
  )
}