import { render } from '@testing-library/react'
import AuthContextProvider from '../../contexts/AuthContext'

const renderWithAuthContext = (ui, options) => render(ui, {
  wrapper: AuthContextProvider,
  ...options
})

export * from '@testing-library/react' // re-export everything
export { renderWithAuthContext } // override render method