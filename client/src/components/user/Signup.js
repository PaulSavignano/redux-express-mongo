import React, { Component } from 'react'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import { Field, reduxForm } from 'redux-form'

import userContainer from '../../containers/user/userContainer'
import renderTextField from '../fields/renderTextField'
import { fetchAdd } from '../../actions/user'

const validate = values => {
  const errors = {}
  const requiredFields = [ 'firstName', 'lastName', 'email', 'password', 'passwordConfirm' ]
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

class Signup extends Component {
  state = { open: false }
  handleClose = () => this.setState({open: false})
  componentWillReceiveProps(nextProps) {
    if (nextProps.submitSucceeded) this.setState({ open: true })
  }
  render() {
    const {
      dispatch,
      error,
      handleSubmit,
      submitting,
      user
    } = this.props
    return (
      <div className="page">
        <section className="section-margin">
          <Card>
            <CardTitle title="Signup" subtitle="Enter your information" />
            <form onSubmit={handleSubmit(values => dispatch(fetchAdd(values)).then(() => this.props.reset()))} >
              <CardText>
                <Field name="firstName" component={renderTextField} label="First Name" fullWidth={true} />
                <Field name="lastName" component={renderTextField} label="Last Name" fullWidth={true} />
                <Field name="email" component={renderTextField} label="Email" fullWidth={true} />
                <Field name="password" component={renderTextField} label="Password" fullWidth={true} type="password" />
                <Field name="passwordConfirm" component={renderTextField} label="Password Confirm" fullWidth={true} type="password"/>
              </CardText>
              {error && <div className="error">{error}</div>}
              {!this.state.open ? null :
              <Dialog
                actions={
                  <FlatButton
                    label="Close"
                    primary={true}
                    onTouchTap={this.handleClose}
                  />
                }
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
              >
                Welcome {user.values.firstName && user.values.firstName}!
              </Dialog>
              }
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
          </Card>
        </section>
      </div>
    )
  }
}

Signup.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired
}

export default userContainer(
  reduxForm({
  form: 'signup',
  validate
})(Signup))
