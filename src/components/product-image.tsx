import Image from "next/image";
import type { Product } from "@/lib/catalog";
import { IconImageOff } from "@/components/icons";

export function ProductImage({
  product,
  index = 0,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority = false,
  decorative = false,
  className = "",
}: {
  product: Product;
  index?: number;
  sizes?: string;
  priority?: boolean;
  /** Image is a visual sample inside a link that already has a text name. */
  decorative?: boolean;
  className?: string;
}) {
  const img = product.images[index];
  if (!img) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-2 text-muted ${className}`}
        role={decorative ? undefined : "img"}
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : `${product.name}: imagine în curs de adăugare`}
      >
        <IconImageOff />
        <span className="text-[11px] uppercase tracking-wider">Imagine în curs de adăugare</span>
      </div>
    );
  }
  return (
    <Image
      src={img.src}
      alt={decorative ? "" : index === 0 ? product.name : `${product.name}, imaginea ${index + 1}`}
      width={img.px}
      height={img.px}
      sizes={sizes}
      priority={priority}
      className={`h-full w-full object-contain ${className}`}
    />
  );
}
