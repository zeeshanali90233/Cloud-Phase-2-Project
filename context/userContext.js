import React from 'react'
import { createContext, useState } from "react";

export const user_Detail_Context = createContext(null);

const UserContext = ({children}) => {
    const [user, setUser] = useState({});

  return (
    <user_Detail_Context.Provider value={{ user, setUser }}>
    {children}
  </user_Detail_Context.Provider>
  )
}

export default UserContext
