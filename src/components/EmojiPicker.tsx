import { AVATAR_EMOJIS } from "@/lib/avatars";
import { setAvatarEmoji } from "@/lib/actions/profile";

/** Escolha de avatar: só emojis da lista fixa (nenhuma imagem é aceita). */
export function EmojiPicker({ current }: { current: string | null }) {
  return (
    <section className="card space-y-3">
      <h2 className="text-lg font-bold">Avatar</h2>
      <div className="flex flex-wrap gap-2">
        <form action={setAvatarEmoji.bind(null, "")}>
          <button type="submit" aria-label="Usar inicial do nome" className={`h-10 rounded-full px-3 text-sm ${!current ? "bg-terracotta-600 text-white" : "bg-cream-100"}`}>
            Inicial
          </button>
        </form>
        {AVATAR_EMOJIS.map((e) => (
          <form key={e} action={setAvatarEmoji.bind(null, e)}>
            <button type="submit" aria-label={`Usar ${e}`} className={`h-10 w-10 rounded-full text-xl ${current === e ? "bg-terracotta-100 ring-2 ring-terracotta-600" : "bg-cream-100 hover:bg-cream-200"}`}>
              {e}
            </button>
          </form>
        ))}
      </div>
    </section>
  );
}
