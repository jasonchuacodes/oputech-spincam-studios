import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/utils/cn'
import { dayjsLocal, formatDate, formatRange } from '@/utils/date'

interface DateRangePickerProps {
  value?: DateRange
  onChange: (range: DateRange | undefined) => void
  placeholder?: string
  label?: string
  required?: boolean
  disableFuture?: boolean
  disablePast?: boolean
  disabled?: boolean
  error?: boolean
  className?: string
}

export const DateRangePicker = ({
  value,
  onChange,
  placeholder = 'Pick a date range',
  label,
  required = false,
  disableFuture = false,
  disablePast = false,
  disabled = false,
  error = false,
  className,
}: DateRangePickerProps) => {
  const [open, setOpen] = React.useState(false)

  const trigger = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          aria-invalid={error}
          className={cn(
            'w-full justify-start font-normal',
            !value?.from && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="opacity-60" />
          {value?.from
            ? value.to
              ? formatRange(dayjsLocal(value.from), dayjsLocal(value.to))
              : formatDate(value.from, 'MMM D, YYYY')
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          autoFocus
          min={1}
          selected={value}
          onSelect={(range) => {
            onChange(range)
            if (range?.from && range?.to) setOpen(false)
          }}
          disabled={
            disableFuture
              ? { after: new Date() }
              : disablePast
                ? { before: new Date() }
                : undefined
          }
        />
      </PopoverContent>
    </Popover>
  )

  if (!label) return trigger

  return (
    <div className="flex flex-col gap-1.5">
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {trigger}
    </div>
  )
}

interface FormDateRangePickerProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label?: string
  required?: boolean
  placeholder?: string
  disableFuture?: boolean
  disablePast?: boolean
}

export const FormDateRangePicker = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  placeholder,
  disableFuture = false,
  disablePast = false,
}: FormDateRangePickerProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="flex flex-col gap-1.5">
          {label && (
            <Label>
              {label}
              {required && <span className="text-destructive"> *</span>}
            </Label>
          )}

          <DateRangePicker
            value={value ?? undefined}
            onChange={(range) => onChange(range ?? null)}
            placeholder={placeholder}
            disableFuture={disableFuture}
            disablePast={disablePast}
            error={!!error}
          />

          {error && (
            <p className="text-destructive text-xs">{error.message}</p>
          )}
        </div>
      )}
    />
  )
}
