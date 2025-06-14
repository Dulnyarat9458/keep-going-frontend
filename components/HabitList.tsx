"use client"

import HabitForm from "./form/HabitForm"


export default function HabitList() {
  const items = ['a', 'b', 'c', 'd', 'e'];
  return (
    <>
      <div className='text-end mx-4'>
        <button className="btn btn-soft btn-primary" onClick={() => (document.getElementById('add_modal') as HTMLFormElement).showModal()}>Add Habits</button>
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
        {items.map((item, index) => (
          <li className="flex justify-between p-4 " key={index}>
            <div>
              <div className="text-lg text-primary"><strong>Stop Smoking</strong></div>
              <ul>
                <li><strong>Streak: </strong><span className="text-info">4</span>  days</li>
                <li><strong>Last Reset Date:</strong> 12 June 2024</li>
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
        ))}





      </ul>
      <div className='text-center mt-16'>
        <div className="join mx-auto">
          <button className="join-item btn">1</button>
          <button className="join-item btn btn-active">2</button>
          <button className="join-item btn">3</button>
          <button className="join-item btn">4</button>
        </div>
      </div>
    </>
  )
}
