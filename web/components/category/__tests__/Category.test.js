// import { findAllByText, renderWithAuthContext, screen, waitFor } from '../../../tests/test-utils/testing-library-context-utils'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Category from '../Category'


jest.mock('../../auth/WithAuth')
jest.mock('../../auth/WithAdmin')

describe('Category', () => {
  it('should render category list', async () => {
    // https://medium.com/tarmac/mocking-react-higher-order-components-hoc-with-jest-36fd52a891b3
    const initCategories = [
      { _id: '1', name: 'cat1' },
      { _id: '2', name: 'cat2' }
    ]
    render(
      <Category 
        initCategories={initCategories}
      />
    )
    const items = await screen.findAllByText(/cat/, { exact: false })
    expect(items).toHaveLength(2)
  })

  it('should add added category into list', async () => {
    const initCategories = []
    render(
      <Category 
        initCategories={initCategories}
      />
    )

    const input = screen.getByRole('textbox', { name: 'Category Name' })
    const btnAdd = screen.getByRole('button', { name: /Add Category/i, exact: false })
    let items = null

    userEvent.type(input, 'dummy1')
    await waitFor(() => userEvent.click(btnAdd))

    items = await screen.findAllByText(/dummy/, { exact: false })
    expect(items).toHaveLength(1)
  })

  /*
  it('should delete category from list upon clicking delete button', async () => {
    const initCategories = [
      { _id: '1', name: 'dummy1' }
    ]
    render(
      <Category 
        initCategories={initCategories}
      />
    )

    let btnDelete = screen.getByRole('button', { name: 'X', exact: true })
    userEvent.click(btnDelete)
    const btnDeleteOk = await screen.findByRole('button', { name: 'OK', exact: true })
    userEvent.click(btnDeleteOk)

    await waitFor(() => {
      btnDelete = screen.queryByRole('button', { name: 'X', exact: true })
      expect(btnDelete).toBeNull()
    })
  })
  */
})