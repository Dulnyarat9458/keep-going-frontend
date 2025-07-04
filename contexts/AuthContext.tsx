'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { inputError } from '@/types/form'

interface AuthContextType {
  userInfo: UserInfo
  signOut: () => void
  signIn: (input: { [key: string]: string | Date }) => Promise<inputError[] | null>
  signUp: (input: { [key: string]: string | Date }) => Promise<inputError[] | null>
  resetPassword: (input: { token: string | null, password: string }) => Promise<Response>
  forgetPassword: (input: { email: string }) => Promise<Response>
}

interface UserInfo {
  firstName?: string
  lastName?: string
  email?: string
}

const anonymousPath = [
  "/forget-password",
  "/reset-password",
  "/signin",
  "/signup"
]

const anonymousAllow = (path: string) => {
  return anonymousPath.includes(path)
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo>({})

  const fetchInfo = async () => {
    const data = await fetch('api/users/me',
      {
        method: 'GET',
        credentials: 'include',
      }
    )
    return data
  }

  const signIn = async (input: { [key: string]: string | Date }): Promise<inputError[] | null> => {
    const data = await fetch('api/signin',
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          email: input.email,
          password: input.password,
        }),
      }
    );
    if (data.status === 200) {
      return null
    } else {
      const errors = await data.json();
      return errors as inputError[];
    }
  }

  const signUp = async (input: { [key: string]: string | Date }): Promise<inputError[] | null> => {
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

    if (data.status === 200) {
      router.push('/signin?message=signup_success');
      return null;
    } else {
      const errors = await data.json();
      if (Array.isArray(errors)) {
        return errors as inputError[];
      } else {
        return [errors as inputError];
      }
    }
  }

  const resetPassword = async (input: { token: string | null, password: string }) => {
    return await fetch('api/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token: input.token,
        password: input.password,
      }),
    });
  };

  const forgetPassword = async (input: { email: string }) => {
    return await fetch('api/forget-password', {
      method: 'POST',
      body: JSON.stringify({
        email: input.email,
      }),
    });
  };

  const signOut = async () => {
    const data = await fetch(`api/signout`,
      {
        method: 'POST',
      }
    )

    if (data.status === 200) {
      router.push('/signin');
    } else {
      const errorText = document.getElementById("error-modal-text");
      if (errorText) {
        errorText.innerHTML = "Sign out failed.";
      }
      document.getElementById("error-modal")?.click();
    }
  }

  useEffect(() => {
    const run = async () => {
      const data = await fetchInfo();
      const userInfo = await data.json()

      if (data.status === 200) {
        setUserInfo({
          "firstName": userInfo.data.first_name,
          "lastName": userInfo.data.last_name,
          "email": userInfo.data.email,
        })
      } else {
        if (data.status === 401) {
          if (!anonymousAllow(pathname)) {
            router.push('/signin');
          }
        } else {
          const errorText = document.getElementById("error-modal-text");
          if (errorText) {
            errorText.innerHTML = "Something went wrong.";
          }
          document.getElementById("error-modal")?.click();
        }
      }
    }
    run();
  }, [pathname])


  return (
    <AuthContext.Provider value={{ userInfo, signOut, signIn, signUp, resetPassword, forgetPassword }}>
      {children}
      <input type="checkbox" id="success-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-success">Success</h3>
          <p className="py-4" id="success-modal-text"></p>
          <div className="modal-action">
            <label htmlFor="success-modal" className="btn">Close</label>
          </div>
        </div>
      </div>
      <input type="checkbox" id="error-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">Error</h3>
          <p className="py-4" id="error-modal-text"></p>
          <div className="modal-action">
            <label htmlFor="error-modal" className="btn">Close</label>
          </div>
        </div>
      </div>
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}
