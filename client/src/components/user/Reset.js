import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import renderTextField from '../../components/fields/renderTextField'
import { fetchReset } from '../../actions/user'

const validate = values => {
  const errors = {}
  const requiredFields = [ 'password', 'passwordConfirm' ]
  requiredFields.forEach(field => {
    if (!values[ field ]) {
      errors[ field ] = 'Required'
    }
  })
  if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = 'Passwords must match'
  }
  return errors
}

class Reset extends Component {
  state = {
    open: false
  }
  handleClose = () => this.setState({open: false})
  handleFormSubmit = values => {
    const { dispatch, params: { token }} = this.props
    return dispatch(fetchReset(values, token))
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.submitSucceeded) this.setState({ open: true })
  }
  render() {
    const {
      error,
      handleSubmit,
      submitting,
      user
    } = this.props
    return (
      user.isFetching ? null :
      <div className="page">
        <section className="section-margin">
          <Card>
            <CardTitle title="Reset" subtitle="Enter your email to recover your account" />
            <form onSubmit={handleSubmit(this.handleFormSubmit)} className="">
              <CardText>
                <Field name="password" component={renderTextField} label="Password" type="password" fullWidth={true}/>
                <Field name="passwordConfirm" component={renderTextField} label="Password Confirm" type="password" fullWidth={true}/>
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
                Welcome back {user.values.firstName || null}
              </Dialog>
              }
              <CardActions>
                <RaisedButton
                  label="Recover"
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

Reset.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired
}

Reset = reduxForm({
  form: 'recovery',
  validate
})(Reset)

const mapStateToProps = ({ user }) => ({
  user
})

Reset = connect(mapStateToProps)(Reset)

export default Reset
