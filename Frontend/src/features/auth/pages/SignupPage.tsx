import React from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../AuthLayout'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import SignupForm from '../components/SignupForm'

const SignupPage: React.FC = () => {
  return (
    <AuthLayout>
      <Card className="md:w-[30rem] w-[22rem]">
        <CardHeader>
          <CardTitle className="text-3xl">Sign Up</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
        <CardFooter className="flex flex-col justify-center text-sm text-muted-foreground items-start">
          <span>
            Already have an account?
            <Link className="hover:underline text-green-600" to="/login">
              Sign In
            </Link>
          </span>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}

export default SignupPage
