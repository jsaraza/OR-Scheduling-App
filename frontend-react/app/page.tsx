import LoginForm from "@/components/LoginForm"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">OR Nurse Assignment</h1>
      <LoginForm />
    </main>
  )
}

