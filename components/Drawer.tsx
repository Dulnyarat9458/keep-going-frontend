import Link from 'next/link'
import React from 'react'

export default function Drawer() {
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
          <li className='mb-1'><Link href={"/signin"}>Log Out</Link></li>
        </ul>
      </div>
    </div>
  )
}
