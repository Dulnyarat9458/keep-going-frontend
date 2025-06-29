"use client"

import { useHabit } from "@/contexts/HabitContext";
import HabitForm from "./form/HabitForm"

interface HabitItem {
  created_at: Date
  deleted_at: Date
  id: number
  last_reset_date: Date
  start_date: Date
  title: string
  updated_at: Date
  user_id: number
}

export default function HabitList() {
  const { habits } = useHabit();

  const dayDiff = (date: Date): number => {
    const now = Date.now();
    const inputTime = new Date(date).getTime();
    const diffMs = now - inputTime;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="mt-8">
      <div className='text-end mx-4'>
        <div className="flex justify-between items-center">
          <h2 className="text-3xl">Habit List</h2><button className="btn btn-soft btn-primary" onClick={() => (document.getElementById('add_modal') as HTMLFormElement).showModal()}>Add Habits</button>
        </div>
        <dialog id="add_modal" className="modal">
          <div className="modal-box text-start">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg mb-4">Add Habits</h3>
            <HabitForm />
          </div>
        </dialog>
      </div>
      <ul className="list rounded-box shadow-md bg-base-200 mt-4 mx-4">
        {
          Array.isArray(habits) && habits.length > 0 ?
            habits.map((item: HabitItem) => (
              <li className="flex justify-between p-4 " key={item.id}>
                <div>
                  <div className="text-lg text-primary"><strong>{item.title}</strong></div>
                  <ul>
                    <li><strong>Streak: </strong><span className="text-info">{dayDiff(item.last_reset_date)}</span>  days</li>
                    <li><strong>Last Reset: </strong>
                      {new Date(item.last_reset_date).toLocaleDateString()}
                    </li>
                  </ul>
                </div>
                <div >
                  <div className="dropdown dropdown-bottom dropdown-end">
                    <div tabIndex={0} role="button" className=" m-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path> </svg>
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-300 rounded-box z-1 w-24 p-2 shadow-sm">
                      <li>
                        <div className="text-accent">Reset</div>
                      </li>
                      <li>
                        <div className="text-warning">Edit</div>
                      </li>
                      <li>
                        <div className="text-error">Delete</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            )) : <div>no data available</div>
        }


      </ul>
      <div className='text-center mt-16 mb-8'>
        <div className="join mx-auto">
          <button className="join-item btn">1</button>
          <button className="join-item btn btn-active">2</button>
          <button className="join-item btn">3</button>
          <button className="join-item btn">4</button>
        </div>
      </div>
    </div>
  )
}
