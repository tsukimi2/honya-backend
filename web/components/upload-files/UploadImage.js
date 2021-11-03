import { useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Alert from 'react-bootstrap/Alert'
import { createProduct } from '../../libs/apiUtils/product-api-utils'

const UploadImage = () => {
  const [currentFile, setCurrentFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [imageInfo, setImageInfo] = useState({})
  
  const selectFile = (event) => {
    setCurrentFile(event.target.files[0])
    setPreviewImage(URL.createObjectURL(event.target.files[0])),
    setProgress(0),
    setMessage('')
  }

  const upload = () => {
    setProgress(0)

    try {
      const product = createProduct(currentFile, (event) => {
        setProgress(Math.round((100 * event.loaded) / event.total))
      })
      setMessage(`Product ${product.name} created successfully`)

    } catch(err) {
      setProgress(0)
      setMessage('Failed to upload the image')
      setCurrentFile(null)
    }
  }

  return (
    <div>
      <Row>
        <Col md={8}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Control type="file" accept="image/*" onChange={selectFile} />
        </Form.Group>
        </Col>
        <Col md={4}>
          <Button variant="success" disabled={!currentFile} onClick={upload}>Upload</Button>
        </Col>
      </Row>

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

      {
        message && (
          <Alert variant={secondary}>{message}</Alert>
        )
      }
    </div>
  )
}

/*

*/


export default UploadImage