import { GiftIcon } from "./Icons";

export function ItemThumb({ src, size = 72 }: { src: string | null; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cream-100 text-ink-soft"
      style={{ width: size, height: size }}
    >
      {src && /^https?:\/\//i.test(src) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
      ) : (
        <GiftIcon className="h-7 w-7" />
      )}
    </div>
  );
}
