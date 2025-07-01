"use client";

import { useEffect, useState } from 'react'

import * as z from "zod/v4";
import { DayPicker } from "react-day-picker";
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';

import { useHabit } from '@/contexts/HabitContext';


interface HabitItem {
  id: number
  title: string
  user_id: number
  created_at: Date
  deleted_at: Date
  last_reset_date: Date
  start_date: Date
  updated_at: Date
}

export default function HabitForm({ habitItem }: { habitItem?: HabitItem }) {

  const schema = habitItem
    ? z.object({
      title: z.string().min(1, { message: 'Required' }),
      startDate: z.date().optional(),
    })
    : z.object({
      title: z.string().min(1, { message: 'Required' }),
      startDate: z.date().min(1, { message: 'Required' }),
    });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const { addHabit, editHabit } = useHabit();

  const onSubmit = async (input: { [key: string]: string | Date }) => {

    if (habitItem) {
      await editHabit(input, habitItem.id);
      (document.getElementById('edit_modal') as HTMLFormElement).close()
    } else {
      await addHabit(input)
      reset();
      setStartDate(undefined);
      (document.getElementById('add_modal') as HTMLFormElement).close()
    }

  }

  const [startDate, setStartDate] = useState<Date | undefined>();

  useEffect(() => {
    if (habitItem) {
      setValue("title", habitItem.title);
      setValue("startDate", new Date(habitItem.start_date));
      setStartDate(new Date(habitItem.start_date));
    } else {
      reset();
      setStartDate(undefined);
    }
  }, [habitItem, setValue, reset]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset border-base-300 w-full mb-8">
          <label className="label">Title</label>
          <input
            type="text" {...register('title')}
            className={`input w-full ${errors.title?.message}
              ? "border-error focus:border-error focus:outline-0 focus:outline-error"
              : ""}`}
            placeholder="Title"
          />
          <p className='text-error'>{errors.title?.message}</p>
          {
            (!habitItem?.id) ?
              <>
                <label className="label">Start Date</label>
                <>
                  <button type='button' popoverTarget="rdp-popover" className="input input-border w-full" style={{ anchorName: "--rdp" } as React.CSSProperties}>
                    {startDate ? startDate.toLocaleDateString() : "Pick a date"}
                  </button>
                  <div popover="auto" id="rdp-popover" className="dropdown" style={{ positionAnchor: "--rdp" } as React.CSSProperties}>
                    <DayPicker
                      className="react-day-picker"
                      mode="single"
                      selected={startDate}
                      onSelect={(selectedDate) => {
                        if (selectedDate) {
                          setStartDate(selectedDate)
                          setValue("startDate", selectedDate)
                        }
                      }}
                      disabled={{ after: new Date() }}
                    />
                  </div>
                  <p className='text-error'>{errors.startDate?.message}</p>
                </>
              </>
              : <></>
          }
        </fieldset>
        <input type="submit" className="btn btn-primary w-full" value={"ok"} />
      </form>
    </div>
  )
}
