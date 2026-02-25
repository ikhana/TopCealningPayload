import React from 'react'
import './styles.scss'

export const BeforeLogin: React.FC = () => {
  return (
    <div className="brand-bloom-login-minimal">
      <img 
        src="/admin-assets/logo-main-new-brandbloom.png" 
        alt="Brand Bloom" 
        className="login-logo"
      />
      <p className="login-tagline">
        Custom solutions designed to make your brand bloom
      </p>
    </div>
  )
}