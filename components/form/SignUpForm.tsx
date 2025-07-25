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
import { useAuth } from '@/contexts/AuthContext';


export default function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
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
    const error = await signUp(input);
    if (error) {
      if (Array.isArray(error)) {
        error.forEach((value: inputError) => {
          if (value.field === "json") {
            const errorText = document.getElementById("error-modal-text");
            if (errorText) {
              errorText.innerHTML = "Something went wrong.";
            }
            document.getElementById("error-modal")?.click();
          } else {
            const fieldName = snakeToCamel(value.field.trim());
            setError(fieldName as keyof SignUpFormInput, {
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
          setError(fieldName as keyof SignUpFormInput, {
            type: "manual",
            message: errorTranslate[singleError.error as string] || "Something went wrong",
          });
        }
      }
    } else {
      const successText = document.getElementById("success-modal-text");
      if (successText) {
        successText.innerHTML = "Sign up successful! Please sign in.";
      }
      document.getElementById("success-modal")?.click();
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
    </fieldset>
  )
}
