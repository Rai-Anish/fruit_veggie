// src/pages/VerifyEmailPage.tsx
import React, { useEffect, useOptimistic, useState } from 'react'
import { useResendVerifyEmail } from '../hooks/useResendVerifyEmail'

import { IconCheck, IconLoader, IconX, type Icon } from '@tabler/icons-react'
import { AppIcon } from '../../../assets/icons/AppIcon'
import { useVerifyEmail } from '../hooks/useVerifyEmail'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getDefaultDashboardRoute } from '@/router/route'

type ui = {
  title: string
  message: string
  color?: string
  logo: Icon
  showResend: boolean
}

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') as string
  const resendEmail = useResendVerifyEmail()
  const { mutate, isPending, data } = useVerifyEmail()
  const navigate = useNavigate()

  const [ui, setUi] = useState<ui>({
    title: 'Verifying your email...',
    message:
      'Please wait your email is being verified. It may take few minutes.',
    logo: IconLoader,
    color: 'text-black',
    showResend: false,
  })

  const resendVerificationEmail = () => {
    resendEmail.mutate()
  }

  useEffect(() => {
    if (!token) return

    mutate(token, {
      onSuccess: () => {
        setUi({
          title: 'Email verified successfully',
          message: 'Redirecting to home page',
          color: 'text-green-700',
          logo: IconCheck,
          showResend: false,
        })
        setTimeout(() => {
          const path = getDefaultDashboardRoute(data?.data?.user?.role)
          navigate(path, { replace: true })
        }, 4000)
      },
      onError: () => {
        setUi({
          title: 'Email verification failed',
          message:
            'Looks like the verification link has expired. Not to worry, we can send the link again.',
          color: 'text-red-700',
          logo: IconX,
          showResend: true,
        })
      },
    })
  }, [token, mutate])

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-slate-100">
      <Card className="md:w-[32rem] w-[23rem] *:px-5 *:text-center bg-white shadow border-0">
        <CardTitle>
          <div className="flex flex-col items-center justify-center gap-2 ">
            <AppIcon
              icon={ui.logo}
              className={isPending ? 'animate-spin' : ''}
            />
            {ui.title}
          </div>
        </CardTitle>
        <CardContent>
          <CardDescription>{ui.message}</CardDescription>
        </CardContent>
        <CardFooter className="flex justify-center">
          {ui.showResend && (
            <Button disabled={isPending} onClick={resendVerificationEmail}>
              Resend Verification Email
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default VerifyEmailPage
