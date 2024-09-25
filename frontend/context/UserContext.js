import React, { createContext, useState, Children, isValidElement } from 'react';

// Create the UserContext
export const UserContext = createContext();

// UserProvider component to wrap the app and provide user state
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);  

  const filteredChildren = Children.toArray(children).filter(child => {
    return isValidElement(child); 
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {filteredChildren}
    </UserContext.Provider>
  );
};
