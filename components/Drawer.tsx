"use client";

import React from 'react'
import { useAuth } from '@/contexts/AuthContext';
import { UserInfo } from '@/types/user';

export default function Drawer({ userInfo }: { userInfo: UserInfo }) {
  const { signOut } = useAuth();

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn btn-square btn-ghost drawer-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
        </label>
      </div>
      <div className="drawer-side ">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 max-w-[80%] overflow-hidden">
          <div className="p-3 mb-10">
            <div className="w-full text-sm space-y-1">
              <div className="font-medium truncate overflow-hidden whitespace-nowrap">
                {userInfo.firstName || "Loading"} {userInfo.lastName || ""}
              </div>
              <div className="text-gray-500 truncate overflow-hidden whitespace-nowrap">
                {userInfo.email || "Loading"}
              </div>
            </div>
          </div>
          <li className="mb-1">
            <button onClick={signOut} className='text-error'>Log Out</button>
          </li>
        </ul>
      </div>
    </div>
  )
}
