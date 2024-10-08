import React from 'react'

function Button({
    children,
    type = 'button',
    textColor = 'text-white',
    width = 'w-auto', // Default width to w-auto
    height='h-auto',
    className = '',
    ...props
}) {
    return (
        <button
            type={type}
            className={`px-4 py-1 ${width} ${height} rounded-md ${textColor} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button;
