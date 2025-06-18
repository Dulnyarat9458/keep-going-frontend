"use client";

import Link from 'next/link'
import React from 'react'

import { useForm, Resolver } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

export default function SignUpForm() {

  const schema = yup
    .object({
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      email: yup.string().required().email(),
      password: yup.string().required(),
      confirmPassword: yup.string().required().oneOf([yup.ref('password')], 'not same password')
    })
    .required()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: { [key: string]: string }) => {
    console.log(data)
  }


  return (

    <fieldset onSubmit={handleSubmit(onSubmit)} className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 m-auto">
      <legend className="fieldset-legend">Sign Up</legend>
      <form onSubmit={handleSubmit(onSubmit)}>

        <label className="label">First Name</label>
        <input type="text" {...register('firstName')} className="input" placeholder="First Name" />
        <p>{errors.firstName?.message}</p>

        <label className="label">Last Name</label>
        <input type="text" {...register('lastName')} className="input" placeholder="Last Name" />
        <p>{errors.lastName?.message}</p>

        <label className="label">Email</label>
        <input type="email" {...register('email')} className="input" placeholder="Email" />
        <p>{errors.email?.message}</p>

        <label className="label">Password</label>
        <input type="password" {...register('password')} className="input" placeholder="Password" />
        <p>{errors.password?.message}</p>

        <label className="label">Confirm Password</label>
        <input type="password" {...register('confirmPassword')} className="input" placeholder="Password" />
        <p>{errors.confirmPassword?.message}</p>

        <button className="btn btn-neutral mt-2 w-full">Sign Up</button>
        <p className='text-center mt-2'>
          Already have an Account?
          <button type='submit' className='link link-primary ml-1'>Sign In</button>
        </p>
      </form>
    </fieldset>

  )
}
