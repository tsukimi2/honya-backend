import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import zxcvbn from 'zxcvbn'
import { MDBProgress, MDBProgressBar } from 'mdb-react-ui-kit'

const SCORE = [
  { LABEL: 'Poor', COLOR: 'danger' },
  { LABEL: 'Very weak', COLOR: 'danger' },
  { LABEL: 'Weak', COLOR: 'warning' },
  { LABEL: 'Strong', COLOR: 'info' },
  { LABEL: 'Very strong', COLOR: 'success' }
]

const getPasswordStrengthLabel = (score) => {
  return SCORE[score].LABEL
}
const getPasswordStrengthColor = (score) => SCORE[score].COLOR

const PasswordStrengthMeter = ({ password, className }) => {
  const [passwordStrengthScore, setPasswordStrengthScore] = useState(0)
  const [passwordStrengthLabel, setPasswordStrengthLabel] = useState('Poor')
  const [passwordStrengthColor, setPasswordStrengthColor] = useState(SCORE[0].COLOR)
  
  useEffect(() => {
    const passwordStrength = zxcvbn(password)
    if(passwordStrength && passwordStrength.score >= 0 && passwordStrength.score < 5) {
      setPasswordStrengthScore(passwordStrength ? (passwordStrength.score + 1) * (100 / SCORE.length) : 0)
      setPasswordStrengthLabel(getPasswordStrengthLabel(passwordStrength.score))
      setPasswordStrengthColor(getPasswordStrengthColor(passwordStrength.score))
    }
  }, [password])

  return (
      <MDBProgress height='20' className={className}>
        <MDBProgressBar
          bgColor={passwordStrengthColor}
          width={passwordStrengthScore}
          valuemin={0}
          valuemax={100}>
        {passwordStrengthLabel}
        </MDBProgressBar>
    </MDBProgress>
  )
}

PasswordStrengthMeter.propTypes = {
  password: PropTypes.string.isRequired,
  className: PropTypes.string
}

PasswordStrengthMeter.defaultProps = {
  className: 'mb-4'
}

export default PasswordStrengthMeter

