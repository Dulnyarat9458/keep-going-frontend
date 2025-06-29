'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface HabitContextType {
  habits: {}
  addHabit: (input: { [key: string]: string | Date }) => Promise<void>
}


const HabitContext = createContext<HabitContextType | undefined>(undefined)

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<{}>({})

  const fetchHabits = async () => {
    const data = await fetch('api/habits',
      {
        method: 'GET',
        credentials: 'include',
      }
    )
    return data
  }

  const addHabit = async (input: { [key: string]: string | Date }) => {
    const data = await fetch('api/habits',
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          title: input.title,
          start_date: input.startDate,
        }),
      }
    )

    if (data.status === 200) {
      const data = await fetchHabits();
      handleHabitList(data)
    } else {
      document.getElementById("error-modal")?.click();
    }
  }

  const handleHabitList = async (data: Response) => {
    const habitsBody = await data.json();
    if (data.status === 200) {
      setHabits(habitsBody.data)
    } else {
      document.getElementById("error-modal")?.click();
    }
  }

  useEffect(() => {
    const run = async () => {
      const data = await fetchHabits();
      handleHabitList(data)
    }
    run();
  }, [setHabits])


  return (
    <HabitContext.Provider value={{ habits, addHabit }}>
      {children}
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">Error</h3>
          <p className="py-4">Something went wrong.</p>
          <div className="modal-action">
            <label htmlFor="error-modal" className="btn">Close</label>
          </div>
        </div>
      </div>
    </HabitContext.Provider>
  )
}

export function useHabit() {
  const context = useContext(HabitContext)
  if (!context) {
    throw new Error('useHabit must be used within a HabitProvider')
  }
  return context
}
