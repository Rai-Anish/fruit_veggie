import React from 'react'
import { Box, Paper, Title, BackgroundImage } from '@mantine/core'
import loginBackgroundImage from '../assets/images/login_bg.webp'

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <BackgroundImage
      src={loginBackgroundImage}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(44, 44, 44, 0.4)',
          zIndex: 0,
        }}
      />

      <Paper
        withBorder
        shadow="md"
        p="lg"
        radius="md"
        style={{
          width: '100%',
          maxWidth: 400,
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          position: 'relative',
        }}
      >
        <Title order={2} ta="center" mb="lg"></Title>
        {children}
      </Paper>
    </BackgroundImage>
  )
}

export default AuthLayout
