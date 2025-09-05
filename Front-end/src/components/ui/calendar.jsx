// ui/calendar.jsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';

const Calendar = React.forwardRef(({ className, selected, onSelect, ...props }, ref) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const rows = [];
  let days = [];
  let day = startDate;
  
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      days.push(
        <div
          key={day.toString()}
          className={cn(
            "p-1 text-center cursor-pointer",
            !isSameMonth(day, monthStart) && "text-muted-foreground opacity-50",
            isSameDay(day, selected) && "bg-primary text-primary-foreground rounded-full"
          )}
          onClick={() => onSelect(cloneDay)}
        >
          {format(day, 'd')}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7">
        {days}
      </div>
    );
    days = [];
  }

  const header = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
    <div key={day} className="text-center text-sm font-medium text-muted-foreground">
      {day}
    </div>
  ));

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div ref={ref} className={cn("p-3", className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="font-medium">
          {format(currentDate, 'MMMM yyyy')}
        </div>
        <button onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {header}
      </div>
      <div className="space-y-1">
        {rows}
      </div>
    </div>
  );
});
Calendar.displayName = "Calendar";

export { Calendar };