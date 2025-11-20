// src/pages/VerifyEmailNoticePage.tsx
import React from 'react'
import { useResendVerifyEmail } from '../hooks/useResendVerifyEmail'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const VerifyEmailNoticePage: React.FC = () => {
  const { isPending, mutate } = useResendVerifyEmail()

  const resendVerificationEmail = () => {
    mutate()
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-slate-100">
      <Card className="md:w-[32rem] w-[23rem] *:px-5 *:text-center bg-white shadow border-0">
        <CardTitle>
          We've sent a verification link to your email address.
        </CardTitle>
        <CardContent>
          <CardDescription>
            Please check your inbox (and spam folder) and click the link to
            activate your account.
          </CardDescription>
          <CardDescription>
            Still can't find the email? No problem
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button disabled={isPending} onClick={resendVerificationEmail}>
            Resend Verification Email
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default VerifyEmailNoticePage
