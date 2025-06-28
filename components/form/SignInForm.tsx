"use client";

import { errorTranslate } from '@/constants/errorMessages';
import { snakeToCamel } from '@/utils/caseConverter';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod/v4';

export default function SignInForm() {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  type RegisterForm = {
    email: string;
    password: string;
  };

  const schema = z
    .object({
      email: z.string().email().min(1, { message: 'Email is required' }),
      password: z.string().min(6, { message: 'Required more than 6 character' }),
    })

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  type inputError = {
    error: string
    field: string
  }

  const onSubmit = async (input: { [key: string]: string }) => {
    setLoading(true);
    const data = await fetch('api/signin',
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          email: input.email,
          password: input.password,
        }),
      }
    )

    if (data.status === 200) {
      router.push('/');
    } else {
      const posts = await data.json()
      if (Array.isArray(posts)) {
        posts.forEach((value: inputError) => {
          if (value.field === "json") {
            document.getElementById("error-modal")?.click();
          } else {
            setError(snakeToCamel(value.field) as keyof RegisterForm, {
              type: "manual",
              message: errorTranslate[value.error as string] || "Something went wrong",
            });
          }
        });
      } else {
        if (posts.field === "json") {
          document.getElementById("error-modal")?.click();
        } else {
          setError(snakeToCamel(posts.field) as keyof RegisterForm, {
            type: "manual",
            message: errorTranslate[posts.error as string] || "Something went wrong",
          });
        }
      }
    }
    setLoading(false);
  }


  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 m-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <legend className="fieldset-legend">Sign In</legend>
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
        <div className='text-end'>
          <Link href={"/forget-password"} className='link link-secondary'>Forget Password</Link>
        </div>
        <button className="btn btn-neutral mt-2 w-full" disabled={loading}>          {
          loading
            ? <span className="loading loading-spinner loading-xs"></span>
            : "Sign In"
        }</button>
      </form>
      <p className='text-center mt-2'>
        Don't have an Account?
        <Link href={"/signup"} className='link link-primary ml-1'>Sign Up</Link>
      </p>
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
