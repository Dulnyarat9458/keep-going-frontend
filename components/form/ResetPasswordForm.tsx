"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

import z from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { errorTranslate } from '@/constants/errorMessages';
import { snakeToCamel } from '@/utils/caseConverter';


export default function ResetPasswordForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  type RegisterForm = {
    password: string;
    confirmPassword: string;
  };

  const schema = z
    .object({
      password: z.string().min(6, { message: 'Required more than 6 character' }),
      confirmPassword: z.string().min(1, { message: 'Confirm Password is required' })
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

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
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const data = await fetch('api/reset-password',
      {
        method: 'POST',
        body: JSON.stringify({
          token: token,
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
          setError(snakeToCamel(value.field) as keyof RegisterForm, {
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
      <legend className="fieldset-legend">Reset Password</legend>
      <form onSubmit={handleSubmit(onSubmit)}>
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
              : "Reset Password"
          }
        </button>
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
