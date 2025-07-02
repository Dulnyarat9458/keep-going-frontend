"use client";

import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form"

import { snakeToCamel } from '@/utils/caseConverter'
import { errorTranslate } from '@/constants/errorMessages';
import { inputError, SignUpFormInput } from '@/types/form';
import { SignUpSchema } from '@/schemas/forms';


export default function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const schema = SignUpSchema

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })


  const onSubmit = async (input: { [key: string]: string }) => {
    setLoading(true);
    const data = await fetch('api/signup',
      {
        method: 'POST',
        body: JSON.stringify({
          first_name: input.firstName,
          last_name: input.lastName,
          email: input.email,
          password: input.password,
        }),
      }
    )

    const posts = await data.json()

    if (data.status === 200) {
      router.push('/signin?message=signup_success');
    } else {
      posts.forEach((value: inputError) => {
        if (value.field === "json") {
          document.getElementById("error-modal")?.click();
        } else {
          setError(snakeToCamel(value.field) as keyof SignUpFormInput, {
            type: "manual",
            message: errorTranslate[value.error as string] || "Something went wrong",
          });
        }
      });
    }
    setLoading(false);
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

        <button className="btn btn-neutral mt-2 w-full" disabled={loading}>
          {
            loading
              ? <span className="loading loading-spinner loading-xs"></span>
              : "Sign Up"
          }
        </button>

        <p className='text-center mt-2'>
          Already have an Account?
          <Link href={"/signin"} type='submit' className='link link-primary ml-1'>Sign In</Link>
        </p>
      </form>
      <input type="checkbox" id="error-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">Error</h3>
          <p className="py-4">Something went wrong.</p>
          <div className="modal-action">
            <label htmlFor="error-modal" className="btn">Close</label>
          </div>
        </div>
      </div>
    </fieldset>
  )
}
