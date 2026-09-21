import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Button, Input, Label, PasswordInput } from '../../components'
import { LoginLayout } from './components/LoginLayout'
import { PublicRoutes } from '../../routes/paths'
import { registerSchema } from './schemas/register.schema'
import { Footer } from './components/Footer'
import { useRegisterMutation } from '../../services/auth/auth.queries'
import { useAuthContext } from '../../context/auth/useAuthContext'
import { RegisterInput } from '../../services/auth/auth.types'

export default function RegisterPage() {
  const { auth, loading } = useAuthContext()
  const navigate = useNavigate()

  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  const { mutate: registerUser, isPending } = useRegisterMutation()

  const onSubmit = (data: RegisterInput) => {
    registerUser(data, {
      onSuccess: () => {
        setError(null)
        navigate(PublicRoutes.Login)
      },
      onError: (err) => {
        setError(
          isAxiosError(err)
            ? (err.response?.data?.message ?? 'Registration failed')
            : 'Registration failed'
        )
      },
      onSettled: () => {
        reset()
      },
    })
  }

  useEffect(() => {
    if (!loading && auth) {
      navigate('/', { replace: true })
    }
  }, [auth, loading, navigate])

  return (
    <LoginLayout>
      <main className="flex h-full min-h-full flex-col px-4 py-12">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="rounded-sm bg-white px-8 py-8 shadow-sm">
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-foreground">
                  Create account
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Get started with Spincam
                </p>
              </div>
              <form
                className="flex flex-col gap-5"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    autoComplete="username"
                    {...register('username')}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput
                    id="password"
                    placeholder="Create a password"
                    autoComplete="new-password"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button
                  type="submit"
                  size="lg"
                  className="mt-1 w-full"
                  disabled={isPending}
                >
                  {isPending ? 'Creating account…' : 'Create account'}
                </Button>
                <p className="mt-6 text-center text-sm text-gray-500">
                  Already have an account?{' '}
                  <Link
                    to={PublicRoutes.Login}
                    className="font-medium text-foreground hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </LoginLayout>
  )
}
