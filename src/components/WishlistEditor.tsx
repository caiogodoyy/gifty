import { addItem, deleteItem, updateItem } from "@/lib/actions/wishlist";
import { ConfirmButton } from "./ConfirmButton";
import { SubmitButton } from "./SubmitButton";

type Item = { id: string; name: string; description: string | null; url: string | null };

const PLACEHOLDER = "Ex: Marca preferida, cor, modelo, tamanho, link da loja...";

function Fields({ item }: { item?: Item }) {
  return (
    <div className="space-y-2">
      <input className="input" name="name" placeholder="Nome do produto" defaultValue={item?.name} required maxLength={120} />
      <textarea className="input min-h-20" name="description" placeholder={PLACEHOLDER} defaultValue={item?.description ?? ""} maxLength={500} />
      <input className="input" name="url" placeholder="Link do produto (opcional)" defaultValue={item?.url ?? ""} maxLength={500} />
    </div>
  );
}

export function AddItemForm() {
  return (
    <form action={addItem} className="card space-y-3">
      <h2 className="font-semibold">Adicionar item</h2>
      <Fields />
      <SubmitButton>Adicionar</SubmitButton>
    </form>
  );
}

/** Lista do próprio usuário: nunca mostra nem consulta reservas. */
export function EditableItem({ item }: { item: Item }) {
  return (
    <li className="card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium">{item.name}</p>
          {item.description && <p className="mt-1 whitespace-pre-line text-sm text-stone-600">{item.description}</p>}
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer nofollow" className="mt-1 block truncate text-sm text-stone-500 underline">
              {item.url}
            </a>
          )}
        </div>
        <form action={deleteItem.bind(null, item.id)}>
          <ConfirmButton message="Remover este item?">Remover</ConfirmButton>
        </form>
      </div>
      <details className="mt-3">
        <summary className="cursor-pointer text-sm text-stone-500">Editar</summary>
        <form action={updateItem.bind(null, item.id)} className="mt-3 space-y-3">
          <Fields item={item} />
          <SubmitButton>Salvar alterações</SubmitButton>
        </form>
      </details>
    </li>
  );
}
