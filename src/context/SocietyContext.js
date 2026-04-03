import { createContext, useContext, useState } from "react";

const SocietyContext = createContext();

export function SocietyProvider({ children }) {
  const [society, setSociety] = useState(null);
  return (
    <SocietyContext.Provider value={{ society, setSociety }}>
      {children}
    </SocietyContext.Provider>
  );
}

export function useSociety() {
  return useContext(SocietyContext);
}
