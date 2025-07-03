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
      router.push('/signin?message=signup_success');
    } else {
      const error = await response.json();
      if (Array.isArray(error)) {
        error.forEach((value: inputError) => {
          if (value.field === "json") {
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
  );
}
