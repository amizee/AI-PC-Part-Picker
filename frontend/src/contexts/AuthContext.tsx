import React, { createContext, useState, useContext, useEffect } from "react"

interface AuthContextProps {
  isLoggedIn: boolean
  getUserId: () => number | null
  setUserId: (token: number) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  getUserId: () => null,
  setUserId: () => {},
  logout: () => {},
})

const isLoggedInFunc = () => {
  return "token" in sessionStorage && sessionStorage.getItem("token") !== ""
}

export const AuthProvider = ({
  children
}: {
  children: React.ReactElement
}) => {
  const [refresh, setRefresh] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInFunc())

  useEffect(() => {
    const timeout = setTimeout(() => {
      sessionStorage.setItem("token", "")
      sessionStorage.setItem("isAdmin", "false")
      setIsLoggedIn(false)
      console.log("Token expired")
    }, 30 * 60 * 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [refresh])

  const getUserId = () => {
    const token = sessionStorage.getItem("token")
    if ( token === null) {
      return null
    }
    return parseInt(token, 10)
  }

  const setUserId = (id: number) => {
    sessionStorage.setItem("token", id.toString())
    setIsLoggedIn(isLoggedInFunc())
    setRefresh(!refresh)
  }

  const logout = () => {
    sessionStorage.setItem("token", "")
    sessionStorage.setItem("isAdmin", "false")
    setIsLoggedIn(false)
    setRefresh(!refresh)
  }

  return (<AuthContext.Provider
    value={{
      isLoggedIn: isLoggedIn,
      getUserId: getUserId,
      logout: logout,
      setUserId: setUserId,
    }}>{children}</AuthContext.Provider>)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within a AuthContext")
  }
  return context
}

export function generateHeader() {
  const token = sessionStorage.getItem("token")
  return `Bearer ${token}`
}
