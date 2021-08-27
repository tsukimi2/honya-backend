import Alert from 'react-bootstrap/Alert'
import PropTypes from 'prop-types'
import { ARR_ALERT_LEVELS, UI_DANGER } from '../../libs/constants/ui-contants'

const ShowAlert = ({ children, alertLevel }) => {
  return (
    <Alert variant={alertLevel}>
      {children}
    </Alert>
  )
}

ShowAlert.propTypes = {
  alertLevel: PropTypes.oneOf(ARR_ALERT_LEVELS)
}

ShowAlert.defaultProps = {
  alertLevel: UI_DANGER
}

export default ShowAlert