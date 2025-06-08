import React from 'react'

export default function ResetPasswordForm() {
  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 m-auto">
      <legend className="fieldset-legend">Reset Password</legend>
      <label className="label">Password</label>
      <input type="password" className="input" placeholder="Password" />
      <label className="label">Confirm Password</label>
      <input type="password" className="input" placeholder="Password" />
      <button className="btn btn-neutral mt-2">Reset Password</button>
    </fieldset>
  )
}
