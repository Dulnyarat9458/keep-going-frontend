import Link from 'next/link'
import React from 'react'

export default function SignInForm() {
  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 m-auto">
      <legend className="fieldset-legend">Sign In</legend>
      <label className="label">Email</label>
      <input type="email" className="input" placeholder="Email" />
      <label className="label">Password</label>
      <input type="password" className="input" placeholder="Password" />
      <Link href={"#"} className='link link-secondary text-end'>Forget Password</Link>
      <button className="btn btn-neutral mt-2">Sign In</button>
      <p className='text-center mt-2'>
        Don't have an Account?
        <Link href={"/signup"} className='link link-primary ml-1'>Sign Up</Link>
      </p>
    </fieldset>
  )
}
