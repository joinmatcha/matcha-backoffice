import Image from "next/image"
import LoginForm from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(112deg,transparent_0_62%,rgba(255,255,255,0.42)_62%_73%,transparent_73%_100%)]" />
      <section className="matcha-card relative w-full max-w-md p-7">
        <div className="mb-7 flex justify-center">
          <Image
            src="/matcha-logo.svg"
            alt="Matcha"
            width={180}
            height={76}
            priority
            className="h-[76px] w-auto object-contain"
            style={{ width: "auto" }}
          />
        </div>
        <LoginForm />
      </section>
    </main>
  )
}
