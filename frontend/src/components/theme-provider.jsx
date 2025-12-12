import { createContext, useContext, useEffect } from "react"

const initialState = {
  theme: "dark",
  setTheme: () => null,
}

const ThemeProviderContext = createContext(initialState)

export function ThemeProvider({
  children,
  ...props
}) {
  useEffect(() => {
    const root = window.document.documentElement
    
    // Always force dark mode
    root.classList.remove("light", "dark")
    root.classList.add("dark")
  }, [])

  const value = {
    theme: "dark",
    setTheme: () => {
      // Do nothing - theme is locked to dark
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}