import { cancelReservation, reserveItem } from "@/lib/actions/wishlist";
import { SubmitButton } from "./SubmitButton";
import { ItemThumb } from "./ItemThumb";
import { ExternalIcon } from "./Icons";

type Props = {
  item: { id: string; name: string; description: string | null; url: string | null; imageUrl: string | null };
  reservedByName: string | null;
  reservedByMe: boolean;
  canCancel: boolean;
};

/** Item na lista de OUTRO membro; aqui a reserva (amarela) é visível. */
export function MemberItem({ item, reservedByName, reservedByMe, canCancel }: Props) {
  const reserved = reservedByName !== null;
  return (
    <li className={`card ${reserved ? "bg-gold-50 ring-1 ring-gold-100" : ""}`}>
      <div className="flex gap-3">
        <ItemThumb src={item.imageUrl} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-bold leading-snug">{item.name}</p>
            {reserved && (
              <span className="badge-reserved shrink-0 !bg-terracotta-600 !text-white">
                Reservado{reservedByMe ? " por você" : ` · ${reservedByName}`}
              </span>
            )}
          </div>
          {item.description && <p className="mt-0.5 line-clamp-2 whitespace-pre-line text-sm text-ink-soft">{item.description}</p>}
          <div className="mt-1 flex items-center justify-between gap-2">
            {item.url ? (
              <a href={item.url} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-sm text-ink underline">
                Ver na loja <ExternalIcon className="h-3.5 w-3.5" />
              </a>
            ) : <span />}
            {!reserved && (
              <form action={reserveItem.bind(null, item.id)}>
                <SubmitButton className="btn !px-4 !py-1.5">Reservar</SubmitButton>
              </form>
            )}
            {reserved && canCancel && (
              <form action={cancelReservation.bind(null, item.id)}>
                <SubmitButton className="text-sm text-ink-soft underline">Cancelar reserva</SubmitButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
