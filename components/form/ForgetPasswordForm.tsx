import Link from 'next/link'
import React from 'react'

export default function ForgetPasswordForm() {
  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 m-auto">
      <legend className="fieldset-legend">Forget Password</legend>
      <label className="label">Email</label>
      <input type="email" className="input" placeholder="Email" />
      <button className="btn btn-neutral mt-2">Send Email</button>
    </fieldset>
  )
}
