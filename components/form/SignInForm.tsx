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
import { useAuth } from '@/contexts/AuthContext';


export default function SignInForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const [loading, setLoading] = useState(false);

  const schema = SignInSchema

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
    const error = await signIn(input);
    if (error) {
      if (Array.isArray(error)) {
        (error as inputError[]).forEach((value) => {
          if (value.field === "json") {
            const errorText = document.getElementById("error-modal-text");
            if (errorText) {
              errorText.innerHTML = "Something went wrong.";
            }
            document.getElementById("error-modal")?.click();
          } else {
            const fieldName = snakeToCamel(value.field.trim());
            setError(fieldName as keyof SignInFormInput, {
              type: "manual",
              message: errorTranslate[value.error as string] || "Something went wrong",
            });
          }
        });
      } else {
        const singleError = error as inputError;
        if (singleError.field === "json") {
          const errorText = document.getElementById("error-modal-text");
          if (errorText) {
            errorText.innerHTML = "Something went wrong.";
          }
          document.getElementById("error-modal")?.click();
        } else {
          const fieldName = snakeToCamel(singleError.field.trim());
          setError(fieldName as keyof SignInFormInput, {
            type: "manual",
            message: errorTranslate[singleError.error as string] || "Something went wrong",
          });
        }
      }
      setLoading(false);
      return;
    } else {
      router.push('/');
    }
    setLoading(false);
  }

  useEffect(() => {
    if (message) {
      const successText = document.getElementById("success-modal-text");
      if (successText) {
        if (message === "signup_success") {
          successText.innerHTML = "Sign up successful! Please sign in.";
        } else {
          successText.innerHTML = message;
        }
      }
      document.getElementById("success-modal")?.click();
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
    </fieldset>
  )
}
