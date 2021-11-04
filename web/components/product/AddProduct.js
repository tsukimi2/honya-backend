import { useState, useEffect, useRef } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { MDBBtn } from 'mdb-react-ui-kit'
import { Formik } from 'formik'
import _ from 'lodash-core'
import { ToastContainer, toast } from 'react-toastify'
import * as Yup from 'yup'
import WithAuth from "../auth/WithAuth"
import WithAdmin from "../auth/WithAdmin"
import FormikInput from '../ui/FormikInput'
import FormikSelect from '../ui/FormikSelect'
import styles from './AddProduct.module.css'
import { createProduct } from "../../libs/apiUtils/product-api-utils"
import { useCategories } from '../../libs/apiUtils/category-api-utils'
import LoadingOverlay from '../ui/LoadingOverlay'
import ShowAlert from '../ui/ShowAlert'

/* eslint-disable @next/next/no-img-element */
const addProductValidationSchema = {
  name: Yup.string()
    .required('Required')
    .min(3, 'Must be between 3 and 20 characters')
    .max(80, 'Must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_\- :]+$/),
  description: Yup.string()
    .required('Required')
    .max(2000, 'Must not exceed 2000 characters')
    .matches(/^[a-zA-Z0-9_\- :]+$/),
  price: Yup.number()
    .required('Reqired')
    .min(0, 'Cannot be less than 0')
    .max(1000, 'Cannot exceed 1000'),
  category: Yup.string().required('Required'),
  shipping: Yup.string().required('Required'),
  quantity: Yup.number()
    .required('Required')
    .min(0, 'Cannot be less than 0')
    .max(1000, 'Cannot exceed 1000')
}

// https://codersingh.medium.com/image-upload-in-reactjs-using-formik-e9766ad87d64
// https://stackoverflow.com/questions/56149756/reactjs-how-to-handle-image-file-upload-with-formik
const AddProduct = () => {
  const [optListCategories, setOptListCategories] = useState([])
  const { categories, isLoading }= useCategories()
  const [loading, setLoading] = useState(isLoading)
  const [error] = useState(null)
  const [currentFile, setCurrentFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [progress, setProgress] = useState(0)
  const fileRef = useRef()

  const shippingOptList = [
    { id: "0", val: 'No' },
    { id: "1", val: 'Yes' }
  ]

  const selectFile = (event) => {
    setCurrentFile(event.target.files[0])
    setPreviewImage(URL.createObjectURL(event.target.files[0])) // eslint-disable-line no-undef
    setProgress(0)
  }

  useEffect(() => {
    setOptListCategories(transformCategoriesToOptList(categories))
  }, [categories])

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading])

  const transformCategoriesToOptList = (categories) => {
    if(!categories) return []
    return categories.map(elem => ({ id: elem._id, val: elem.name }))
  }

  const submitHandler = async (values) => {
    setProgress(0)

    try {
      await createProduct(values, currentFile, (event) => {
        setProgress(Math.round((100 * event.loaded) / event.total))
      })
      toast.success(`Add product ${values.name} successful`, {
        toastId: 'addProucdctSuccessToastId',
      })
      setProgress(0)
      setCurrentFile(null)
      return true
    } catch(err) {
      toast.error(`Add product ${values.name} failed due to ${err.message}`, {
        toastId: 'addProductFailToastId',
      })
      setProgress(0)
      setCurrentFile(null)
    }

    return false
  }

  const AddProductForm = () => (
      <Formik
        initialValues={{
          name: '',
          file: null,
          description: '',
          price: '',
          category: '',
          shipping: '',
          quantity:''
        }}
        validationSchema={
          Yup.object(addProductValidationSchema)
        }
        onSubmit={async (values, { resetForm, setFieldValue }) => {
          const isSubmitSuccess = await submitHandler(values)
          if(isSubmitSuccess) {
            setFieldValue("file", null)
            resetForm()
            fileRef.current.value = ''
          }
        }}
      >
        {
          ({ handleSubmit, handleChange, setFieldValue, errors, isSubmitting }) => (
            <Form className={styles.form} onSubmit={handleSubmit}>
              <FormikInput
                label="Name"
                name="name"
                type="text"
                ishorizontal="true"
                className="mb-3"
                handleChange={handleChange}
              />

              <FormikInput
                label="Description"
                name="description"
                type="text"
                ishorizontal="true"
                className="mb-3"
                handleChange={handleChange}
              />

              <FormikInput
                label="Price"
                name="price"
                type="number"
                ishorizontal="true"
                className="mb-3"
                handleChange={handleChange}
              />

              <FormikSelect
                label="Category"
                name="category"
                ishorizontal="true"
                className="mb-3"
                optList={optListCategories}
              />

              <FormikSelect
                label="Shipping"
                name="shipping"
                ishorizontal="true"
                optList={shippingOptList}
                className="mb-3"
              />

              <FormikInput
                label="Quantity"
                name="quantity"
                type="number"
                ishorizontal="true"
                className="mb-3"
                handleChange={handleChange}
              />

              <Form.Group as={Row} controlId="file" className="mb-3">
                <Form.Label column md={2}>Photo</Form.Label>
                <Col md={10}>
                  <Form.Control
                    type="file"
                    ref={fileRef}
                    onChange={(event) => {
                      setFieldValue("file", event.target.files[0])
                      selectFile(event)
                    }}
                  />
                </Col>
              </Form.Group>          

              {
                currentFile && <ProgressBar now={progress} min={0} max={100} />
              }

              {
                previewImage && (
                  <div>
                    <img className="preview" src={previewImage} alt="" />
                  </div>
                )
              }

              <div className={styles.submitBtncontainer}>
                <MDBBtn rounded type="submit" color="primary" disabled={isSubmitting || !(_.isEmpty(errors))}>
                    Create Product
                  </MDBBtn>
              </div>
            </Form>
          )
        }

      </Formik>
  )

  return (
    <>
      {
        loading && (<LoadingOverlay />)
      }
      <Container md={{ span: 8, offset: 2 }} className="mt-2">
        {
          error && (
            <ShowAlert alertLevel="danger">{error}</ShowAlert>
          )
        }
        { AddProductForm() }
      </Container>
      <ToastContainer
        position="bottom-center"
        autoClose={false}
        limit={1}
        hideProgressBar
        draggable={false}
      />
    </>
  )
}
/* eslint-disable @next/next/no-img-element */

export default WithAuth(WithAdmin(AddProduct))