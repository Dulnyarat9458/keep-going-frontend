"use client";

import { useState } from 'react'
import { DayPicker } from "react-day-picker";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const schema = yup
  .object({
    title: yup.string().required(),
    startDate: yup.date().required(),
  })
  .required()

export default function HabitForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: any) => console.log(data)

  const [startDate, setStartDate] = useState<Date | undefined>();
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset border-base-300 w-full mb-8">
          <label className="label">Title</label>
          <input type="text" {...register('title')} className="input  w-full" placeholder="My awesome page" />
          <p>{errors.title?.message}</p>
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
              />
            </div>
            <p>{errors.startDate?.message}</p>
          </>
        </fieldset>
        <input type="submit" className="btn btn-primary w-full" value={"ok"} />
      </form>


    </div>
  )
}
