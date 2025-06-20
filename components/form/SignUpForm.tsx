"use client";

import Link from 'next/link'
import React from 'react'

import { useForm, Resolver } from "react-hook-form"


import * as z from "zod/v4";
import { zodResolver } from '@hookform/resolvers/zod';

export default function SignUpForm() {

  const schema = z
    .object({
      firstName: z.string().min(1, { message: 'Required' }),
      lastName: z.string().min(1, { message: 'Required' }),
      email: z.string().email().min(1, { message: 'Required' }),
      password: z.string().min(6, { message: 'Required more than 6 character' }),
      confirmPassword: z.string().min(1, { message: 'Required' })
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: { [key: string]: string }) => {
    console.log(data)
  }


  return (

    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 m-auto">
      <legend className="fieldset-legend">Sign Up</legend>
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className='mb-2'>
          <label className="label">First Name</label>
          <input
            {...register("firstName")}
            className={`input ${errors.firstName?.message
              ? "border-error focus:border-error focus:outline-0 focus:outline-error"
              : ""
              }`}
            placeholder="First Name"
          />
          <p className='text-error'>{errors.firstName?.message}</p>
        </div>
        <div className='mb-2'>
          <label className="label">Last Name</label>
          <input
            type="text" {...register('lastName')}
            className={`input ${errors.lastName?.message
              ? "border-error focus:border-error focus:outline-0 focus:outline-error"
              : ""}`}
            placeholder="Last Name"
          />
          <p className='text-error'>{errors.lastName?.message}</p>
        </div>

        <div className='mb-2'>
          <label className="label">Email</label>
          <input
            type="email" {...register('email')}
            className={`input ${errors.email?.message
              ? "border-error focus:border-error focus:outline-0 focus:outline-error"
              : ""}`}
            placeholder="Email"
          />
          <p className='text-error'>{errors.email?.message}</p>
        </div>

        <div className='mb-2'>
          <label className="label">Password</label>
          <input
            type="password" {...register('password')}
            className={`input ${errors.password?.message
              ? "border-error focus:border-error focus:outline-0 focus:outline-error"
              : ""}`}
            placeholder="Password"
          />
          <p className='text-error'>{errors.password?.message}</p>
        </div>

        <div className='mb-2'>
          <label className="label">Confirm Password</label>
          <input
            type="password" {...register('confirmPassword')}
            className={`input ${errors.confirmPassword?.message
              ? "border-error focus:border-error focus:outline-0 focus:outline-error"
              : ""}`}
            placeholder="Password"
          />
          <p className='text-error'>{errors.confirmPassword?.message}</p>
        </div>


        <button className="btn btn-neutral mt-2 w-full">Sign Up</button>
        <p className='text-center mt-2'>
          Already have an Account?
          <Link href={"/signin"} type='submit' className='link link-primary ml-1'>Sign In</Link>
        </p>
      </form>
    </fieldset>

  )
}
