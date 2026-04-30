import LoginForm from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6 space-y-6">
      
      {/* Logo */}
      <h1 className="text-5xl font-bold text-green-800">
        matcha
      </h1>

      {/* Card */}
      <section className="w-full max-w-md rounded-xl bg-card p-6 shadow-sm border">
        <LoginForm />
      </section>

    </main>
  )
}