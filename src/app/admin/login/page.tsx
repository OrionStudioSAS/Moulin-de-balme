import LoginForm from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-brown flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widests uppercase text-gold mb-1">
            Le Moulin de Balme®
          </p>
          <h1 className="text-xl font-bold tracking-widests uppercase text-cream">
            Administration
          </h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
