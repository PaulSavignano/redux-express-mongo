import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import { Field, reduxForm, SubmissionError  } from 'redux-form'
import DialogAlert from '../../DialogAlert'
import { startSigninUser } from '../actions/users'

const validate = values => {
  const errors = {}
  const requiredFields = [ 'email', 'password' ]
  requiredFields.forEach(field => {
    if (!values[ field ]) {
      errors[ field ] = 'Required'
    }
  })
  if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }
  if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = 'Passwords must match'
  }
  return errors
}

const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <TextField hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}
  />
)


const styles = {
  grid: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-around',
    padding: '80px 0'
  },
  cell: {
    flex: '1 1 auto',
    maxWidth: 600,
    margin: '.8em 1em 0'
  },
  other: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between'
  }
}

let Signin = (props) => {
  console.log(props)
  const { error, dispatch, handleSubmit, submitting } = props
  return (
    <div style={styles.grid}>
      <Card style={styles.cell}>
        <CardTitle title="Sign in" subtitle="Enter your information" />
        <form onSubmit={handleSubmit(values => dispatch(startSigninUser(values)))} className="">
          <CardText>
            <Field name="email" component={renderTextField} label="Email" fullWidth={true} />
            <Field name="password" component={renderTextField} label="Password" fullWidth={true} type="password" />
          </CardText>
          {props.user.error ? <DialogAlert message={props.user.error} error={true}/> : ''}
          <CardActions>
            <RaisedButton
              label="Sign Up"
              fullWidth={true}
              disabled={submitting}
              type="submit"
              primary={true}
            />
          </CardActions>
        </form>
        <CardActions style={ styles.other }>
          <p>Don't have an account? <Link to="/signup">Sign up instead!</Link></p>
          <p><Link to="/recover">Forgot your password?</Link></p>
        </CardActions>
      </Card>
    </div>
  )
}


Signin = reduxForm({
  form: 'signup',
  validate
})(Signin)

const mapStateToProps = (state) => ({
  user: state.user
})

Signin = connect(mapStateToProps)(Signin)

export default Signin