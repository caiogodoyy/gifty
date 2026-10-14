import { ProfileForm } from "@/components/ProfileForm";
import { requireUser } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await requireUser();
  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold">Seu perfil</h1>
        <p className="text-sm text-stone-500">Seus tamanhos ficam visíveis para quem está nos seus grupos.</p>
      </div>
      <ProfileForm profile={user} />
    </>
  );
}
