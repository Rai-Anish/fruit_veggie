// src/features/auth/pages/LoginPage.tsx
import React from 'react'
import { Title, Text, Anchor, Stack } from '@mantine/core'
import { Link as RouterLink } from 'react-router-dom' // Use RouterLink to prevent full page reload
import LoginForm from '../components/LoginForm'
import AuthLayout from '../../../layout/AuthLayout' // Your AuthLayout component
import { AppRoutes } from '../../../router/route'
import { useMantineTheme } from '@mantine/core'

const LoginPage: React.FC = () => {
  const theme = useMantineTheme()
  return (
    <AuthLayout>
      <Stack align="flex-start">
        <Title order={1} ta="center" mb="sm">
          Login
        </Title>
        <Text c="dimmed" size="sm" ta="center">
          Enter your email and password to access your account.
        </Text>
        <LoginForm />
        <Text c="dimmed" size="sm">
          <Anchor
            c={theme.colors.customColor[8]}
            component={RouterLink}
            to={AppRoutes.FORGOT_PASSWORD}
            size="sm"
          >
            Forgot Password
          </Anchor>
        </Text>
        <Text c="dimmed" size="sm" ta="center">
          Don't have an account yet?{' '}
          <Anchor
            c={theme.colors.customColor[8]}
            component={RouterLink}
            to={AppRoutes.SIGNUP}
            size="sm"
          >
            Create account
          </Anchor>
        </Text>
      </Stack>
    </AuthLayout>
  )
}

export default LoginPage
