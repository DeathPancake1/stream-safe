import React, { createContext, useContext, useState, ReactNode } from 'react'

interface UserData {
    email: string
    jwt: string
}

interface UserContextProps {
    userData: UserData
    updateUser: (email: string, jwt: string) => void
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

export function UserProvider({ children }): JSX.Element {
    const [userData, setUserData] = useState<UserData>({ email: '', jwt: ''})

    const updateUser = (email: string, jwt: string) => {
        setUserData({ email, jwt })
    }

    return <UserContext.Provider value={{ userData, updateUser }}>{children}</UserContext.Provider>
}

export const useUser = (): UserContextProps => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}