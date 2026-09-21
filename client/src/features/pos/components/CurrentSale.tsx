import { Trash2, X } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { formatCurrency } from '../../../utils/number'
import { PaymentType, TransactionItem } from '../../../services/transaction/transaction.types'
import { toTitleCase } from '../../../utils/text'
import { Button } from '../../../components'

interface CurrentSaleProps {
  items: TransactionItem[]
  paymentType: PaymentType | null
  onPaymentTypeChange: (type: PaymentType) => void
  onSubmit: () => void
  onClear: () => void
  onCancel: () => void
  onRemoveItem: (productId: string) => void
}

export const CurrentSale = ({
  items,
  paymentType,
  onPaymentTypeChange,
  onSubmit,
  onClear,
  onCancel,
  onRemoveItem,
}: CurrentSaleProps) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const hasItems = items.length > 0
  const selectedItems = hasItems && paymentType !== null

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">Current Sale</h2>
        {hasItems && (
          <button
            onClick={onClear}
            className="text-slate-400 transition-colors hover:text-red-500"
            title="Clear sale"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        {!hasItems ? (
          <p className="py-8 text-center text-sm text-slate-400">
            No items added yet.
            <br />
            Select a product to get started.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.productId}
              className="flex items-start justify-between gap-2 rounded-md border px-3 py-2"
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-sm font-medium text-slate-800">{item.name}</span>
                <span className="text-xs text-slate-500">
                  {formatCurrency(item.price)} × {item.quantity}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {formatCurrency(item.price * item.quantity)}
                </span>
                <button
                  onClick={() => onRemoveItem(item.productId)}
                  className="text-slate-300 transition-colors hover:text-red-400"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col border-t pt-3">
        <div className="flex flex-col gap-1.5 pb-3 text-sm">
          <div className="flex justify-between text-xl font-semibold text-slate-800">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 border-t py-3">
          <span className="text-xs font-medium text-slate-500">Mode of Payment</span>
          <div className="flex gap-2">
            {([PaymentType.Cash, PaymentType.Online] as PaymentType[]).map((type) => (
              <Button
                key={type}
                variant={paymentType === type ? 'default' : 'outline'}
                size="lg"
                disabled={!hasItems}
                onClick={() => onPaymentTypeChange(type)}
                className="flex-1"
              >
                {toTitleCase(type)}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t pt-3">
          <Button
            size="lg"
            disabled={!selectedItems}
            onClick={onSubmit}
            className={cn('w-full', !selectedItems && 'opacity-40')}
          >
            Pay
          </Button>
          <Button variant="outline" disabled={!hasItems} onClick={onCancel} className="w-full">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
