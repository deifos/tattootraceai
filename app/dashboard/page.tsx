import { TattooTryOnClient } from "@/components/tattoo"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppBackground } from "@/components/app-background";
import { DashboardNavbar } from "@/components/dashboard-navbar";

export default async function TattooTryOnApp() {

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/auth/sign-in');
  return (
    <AppBackground variant="subtle">
      <DashboardNavbar userId={session.user.id} />
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Tattoo Try-On Studio</h1>
            <p className="text-default-500 text-sm md:text-lg">
              Upload your base image, design your tattoo, and see how it looks with AI
            </p>
          </div>

          <TattooTryOnClient userId={session.user.id} />
        </div>
      </div>
    </AppBackground>
  )
}