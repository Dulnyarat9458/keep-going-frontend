'use client';

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext';
import Drawer from './Drawer'
import { anonymousPath } from '@/constants/anonymousPath';
import { useRedirectIfAuthenticated } from '@/utils/useRedirectIfAuthenticated';

const mustShowDrawer = (path: string) => {
  return !anonymousPath.includes(path)
}

export default function Navbar() {
  const pathname = usePathname()
  const { userInfo } = useAuth();
  useRedirectIfAuthenticated(userInfo);

  return (
    <div className="navbar sticky top-0 z-10 shadow-sm bg-base-300">
      <div className="flex-none">
        {mustShowDrawer(pathname) && <Drawer userInfo={userInfo} />}
      </div>
      <div className="flex-1">
        <div className='flex items-center justify-between'>
          <Link href={"/"} className="btn btn-ghost text-xl">KEEP GOING</Link>
          <div className='mr-4 hidden lg:block'>{userInfo.firstName} {userInfo.lastName}</div>
        </div>
      </div>
    </div>
  )
}
