"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { errorTranslate } from '@/constants/errorMessages';
import { snakeToCamel } from '@/utils/caseConverter';
import { inputError, SignInFormInput } from '@/types/form';
import { SignInSchema } from '@/schemas/forms';


export default function SignInForm() {
  // Hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const [loading, setLoading] = useState(false);

  // Schema
  const schema = SignInSchema

  // Form
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
            setError(snakeToCamel(value.field) as keyof SignInFormInput, {
              type: "manual",
              message: errorTranslate[value.error as string] || "Something went wrong",
            });
          }
        });
      } else {
        if (posts.field === "json") {
          document.getElementById("error-modal")?.click();
        } else {
          setError(snakeToCamel(posts.field) as keyof SignInFormInput, {
            type: "manual",
            message: errorTranslate[posts.error as string] || "Something went wrong",
          });
        }
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    if (message) {
      const modal = document.getElementById("success-modal") as HTMLInputElement
      if (modal) {
        modal.checked = true
      }
    }
  }, [message])

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
      <input type="checkbox" id="success-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-success">Success</h3>
          <p className="py-4">Register Success</p>
          <div className="modal-action">
            <label htmlFor="success-modal" className="btn">Close</label>
          </div>
        </div>
      </div>
    </fieldset>
  )
}
