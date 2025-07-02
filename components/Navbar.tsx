'use client';

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext';
import Drawer from './Drawer'
import { anonymousPath } from '@/constants/anonymousPath';

const mustShowDrawer = (path: string) => {
  return !anonymousPath.includes(path)
}

export default function Navbar() {
  const pathname = usePathname()
  const { userInfo } = useAuth();

  return (
    <div className="navbar sticky top-0 z-10 shadow-sm bg-base-300">
      <div className="flex-none">
        {mustShowDrawer(pathname) && <Drawer userInfo={userInfo} />}
      </div>
      <div className="flex-1">
        <div className='flex items-center justify-between'>
          <Link href={"/"} className="btn btn-ghost text-xl">MY HABITS</Link>
          <div className='mr-4 hidden lg:block'>{userInfo.firstName} {userInfo.lastName}</div>
        </div>
      </div>
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
