import React from "react"

interface CustomButtonProps {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  [key: string]: any // Allow any other props
}

const Button: React.FC<CustomButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`bg-primary-blue-dark text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 ${className}`}
    >
      {children}
    </button>
  )
}

export default Button

