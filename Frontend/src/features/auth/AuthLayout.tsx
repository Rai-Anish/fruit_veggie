// src/features/auth/AuthLayout.tsx (Adjusted for overlay)
import React from 'react'
import authBackgroundImage from '../../assets/images/login_bg.webp'

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div
      className="relative flex h-screen w-screen bg-[url()] items-center bg-blend-overlay justify-center bg-black/40 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('${authBackgroundImage}')` }}
    >
      {children}
    </div>
  )
}

export default AuthLayout
