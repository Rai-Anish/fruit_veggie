import React, { useEffect } from 'react'
import { type LoginPayload, loginSchema } from '../types/authSchema'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { TextInput, Button, useMantineTheme, Stack } from '@mantine/core'
import axios from 'axios'

const LoginForm: React.FC = () => {
  const theme = useMantineTheme()

  const form = useForm<LoginPayload>({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },

    validate: zodResolver(loginSchema),
  })

  const handleSubmit = async (values: LoginPayload) => {
    try {
      const response = await axios.post('/api/v1/auth/login', {
        email: values.email,
        password: values.password,
      })

      if (response.data.success) {
        console.log(response.data)
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }

  return (
    <Stack w="100%">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          mt="sm"
          label="Email"
          placeholder="Email"
          key={form.key('email')}
          {...form.getInputProps('email')}
        />
        <TextInput
          mt="sm"
          label="Password"
          placeholder="Password"
          key={form.key('password')}
          {...form.getInputProps('password')}
        />

        <Button
          w="40%"
          color={theme.colors.customColor[8]}
          type="submit"
          mt="md"
        >
          Submit
        </Button>
      </form>
    </Stack>
  )
}

export default LoginForm
