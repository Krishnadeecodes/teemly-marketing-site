import { createContext, useContext } from 'react'

// { user, setUser, logout } for the signed-in admin user (provided by AdminApp).
export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)
