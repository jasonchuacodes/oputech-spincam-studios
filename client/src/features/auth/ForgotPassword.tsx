import { Button, Input, Label } from '../../components'
import { LoginLayout } from './components/LoginLayout'

export default function ForgotPasswordPage() {
  return (
    <LoginLayout>
      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground">Reset password</h1>
            <p className="mt-1 text-sm text-gray-500">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <div className="rounded-sm bg-white px-8 py-8 shadow-sm">
            <form className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>
              <Button type="submit" size="lg" className="mt-1 w-full">
                Send reset link
              </Button>
            </form>
          </div>
        </div>
      </main>
    </LoginLayout>
  )
}
