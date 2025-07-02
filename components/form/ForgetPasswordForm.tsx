"use client";

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { errorTranslate } from '@/constants/errorMessages';
import { snakeToCamel } from '@/utils/caseConverter';
import { ForgetPasswordFormInput, inputError } from '@/types/form';
import { ForgetPasswordSchema } from '@/schemas/forms';


export default function ForgetPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const schema = ForgetPasswordSchema

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
    const data = await fetch('api/forget-password',
      {
        method: 'POST',
        body: JSON.stringify({
          email: input.email,
        }),
      }
    )

    if (data.status === 200) {
      router.push('/signin?message=sended reset password');
    } else {
      const posts = await data.json()
      if (Array.isArray(posts)) {
        posts.forEach((value: inputError) => {
          if (value.field === "json") {
            document.getElementById("error-modal")?.click();
          } else {
            setError(snakeToCamel(value.field) as keyof ForgetPasswordFormInput, {
              type: "manual",
              message: errorTranslate[value.error as string] || "Something went wrong",
            });
          }
        });
      } else {
        if (posts.field === "json") {
          document.getElementById("error-modal")?.click();
        } else {
          setError(snakeToCamel(posts.field) as keyof ForgetPasswordFormInput, {
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
        <legend className="fieldset-legend">Forget Password</legend>
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
        <button className="btn btn-neutral mt-2 w-full" disabled={loading}>          {
          loading
            ? <span className="loading loading-spinner loading-xs"></span>
            : "Sign In"
        }</button>
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
