import { cancelReservation, reserveItem } from "@/lib/actions/wishlist";
import { SubmitButton } from "./SubmitButton";

type Props = {
  item: { id: string; name: string; description: string | null; url: string | null };
  reservedByName: string | null;
  reservedByMe: boolean;
  canCancel: boolean;
};

/** Item na lista de OUTRO membro; aqui a reserva (amarela) é visível. */
export function MemberItem({ item, reservedByName, reservedByMe, canCancel }: Props) {
  const reserved = reservedByName !== null;
  return (
    <li className={`card ${reserved ? "border-gold-200 bg-gold-50" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium">{item.name}</p>
          {reserved && (
            <span className="badge-reserved mt-1">
              🤫 Reservado{reservedByMe ? " por você" : ` por ${reservedByName}`}
            </span>
          )}
          {item.description && <p className="mt-2 whitespace-pre-line text-sm text-stone-600">{item.description}</p>}
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer nofollow" className="mt-1 block truncate text-sm text-stone-500 underline">
              {item.url}
            </a>
          )}
        </div>
        {!reserved && (
          <form action={reserveItem.bind(null, item.id)}>
            <SubmitButton className="btn-ghost">Reservar</SubmitButton>
          </form>
        )}
        {reserved && canCancel && (
          <form action={cancelReservation.bind(null, item.id)}>
            <SubmitButton className="btn-ghost">Cancelar reserva</SubmitButton>
          </form>
        )}
      </div>
    </li>
  );
}
