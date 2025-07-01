"use client"

import { useHabit } from "@/contexts/HabitContext";
import HabitForm from "./form/HabitForm"
import { useState } from "react";

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

const ITEMS_PER_PAGE = 10

export default function HabitList() {
  const { habits, resetHabit, deleteHabit } = useHabit();
  const [editingHabit, setEditingHabit] = useState<HabitItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil((habits.length) / ITEMS_PER_PAGE)
  const paginatedHabits = habits.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const dayDiff = (date: Date): number => {
    const now = Date.now();
    const inputTime = new Date(date).getTime();
    const diffMs = now - inputTime;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <>
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
              <h3 className="font-bold text-lg mb-4">Add Habit</h3>
              <HabitForm />
            </div>
          </dialog>
        </div>
        {
          Array.isArray(habits) && habits.length > 0
            ? <ul className="list rounded-box shadow-md bg-base-200 mt-4 mx-4">
              {
                paginatedHabits.map((item: HabitItem) => (
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
                      <div className="dropdown dropdown-bottom dropdown-end cursor-pointer">
                        <div tabIndex={0} role="button" className=" m-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path> </svg>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-300 rounded-box z-1 w-24 p-2 shadow-sm">
                          <li>
                            <div className="text-accent" onClick={() => resetHabit(item.id)}>Reset</div>
                          </li>
                          <li>
                            <div className="text-warning" onClick={() => {
                              setEditingHabit(item);
                              (document.getElementById('edit_modal') as HTMLFormElement).showModal();
                            }}>
                              Edit
                            </div>
                          </li>
                          <li>
                            <div className="text-error" onClick={() => deleteHabit(item.id)}>Delete</div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                ))
              }
            </ul>
            : <div className="my-16 mx-auto text-center">No data available.</div>
        }
        <div className="text-center mt-12">
          <div className="text-center join mx-auto my-4">
            <button
              className="join-item btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              PREV
            </button>
            <button
              className="join-item btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              NEXT
            </button>
          </div>
          <div className="mb-8">{currentPage}/{totalPages}</div>
        </div>
      </div>
      <dialog id="edit_modal" className="modal">
        <div className="modal-box text-start">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg mb-4">Edit Habit</h3>
          {editingHabit && <HabitForm habitItem={editingHabit} />}
        </div>
      </dialog>
    </>
  )
}
