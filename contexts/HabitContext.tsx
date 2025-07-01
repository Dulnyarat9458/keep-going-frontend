'use client'

import { createContext, useContext, useEffect, useState } from 'react'

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


interface HabitContextType {
  habits: HabitItem[]
  addHabit: (input: { [key: string]: string | Date }) => Promise<void>
  editHabit: (input: { [key: string]: string | Date }, id: number) => Promise<void>
  resetHabit: (id: number) => Promise<void>
  deleteHabit: (id: number) => Promise<void>
}


const HabitContext = createContext<HabitContextType | undefined>(undefined)

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<HabitItem[]>([])
  const showConfirmModal = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const confirmText = document.getElementById("confirm-modal-text");
      const okBtn = document.getElementById("confirm-modal-ok");
      const closeBtn = document.getElementById("confirm-modal-close");
      const checkbox = document.getElementById("confirm-modal") as HTMLInputElement;

      if (confirmText) confirmText.innerText = message;
      checkbox.checked = true;

      const handle = (result: boolean) => {
        checkbox.checked = false;
        okBtn?.removeEventListener("click", okListener);
        closeBtn?.removeEventListener("click", cancelListener);
        resolve(result);
      };

      const okListener = () => handle(true);
      const cancelListener = () => handle(false);

      okBtn?.addEventListener("click", okListener);
      closeBtn?.addEventListener("click", cancelListener);
    });
  }

  const fetchHabits = async () => {
    const data = await fetch('api/habits',
      {
        method: 'GET',
        credentials: 'include',
      }
    )
    return data
  }

  const deleteHabit = async (id: number) => {
    const confirmed = await showConfirmModal("Are you sure you want to delete this habit?");
    if (!confirmed) return;

    const data = await fetch(`api/habits/${id}/`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (data.status === 200) {
      const res = await fetchHabits();
      handleHabitList(res);
      const text = document.getElementById("success-modal-text");
      if (text) {
        text.innerHTML = "Reset habit successfully";
      }
      (document.getElementById("confirm-modal") as HTMLInputElement).checked = false;
      (document.getElementById("success-modal") as HTMLInputElement).checked = true;
    } else {
      const text = document.getElementById("error-modal-text");
      if (text) {
        text.innerHTML = "Reset failed.";
      }
      (document.getElementById("error-modal") as HTMLInputElement).checked = true;
    }
  }

  const resetHabit = async (id: number) => {
    const confirmed = await showConfirmModal("Are you sure you want to reset this habit?");
    if (!confirmed) return;

    const data = await fetch(`api/habits/${id}/reset/`, {
      method: 'POST',
      credentials: 'include',
    });

    if (data.status === 200) {
      const res = await fetchHabits();
      handleHabitList(res);
      const text = document.getElementById("success-modal-text");
      if (text) {
        text.innerHTML = "Reset habit successfully";
      }
      (document.getElementById("confirm-modal") as HTMLInputElement).checked = false;
      (document.getElementById("success-modal") as HTMLInputElement).checked = true;
    } else {
      const text = document.getElementById("error-modal-text");
      if (text) {
        text.innerHTML = "Reset failed.";
      }
      (document.getElementById("error-modal") as HTMLInputElement).checked = true;
    }
  }

  const addHabit = async (input: { [key: string]: string | Date }) => {
    const data = await fetch('api/habits',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: input.title,
          start_date: input.startDate,
        }),
      }
    )

    if (data.status === 200) {
      const data = await fetchHabits();
      handleHabitList(data)
      document.getElementById("success-modal")?.click();
      const text = document.getElementById("success-modal-text")!;
      if (text) {
        text.innerHTML = "Add habit successfully";
      }
    } else {

      console.log(await data.json())
      document.getElementById("error-modal")?.click();
    }
  }

  const editHabit = async (input: { [key: string]: string | Date }, id: number) => {
    const data = await fetch(`api/habits/${id}/`,
      {
        method: 'PATCH',
        credentials: 'include',
        body: JSON.stringify({
          title: input.title,
        }),
      }
    )

    if (data.status === 200) {
      const data = await fetchHabits();
      handleHabitList(data)
      document.getElementById("success-modal")?.click();
      const text = document.getElementById("success-modal-text")!;
      if (text) {
        text.innerHTML = "Edit habit successfully";
      }
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
      const errorText = document.getElementById("error-modal-text")!;
      if (errorText) {
        errorText.innerHTML = "something went wrong.";
      }
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
    <HabitContext.Provider value={{ habits, addHabit, editHabit, resetHabit, deleteHabit }}>
      {children}

      <input type="checkbox" id="error-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">Error</h3>
          <p className="py-4" id="error-modal-text"></p>
          <div className="modal-action">
            <label htmlFor="error-modal" className="btn">Close</label>
          </div>
        </div>
      </div>

      <input type="checkbox" id="success-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-success">Success</h3>
          <p className="py-4" id="success-modal-text"></p>
          <div className="modal-action">
            <label htmlFor="success-modal" className="btn">Close</label>
          </div>
        </div>
      </div>

      <input type="checkbox" id="confirm-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-primary">Confirmation</h3>
          <p className="py-4" id="confirm-modal-text"></p>
          <div className="modal-action">
            <label htmlFor="confirm-modal" className="btn btn-primary" id="confirm-modal-ok">OK</label>
            <label htmlFor="confirm-modal" className="btn" id="confirm-modal-close">Close</label>
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
