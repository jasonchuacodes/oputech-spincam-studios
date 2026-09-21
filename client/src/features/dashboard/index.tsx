import { useState } from 'react'
import { PageHeader } from '../../components/ui/page-header'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components'
import { useAnalytics } from '../../services/analytics/analytics.queries'
import { AnalyticsRange } from '../../services/analytics/analytics.types'
import { SummaryCards } from './components/SummaryCards'
import { SalesExpensesChart } from './components/SalesExpensesChart'
import { TopProducts } from './components/TopProducts'

const RANGE_OPTIONS: { value: AnalyticsRange; label: string }[] = [
  { value: 'TODAY', label: 'Today'},
  { value: 'LAST_7_DAYS', label: 'Last 7 days' },
  { value: 'LAST_15_DAYS', label: 'Last 15 days' },
  { value: 'LAST_MONTH', label: 'Last month' },
  { value: 'LAST_6_MONTHS', label: 'Last 6 months' },
]

const DashboardPage = () => {
  const [range, setRange] = useState<AnalyticsRange>('TODAY')
  const { data, isLoading } = useAnalytics(range)

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Dashboard"
        description="Sales analytics overview"
        action={
          <Select
            value={range}
            onValueChange={(v) => setRange(v as AnalyticsRange)}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RANGE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {isLoading || !data ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-md border bg-slate-100"
              />
            ))}
          </div>
          <div className="h-80 animate-pulse rounded-md border bg-slate-100" />
        </div>
      ) : (
        <>
          <SummaryCards
            totalSales={data.totalSales}
            totalExpenses={data.totalExpenses}
          />
          <SalesExpensesChart series={data.series} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <TopProducts products={data.topProducts} />
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardPage
