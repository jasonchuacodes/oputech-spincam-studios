import { ShoppingBag } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { formatCurrency } from '../../../utils/number'
import { Product } from '../../../services/product/product.types'

interface ProductCardProps {
  product: Product
  onClick: (product: Product) => void
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <button
      onClick={() => onClick(product)}
      className={cn(
        'flex min-w-[120px] flex-col gap-2 rounded-md border bg-white p-3 text-left transition-all',
        'cursor-pointer hover:border-slate-300 hover:shadow-sm active:scale-[0.98]',
      )}
    >
      <div className="flex h-24 w-full items-center justify-center overflow-hidden rounded-md bg-slate-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <ShoppingBag size={32} className="text-slate-400" />
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="line-clamp-2 text-xs leading-snug font-medium text-muted-foreground">
          {product.name}
        </span>
        <span className="text-base font-semibold text-foreground">
          {formatCurrency(product.price)}
        </span>
      </div>
    </button>
  )
}
