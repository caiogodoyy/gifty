import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { items } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { AddItemForm, EditableItem } from "@/components/WishlistEditor";
import { SizeChips } from "@/components/SizeChips";
import { FloatingAction } from "@/components/Nav";
import { PlusIcon } from "@/components/Icons";

export default async function WishlistPage({ searchParams }: { searchParams: { novo?: string } }) {
  const user = await requireUser();
  // Propositalmente NÃO consulta `reservations`: o dono nunca vê reservas.
  const mine = await db.select().from(items).where(eq(items.userId, user.id)).orderBy(desc(items.createdAt));
  const adding = searchParams.novo === "1";
  return (
    <>
      <h1 className="page-title pt-2">Minha Lista</h1>
      <div className="space-y-3">
        <h2 className="text-lg font-medium">Meus Desejos</h2>
        <SizeChips shirt={user.shirtSize} pants={user.pantsSize} shoe={user.shoeSize} />
        <p className="text-sm text-ink-soft">Seus grupos veem esta lista. Reservas continuam secretas para você 🤫</p>
      </div>
      {adding && <AddItemForm />}
      {mine.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-soft">Sua lista está vazia.</p>
      ) : (
        <ul className="space-y-3">
          {mine.map((item) => (
            <EditableItem key={item.id} item={item} />
          ))}
        </ul>
      )}
      <FloatingAction href={adding ? "/wishlist" : "/wishlist?novo=1"}>
        {adding ? "Fechar" : (<><PlusIcon className="h-5 w-5" /> Desejo</>)}
      </FloatingAction>
    </>
  );
}
