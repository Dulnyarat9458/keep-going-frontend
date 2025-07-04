"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { errorTranslate } from '@/constants/errorMessages';
import { snakeToCamel } from '@/utils/caseConverter';
import { inputError, ResetPasswordFormInput } from '@/types/form';
import { ResetPasswordSchema } from '@/schemas/forms';
import { useAuth } from '@/contexts/AuthContext';


export default function ResetPasswordForm() {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const schema = ResetPasswordSchema;

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
    const response = await resetPassword({
      token: new URLSearchParams(window.location.search).get("token"),
      password: input.password,
    });

    if (response && response.status === 200) {
      const successText = document.getElementById("success-modal-text");
      if (successText) {
        successText.innerHTML = "Password reset successful! Please sign in.";
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
            setError(fieldName as keyof ResetPasswordFormInput, {
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
          setError(fieldName as keyof ResetPasswordFormInput, {
            type: "manual",
            message: errorTranslate[error.error as string] || "Something went wrong",
          });
        }
      }
    }
    setLoading(false);
  };
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
    </fieldset>
  );
}
