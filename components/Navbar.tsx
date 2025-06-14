'use client'
import { usePathname } from 'next/navigation'
import React from 'react'
import Drawer from './Drawer'
import Link from 'next/link'

const mustShowDrawer = (path: string) => {

  const anonymousPath = [
    "/forget-password",
    "/reset-password", 
    "/signin", 
    "/signup"
  ]

  return !anonymousPath.includes(path)
}

export default function Navbar() {
  const pathname = usePathname()

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-none">
        {mustShowDrawer(pathname) && <Drawer />}
      </div>
      <div className="flex-1">
        <Link href={"/"} className="btn btn-ghost text-xl">MY HABITS</Link>
      </div>
    </div>
  )
}
