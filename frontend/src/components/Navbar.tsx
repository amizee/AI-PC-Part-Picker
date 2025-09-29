import React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Navbar = ({
  children,
  className,
  ...props
}: {
  children?: React.ReactNode
  className?: string
}) => {

  const { logout } = useAuth()

  return (
    <div
      {...props}
      className={`bg-primary-blue-dark h-20 sticky flex justify-evenly text-white font-bold py-2 px-4 ${className}`}
    >
      <Link to="/search-parts">
        <NavComponent title="Search Parts" />
      </Link>
      <Link to="/chat">
        <NavComponent title="AI PC Builder" />
      </Link>
      <Link to="/advertising">
        <NavComponent title="Create Ad" />
      </Link>
      <Link to="/profile/account">
        <NavComponent title="Profile" />
      </Link>
      <Link to="/login" onClick={logout}>
        <NavComponent title="Logout" />
      </Link>
    </div>
  )
}

export const NavComponent = ({ title, ...props }: { title: string }) => {
  return (
    <button
      {...props}
      className={`p-5 rounded-md bg-primary-blue-light text-white font-bold`}
    >
      {title}
    </button>
  )
}

export default Navbar
