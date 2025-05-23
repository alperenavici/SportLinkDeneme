"use client"

import * as React from "react"
import { format } from "date-fns"
import { tr } from 'date-fns/locale'
import { Calendar as CalendarIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ 
  date, 
  setDate, 
  className,
  calendarContentClassName,
  placeholder = "Tarih Seç",
}: { 
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
  calendarContentClassName?: string
  placeholder?: string
}) {
  const handleSelect = React.useCallback((selectedDate: Date | undefined) => {
    setDate(selectedDate);
  }, [setDate]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "flex justify-between items-center w-[240px] text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "d MMMM yyyy", { locale: tr })
            ) : (
              <span>{placeholder}</span>
            )}
          </div>
          {date && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-1.5 ml-2 hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                setDate(undefined);
              }}
            >
              <X className="h-3 w-3 text-destructive" />
              <span className="sr-only">Tarihi temizle</span>
            </Button>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-auto p-0", calendarContentClassName)} align="start">
        <Calendar
          mode="single"
          {...(date ? { defaultMonth: date } : {})}
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
} 