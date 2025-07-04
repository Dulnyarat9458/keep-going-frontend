"use client";

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { errorTranslate } from '@/constants/errorMessages';
import { snakeToCamel } from '@/utils/caseConverter';
import { ForgetPasswordFormInput, inputError } from '@/types/form';
import { ForgetPasswordSchema } from '@/schemas/forms';
import { useAuth } from '@/contexts/AuthContext';


export default function ForgetPasswordForm() {
  const { forgetPassword } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const schema = ForgetPasswordSchema;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (input: { [key: string]: string }) => {
    setLoading(true);
    const response = await forgetPassword({ email: input.email });
    if (response && response.status === 200) {
      const successText = document.getElementById("success-modal-text");
      if (successText) {
        successText.innerHTML = "Reset password link sent! Please check your email.";
      }
      document.getElementById("success-modal")?.click();
      setTimeout(() => router.push('/signin'), 1500);
    } else {
      const error = await response.json();
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
            setError(fieldName as keyof ForgetPasswordFormInput, {
              type: "manual",
              message: errorTranslate[value.error as string] || "Something went wrong",
            });
          }
        });
      } else {
        if (error.field === "json") {
          const errorText = document.getElementById("error-modal-text");
          if (errorText) {
            errorText.innerHTML = "Something went wrong.";
          }
          document.getElementById("error-modal")?.click();
        } else {
          const fieldName = snakeToCamel(error.field.trim());
          setError(fieldName as keyof ForgetPasswordFormInput, {
            type: "manual",
            message: errorTranslate[error.error as string] || "Something went wrong",
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
    </fieldset>
  )
}
