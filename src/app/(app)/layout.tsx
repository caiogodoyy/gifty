import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/Nav";
import { requireUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <>
      <main className="mx-auto max-w-md space-y-5 px-4 pb-40">
        <AppHeader name={user.name} emoji={user.avatarEmoji} />
        {children}
      </main>
      <BottomNav />
    </>
  );
}
