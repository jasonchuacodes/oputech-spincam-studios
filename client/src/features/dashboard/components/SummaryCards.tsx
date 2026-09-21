import { formatCurrency } from '../../../utils/number'

interface Props {
  totalSales: number
  totalExpenses: number
}

export const SummaryCards = ({ totalSales, totalExpenses }: Props) => {
  const net = totalSales - totalExpenses

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="flex flex-col gap-1 rounded-md border bg-blue-50 p-4">
        <span className="text-xs font-medium text-blue-600">Total Sales</span>
        <span className="text-2xl font-bold text-blue-700">
          {formatCurrency(totalSales)}
        </span>
      </div>
      <div className="flex flex-col gap-1 rounded-md border bg-red-50 p-4">
        <span className="text-xs font-medium text-red-600">Total Expenses</span>
        <span className="text-2xl font-bold text-red-700">
          {formatCurrency(totalExpenses)}
        </span>
      </div>
      <div className="flex flex-col gap-1 rounded-md border bg-slate-50 p-4">
        <span className="text-xs font-medium text-slate-500">Net</span>
        <span className="text-2xl font-bold text-foreground">
          {formatCurrency(net)}
        </span>
      </div>
    </div>
  )
}
