import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
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
import { formatDate } from '@/utils/date'

interface DatePickerProps {
  value?: Date | null
  onChange: (date: Date | undefined) => void
  placeholder?: string
  label?: string
  required?: boolean
  disableFuture?: boolean
  disablePast?: boolean
  disabled?: boolean
  error?: boolean
  className?: string
}

export const DatePicker = ({
  value,
  onChange,
  placeholder = 'Pick a date',
  label,
  required = false,
  disableFuture = false,
  disablePast = false,
  disabled = false,
  error = false,
  className,
}: DatePickerProps) => {
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
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="opacity-60" />
          {value ? formatDate(value, 'MMM D, YYYY') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          autoFocus
          selected={value ?? undefined}
          onSelect={(date) => {
            onChange(date)
            setOpen(false)
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

interface FormDatePickerProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label?: string
  required?: boolean
  placeholder?: string
  disableFuture?: boolean
  disablePast?: boolean
}

export const FormDatePicker = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  placeholder,
  disableFuture = false,
  disablePast = false,
}: FormDatePickerProps<T>) => {
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

          <DatePicker
            value={value ?? null}
            onChange={(date) => onChange(date ?? null)}
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
