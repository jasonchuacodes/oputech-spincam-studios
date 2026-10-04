import { useEffect, useRef, useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { Input, Spinner } from '../../components'
import { PageHeader } from '../../components/ui/page-header'
import {
  PaymentType,
  TransactionItem,
  TransactionType,
} from '../../services/transaction/transaction.types'
import { Product } from '../../services/product/product.types'
import { useProducts } from '../../services/product/product.queries'
import { useCreateTransaction } from '../../services/transaction/transaction.queries'
import { useDisclosure } from '../../hooks/useDisclosure'
import { ProductCard } from './components/ProductCard'
import { CurrentSale } from './components/CurrentSale'
import { CartSheet } from './components/CartSheet'
import { TransactionConfirmationModal } from './components/TransactionConfirmationModal'
import { getDraft, saveDraft, clearDraft } from '../../offline/database'
import { useSyncContext } from '../../context/sync/useSyncContext'

const POS_DRAFT_KEY = 'pos-cart'

interface PosDraft {
  items: TransactionItem[]
  paymentType: PaymentType
}

const POSPage = () => {
  const [transactionItems, setTransactionItems] = useState<TransactionItem[]>(
    []
  )
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.Cash)
  const [cashAmount, setCashAmount] = useState('')
  const [isExactAmount, setIsExactAmount] = useState(true)
  const [search, setSearch] = useState('')
  const draftLoaded = useRef(false)
  const cart = useDisclosure()
  const confirmation = useDisclosure()

  const { data: products = [], isLoading } = useProducts(search)
  const createTransaction = useCreateTransaction()
  const { status } = useSyncContext()

  useEffect(() => {
    void getDraft<PosDraft>(POS_DRAFT_KEY).then((draft) => {
      if (draft) {
        setTransactionItems(draft.items)
        setPaymentType(draft.paymentType)
      }
      draftLoaded.current = true
    })
  }, [])

  useEffect(() => {
    if (!draftLoaded.current) return
    void saveDraft<PosDraft>(POS_DRAFT_KEY, {
      items: transactionItems,
      paymentType,
    })
  }, [paymentType, transactionItems])

  const mainProducts = products.filter((p) => p.category === 'main')
  const addOnProducts = products.filter((p) => p.category === 'add-on')

  const handleProductClick = (product: Product) => {
    setTransactionItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id)
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          printCount: product.printCount ?? 0,
          quantity: 1,
        },
      ]
    })
  }

  const handleRemoveItem = (productId: string) => {
    setTransactionItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  const resetCashPayment = () => {
    setCashAmount('')
    setIsExactAmount(true)
  }

  const handlePaymentTypeChange = (type: PaymentType) => {
    setPaymentType(type)
    if (type === PaymentType.Online) resetCashPayment()
  }

  const handleExactAmountChange = (exact: boolean) => {
    setIsExactAmount(exact)
    setCashAmount('')
  }

  const handleClear = () => {
    setTransactionItems([])
    resetCashPayment()
  }

  const handleCancel = () => {
    handleClear()
    cart.onClose()
  }

  const total = transactionItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const totalInCents = Math.round(total * 100)
  const enteredCash = Number(cashAmount)
  const enteredCashInCents = Math.round(enteredCash * 100)
  const cashReceivedInCents = isExactAmount
    ? totalInCents
    : enteredCashInCents
  const cashReceived = cashReceivedInCents / 100
  const hasValidCashAmount =
    isExactAmount ||
    (cashAmount !== '' &&
      Number.isFinite(enteredCash) &&
      enteredCashInCents >= totalInCents)
  const change =
    paymentType === PaymentType.Cash && hasValidCashAmount
      ? Math.max(0, cashReceivedInCents - totalInCents) / 100
      : 0

  const handleSubmit = () => {
    if (paymentType === PaymentType.Cash && !hasValidCashAmount) return
    confirmation.onOpen()
  }

  const handleConfirm = () => {
    const items = transactionItems.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
    }))
    createTransaction.mutate(
      { type: TransactionType.Sale, items, paymentType },
      {
        onSuccess: () => {
          handleClear()
          confirmation.onClose()
          cart.onClose()
          void clearDraft(POS_DRAFT_KEY)
        },
      }
    )
  }

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <PageHeader
        title="Point of Sale"
        description="Create a new transaction"
      />

      <div className="flex min-h-0 flex-1 gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          <div className="flex flex-col gap-6 overflow-y-auto">
            {isLoading && (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            )}
            {!isLoading && products.length === 0 && (
              <p className="py-12 text-center text-sm text-slate-400">
                {status === 'offline' && !search
                  ? 'Connect once to prepare this device for offline sales.'
                  : 'No products found.'}
              </p>
            )}
            {!isLoading && mainProducts.length > 0 && (
              <div className="flex flex-col gap-3 px-1">
                <h2 className="text-sm font-semibold text-slate-700">Main</h2>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
                  {mainProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={handleProductClick}
                    />
                  ))}
                </div>
              </div>
            )}
            {!isLoading && addOnProducts.length > 0 && (
              <div className="flex flex-col gap-3 px-1">
                <h2 className="text-sm font-semibold text-slate-700">
                  Add-ons
                </h2>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
                  {addOnProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={handleProductClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="fixed right-0 bottom-0 -translate-x-4 -translate-y-4 md:hidden">
            <button
              onClick={cart.onOpen}
              className="relative flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg"
            >
              <ShoppingCart size={18} />
              Cart
              {transactionItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {transactionItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="hidden w-80 shrink-0 md:flex md:flex-col">
          <CurrentSale
            items={transactionItems}
            paymentType={paymentType}
            cashAmount={cashAmount}
            isExactAmount={isExactAmount}
            onPaymentTypeChange={handlePaymentTypeChange}
            onCashAmountChange={setCashAmount}
            onExactAmountChange={handleExactAmountChange}
            onSubmit={handleSubmit}
            onClear={handleClear}
            onCancel={handleCancel}
            onRemoveItem={handleRemoveItem}
          />
        </div>
      </div>

      <CartSheet
        open={cart.open}
        onClose={cart.onClose}
        items={transactionItems}
        paymentType={paymentType}
        cashAmount={cashAmount}
        isExactAmount={isExactAmount}
        onPaymentTypeChange={handlePaymentTypeChange}
        onCashAmountChange={setCashAmount}
        onExactAmountChange={handleExactAmountChange}
        onSubmit={handleSubmit}
        onClear={handleClear}
        onCancel={handleCancel}
        onRemoveItem={handleRemoveItem}
      />

      <TransactionConfirmationModal
        open={confirmation.open}
        items={transactionItems}
        paymentType={paymentType}
        cashReceived={cashReceived}
        change={change}
        loading={createTransaction.isPending}
        onClose={confirmation.onClose}
        onConfirm={handleConfirm}
      />
    </div>
  )
}

export default POSPage
