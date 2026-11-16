import { addItem, deleteItem, updateItem } from "@/lib/actions/wishlist";
import { ConfirmButton } from "./ConfirmButton";
import { SubmitButton } from "./SubmitButton";
import { ImageField } from "./ImageField";
import { ItemThumb } from "./ItemThumb";
import { ExternalIcon } from "./Icons";

type Item = { id: string; name: string; description: string | null; url: string | null; imageUrl: string | null };

const PLACEHOLDER = "Ex: Marca preferida, cor, modelo, tamanho...";

function Fields({ item }: { item?: Item }) {
  return (
    <div className="space-y-2">
      <ImageField initial={item?.imageUrl} />
      <input className="input" name="name" placeholder="Nome do produto" defaultValue={item?.name} required maxLength={120} />
      <textarea className="input min-h-20" name="description" placeholder={PLACEHOLDER} defaultValue={item?.description ?? ""} maxLength={500} />
      <input className="input" name="url" placeholder="Link da loja (opcional)" defaultValue={item?.url ?? ""} maxLength={500} />
    </div>
  );
}

export function AddItemForm() {
  return (
    <form action={addItem} className="card space-y-3">
      <h2 className="text-lg font-bold">Novo desejo</h2>
      <Fields />
      <SubmitButton>Adicionar</SubmitButton>
    </form>
  );
}

/** Lista do próprio usuário: nunca mostra nem consulta reservas. */
export function EditableItem({ item }: { item: Item }) {
  return (
    <li className="card">
      <div className="flex gap-3">
        <ItemThumb src={item.imageUrl} />
        <div className="min-w-0 flex-1">
          <p className="font-bold leading-snug">{item.name}</p>
          {item.description && <p className="mt-0.5 line-clamp-2 whitespace-pre-line text-sm text-ink-soft">{item.description}</p>}
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-flex items-center gap-1 text-sm text-ink underline">
              Ver na loja <ExternalIcon className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
      <details className="mt-3 border-t border-cream-200 pt-2">
        <summary className="cursor-pointer text-sm text-terracotta-600">Editar</summary>
        <form action={updateItem.bind(null, item.id)} className="mt-3 space-y-3">
          <Fields item={item} />
          <SubmitButton>Salvar alterações</SubmitButton>
        </form>
        <form action={deleteItem.bind(null, item.id)} className="mt-3">
          <ConfirmButton message="Remover este item?">Remover desejo</ConfirmButton>
        </form>
      </details>
    </li>
  );
}
