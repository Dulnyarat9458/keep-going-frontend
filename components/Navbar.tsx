import React from 'react'
import Drawer from './Drawer'

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-none">
         <Drawer/>
      </div>

      <div className="flex-1">
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>
    </div>
  )
}
