import { Nav } from "@/components/Nav";
import { requireUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <>
      <Nav name={user.name} />
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">{children}</main>
    </>
  );
}
