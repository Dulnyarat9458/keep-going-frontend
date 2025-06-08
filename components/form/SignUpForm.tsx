import Link from 'next/link'
import React from 'react'

export default function SignUpForm() {
  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 m-auto">
      <legend className="fieldset-legend">Sign Up</legend>
      <label className="label">First Name</label>
      <input type="text" className="input" placeholder="First Name" />
      <label className="label">Last Name</label>
      <input type="text" className="input" placeholder="Last Name" />
      <label className="label">Email</label>
      <input type="email" className="input" placeholder="Email" />
      <label className="label">Password</label>
      <input type="password" className="input" placeholder="Password" />
      <label className="label">Confirm Password</label>
      <input type="password" className="input" placeholder="Password" />
      <button className="btn btn-neutral mt-2">Sign Up</button>
      <p className='text-center mt-2'>
        Already have an Account?
        <Link href={"/signin"} className='link link-primary ml-1'>Sign In</Link>
      </p>
    </fieldset>
  )
}
