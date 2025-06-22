import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React from 'react'

export default function Drawer() {
  const router = useRouter();

  const logout = async () => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/signout`,
      {
        method: 'POST',
      }
    )

    if (data.status === 200) {
      router.push('/');
    } else {
      document.getElementById("error-modal")?.click();
    }
  }

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <label htmlFor="my-drawer" className="btn btn-square btn-ghost drawer-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
        </label>
        {/* 
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button">Open drawer</label> */}
      </div>
      <div className="drawer-side ">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 max-w-[80%]">
          {/* Sidebar content here */}
          <li className='mb-1'>
            <button onClick={logout}>Log Out</button>

          </li>
        </ul>
      </div>

      <input type="checkbox" id="error-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">Error</h3>
          <p className="py-4">Something went wrong.</p>
          <div className="modal-action">
            <label htmlFor="error-modal" className="btn">Close</label>
          </div>
        </div>
      </div>
    </div>
  )
}
