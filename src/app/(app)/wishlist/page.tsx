import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { items } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { AddItemForm, EditableItem } from "@/components/WishlistEditor";

export default async function WishlistPage() {
  const user = await requireUser();
  // Propositalmente NÃO consulta `reservations`: o dono nunca vê reservas.
  const mine = await db.select().from(items).where(eq(items.userId, user.id)).orderBy(desc(items.createdAt));
  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold">Minha lista de desejos</h1>
        <p className="text-sm text-stone-500">Seus grupos veem esta lista. Reservas continuam secretas para você 🤫</p>
      </div>
      <AddItemForm />
      {mine.length === 0 ? (
        <p className="text-center text-sm text-stone-500">Sua lista está vazia.</p>
      ) : (
        <ul className="space-y-3">
          {mine.map((item) => (
            <EditableItem key={item.id} item={item} />
          ))}
        </ul>
      )}
    </>
  );
}
