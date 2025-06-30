'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  userInfo: UserInfo
  logout: () => void
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

  const logout = async () => {
    const data = await fetch(`api/signout`,
      {
        method: 'POST',
      }
    )

    if (data.status === 200) {
      router.push('/signin');
    } else {
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
          document.getElementById("error-modal")?.click();
        }
      }
    }
    run();
  }, [pathname])


  return (
    <AuthContext.Provider value={{ userInfo, logout }}>
      {children}
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
