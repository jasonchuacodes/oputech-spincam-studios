import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Button, Input, Label, PasswordInput } from '../../components'
import { Footer } from './components/Footer'
import { LoginLayout } from './components/LoginLayout'
import { PublicRoutes, UserRoutes } from '../../routes/paths'
import { useLoginMutation } from '../../services/auth/auth.queries'
import { useAuthContext } from '../../context/auth/useAuthContext'
import { LoginInput } from '../../services/auth/auth.types'
import { loginSchema } from './schemas/login.schema'
import { UserRole } from '../../types'

export default function LoginPage() {
  const { auth, loading, refetch: refetchAuth } = useAuthContext()
  const navigate = useNavigate()

  const [error, setError] = useState<string | null>(null)

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const { mutate: login, isPending } = useLoginMutation()

  const onSubmit = (data: LoginInput) => {
    login(data, {
      onSuccess: async () => {
        await refetchAuth()
        setError(null)
        navigate('/')
      },
      onError: (err) => {
        setError(
          isAxiosError(err)
            ? (err.response?.data?.message ?? 'Invalid credentials')
            : 'Invalid credentials'
        )
      },
      onSettled: () => {
        reset()
      },
    })
  }

  useEffect(() => {
    if (loading || !auth) return

    if (auth.role === UserRole.ADMIN) navigate(UserRoutes.Home, { replace: true })
    if (auth.role === UserRole.USER) navigate(UserRoutes.POS, { replace: true })
  }, [auth, loading, navigate])

  return (
    <LoginLayout>
      <main className="flex h-full min-h-full flex-col px-4 py-6">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="rounded-sm bg-white p-8 shadow-sm">
              <div className="mb-6 flex justify-center">
                <img
                  src="/assets/brand/icon-192.png"
                  alt="Spincam"
                  className="h-14 w-14"
                />
              </div>
              <div className="mb-8 text-center">
                <h1 className="text-foreground text-2xl font-bold">
                  Spincam Studios
                </h1>
                <p className="text-md mt-1 text-gray-500">
                  Welcome back. Please enter your details.
                </p>
              </div>
              <form
                className="flex flex-col gap-5"
                onSubmit={handleSubmit((data) => onSubmit(data))}
              >
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
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
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                  <div className="mt-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        id="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                      />
                      <Label
                        htmlFor="remember-me"
                        className="text-sm font-normal text-gray-500"
                      >
                        Remember me
                      </Label>
                    </div>
                    <Link
                      to={PublicRoutes.ForgotPassword}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button
                  type="submit"
                  size="lg"
                  className="mt-1 w-full"
                  disabled={!isValid}
                >
                  {isPending ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </LoginLayout>
  )
}
