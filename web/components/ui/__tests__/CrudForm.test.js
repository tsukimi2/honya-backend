import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CrudForm from "../CrudForm"

const mockedFrmSubmitHandler = jest.fn().mockResolvedValue(true)
const mockedFrmLabelName = 'Mylabel'
const mockedInputPlaceholder = 'My placeholder'
const mockedFrmSubmitBtnTxt = 'Add'

describe.only('CrudForm', () => {
  beforeAll(() => {
    render(
      <CrudForm 
        frmSubmitHandler={mockedFrmSubmitHandler}
        frmLabelName={mockedFrmLabelName}
        frmInputPlaceholder={mockedInputPlaceholder}
        frmSubmitBtnTxt={mockedFrmSubmitBtnTxt}
        ishorizontalFrm="true"
      />
    )
  })

  it('should have empty input when add button is clicked', async () => {
    const inputElement = screen.getByRole('textbox')
    const btnSubmit = screen.getByRole('button')

    userEvent.type(inputElement, 'cat1')
    userEvent.click(btnSubmit)

    await waitFor(() => {
      expect(mockedFrmSubmitHandler).toHaveBeenCalledTimes(1)
      expect(inputElement.value).toBe('')
    })
  })
})