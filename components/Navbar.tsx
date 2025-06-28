'use client';

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Drawer from './Drawer'
import Link from 'next/link'

const anonymousPath = [
  "/forget-password",
  "/reset-password",
  "/signin",
  "/signup"
]

const mustShowDrawer = (path: string) => {
  return !anonymousPath.includes(path)
}

interface UserInfo {
  firstName?: string
  lastName?: string
  email?: string
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo>({})

  const fetchInfo = async () => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`,
      {
        method: 'GET',
        credentials: 'include',
      }
    )
    return data
  }

  useEffect(() => {
    if (!anonymousPath.includes(pathname)) {
      const run = async () => {
        const data = await fetchInfo()
        const userInfo = await data.json()

        if (data.status === 200) {
          setUserInfo({
            "firstName": userInfo.data.first_name,
            "lastName": userInfo.data.last_name,
            "email": userInfo.data.email,
          })
        } else {
          if (data.status === 401) {
            router.push('/signin');
          } else {
            document.getElementById("error-modal")?.click();
          }
        }
      }
      run()
    } else {
      setUserInfo({})
    }
  }, [pathname])


  return (
    <div className="navbar bg-base-100 shadow-sm">
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
