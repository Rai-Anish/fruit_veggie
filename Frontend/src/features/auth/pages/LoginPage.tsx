import React from 'react'
import { Link } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import AuthLayout from '../AuthLayout'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const LoginPage: React.FC = () => {
  return (
    <AuthLayout>
      <Card className="md:w-[30rem] w-[22rem] p-8">
        <CardHeader>
          <CardTitle className="text-3xl">Login</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Enter your email and password to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col justify-center text-sm text-muted-foreground items-start">
          <Link
            className="hover:underline  text-green-600"
            to="/forgot-password"
          >
            Forgot Password?
          </Link>
          <span>
            Don't have an account?
            <Link className="hover:underline text-green-600" to="/signup">
              Create account
            </Link>
          </span>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}

export default LoginPage
