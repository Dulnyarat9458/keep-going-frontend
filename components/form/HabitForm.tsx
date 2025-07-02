"use client";

import { useEffect, useState } from 'react'
import { DayPicker } from "react-day-picker";
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { useHabit } from '@/contexts/HabitContext';
import { snakeToCamel } from '@/utils/caseConverter';
import { errorTranslate } from '@/constants/errorMessages';
import { HabitInput, inputError } from '@/types/form';
import { HabitItem } from '@/types/habit';
import { AddHabitSchema, EditHabitSchema } from '@/schemas/forms';

export default function HabitForm({ habitItem }: { habitItem?: HabitItem }) {
  const schema = habitItem ? EditHabitSchema : AddHabitSchema
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    shouldUnregister: true,
  })
  const { addHabit, editHabit } = useHabit();
  const onSubmit = async (input: { [key: string]: string | Date }) => {
    if (habitItem) {
      const error = await editHabit(input, habitItem.id);
      if (error) {
        error.forEach((value: inputError) => {
          if (value.field === "json") {
            document.getElementById("error-modal")?.click();
          } else {
            error.forEach((value: inputError) => {
              const fieldName = snakeToCamel(value.field.trim());
              setError(fieldName as keyof HabitInput, {
                type: "manual",
                message: errorTranslate[value.error] || "Something went wrong",
              });
            });
          }
        });
      } else {
        (document.getElementById('edit_modal') as HTMLFormElement).close()
      }
    } else {
      const error = await addHabit(input)
      if (error) {
        error.forEach((value: inputError) => {
          if (value.field === "json") {
            document.getElementById("error-modal")?.click();
          } else {
            error.forEach((value: inputError) => {
              const fieldName = snakeToCamel(value.field.trim());
              setError(fieldName as keyof HabitInput, {
                type: "manual",
                message: errorTranslate[value.error] || "Something went wrong",
              });
            });
          }
        });
      } else {
        (document.getElementById('add_modal') as HTMLFormElement).close()
      }
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
            (!habitItem?.id)
              ?
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
                          setValue("startDate", selectedDate, { shouldValidate: true })
                        }
                      }}
                      disabled={{ after: new Date() }}
                    />
                  </div>
                  <p className='text-error'>{errors.startDate?.message}</p>
                </>
              </>
              :
              <></>
          }
        </fieldset>
        <input type="submit" className="btn btn-primary w-full" value={"ok"} />
      </form>
    </div>
  )
}

