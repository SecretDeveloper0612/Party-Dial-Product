import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomDatePickerProps {
  selectedDate: string;
  onChange: (date: string) => void;
  onClose: () => void;
}

const CustomDatePicker = ({ selectedDate, onChange, onClose }: CustomDatePickerProps) => {
  const initialDate = selectedDate ? new Date(selectedDate) : new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isCurrentMonth = currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() === today.getMonth();

  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCurrentMonth) {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    }
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handleSelect = (day: number, e: React.MouseEvent, isDisabled: boolean) => {
    e.stopPropagation();
    if (isDisabled) return;
    
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    onChange(formatted);
    onClose();
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <>
      {/* Invisible backdrop to capture outside clicks */}
      <div className="fixed inset-0 z-[90]" onClick={(e) => { e.stopPropagation(); onClose(); }} />
      <div className="absolute bottom-[calc(100%+8px)] left-0 w-[240px] bg-white border border-slate-100 rounded-2xl shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.2)] z-[100] p-4" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-3">
        <button 
          onClick={prevMonth} 
          type="button" 
          disabled={isCurrentMonth}
          className={`w-6 h-6 flex items-center justify-center rounded-full border transition-colors ${isCurrentMonth ? 'border-slate-100 opacity-30 cursor-not-allowed' : 'border-slate-200 hover:bg-slate-50'}`}
        >
          <ChevronLeft size={12} className="text-slate-600" />
        </button>
        <span className="font-bold text-slate-800 text-xs">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button onClick={nextMonth} type="button" className="w-6 h-6 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50 transition-colors">
          <ChevronRight size={12} className="text-slate-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => (
          <div key={day} className="text-[9px] font-black text-slate-600">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1 gap-x-1">
        {days.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;
          
          const cellDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const isPast = cellDate < today;
          
          const currentDateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isSelected = selectedDate === currentDateStr;
          
          return (
            <button
              key={day}
              type="button"
              disabled={isPast}
              onClick={(e) => handleSelect(day, e, isPast)}
              className={`w-6 h-6 mx-auto flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                isPast 
                  ? 'text-slate-300 cursor-not-allowed' 
                  : isSelected 
                    ? 'bg-slate-900 text-white shadow-sm border border-slate-900' 
                    : 'text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
    </>
  );
};

export default CustomDatePicker;
