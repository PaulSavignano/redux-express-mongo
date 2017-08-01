import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import { Card, CardHeader } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'

import renderTextField from '../../components/fields/renderTextField'
import ImageForm from '../../components/images/ImageForm'
import { fetchUpdate, fetchDelete, stopEdit } from '../../actions/images'

class AdminImageEdit extends Component {
  state = {
    imageEdit: false
  }
  componentWillReceiveProps({ dispatch, submitSucceeded, item }) {
    if (submitSucceeded && !item.editing) {
      dispatch(stopEdit(item._id))
    }
  }
  handleImageEdit = (bool) => {
    this.setState({ imageEdit: bool })
    setTimeout(() => window.dispatchEvent(new Event('resize')), 10)
  }
  handleImageDelete = (_id, update) => {
    const { dispatch } = this.props
    this.setState({ imageEdit: false })
    return dispatch(fetchUpdate(_id, update))
  }
  setEditorRef = (editor) => this.editor = editor
  render() {
    const { dispatch, error, handleSubmit, item, submitting } = this.props
    return (
      <Dialog
        actions={
          <div className="button-container">
            <RaisedButton
              onTouchTap={handleSubmit((values) => {
                if (this.state.imageEdit) {
                  const image = this.editor.handleSave()
                  return dispatch(fetchUpdate(item._id, { type: 'UPDATE_IMAGE_AND_VALUES', image, values }))
                }
                return dispatch(fetchUpdate(item._id, { type: 'UPDATE_VALUES', values }))
              })}
              label={submitting ? <CircularProgress key={1} color="#ffffff" size={25} style={{ verticalAlign: 'middle' }} /> : 'UPDATE CARD'}
              primary={true}
              style={{ flex: '1 1 auto', margin: 4 }}
            />
            <RaisedButton
              type="button"
              label="X"
              className="delete-button"
              labelColor="#ffffff"
              style={{ flex: '0 1 auto', margin: 4 }}
              onTouchTap={() => dispatch(fetchDelete(item._id))}
            />
            <RaisedButton
              type="button"
              label="Cancel"
              className="delete-button"
              labelColor="#ffffff"
              style={{ flex: '0 1 auto', margin: 4 }}
              onTouchTap={() => dispatch(stopEdit(item._id))}
            />
          </div>
        }
        modal={false}
        open={item.editing}
        onRequestClose={() => dispatch(stopEdit(item._id))}
        autoScrollBodyContent={true}
        contentStyle={{ width: '100%', maxWidth: 1000 }}
        bodyStyle={{ padding: 8 }}
      >
        <Card>
          <CardHeader title={`Image ${item._id}`}/>
          <form>
            <ImageForm
              image={item.image}
              type="image/jpg"
              _id={item._id}
              onImageEdit={this.handleImageEdit}
              onImageDelete={this.handleImageDelete}
              ref={this.setEditorRef}
            />
            <div className="field-container">
              <Field
                name="flex"
                label="flex"
                className="field"
                component={renderTextField}
              />
              <Field
                name="margin"
                label="margin"
                className="field"
                component={renderTextField}
              />
              <Field
                name="width"
                label="width"
                className="field"
                component={renderTextField}
              />
              <Field
                name="zDepth"
                label="zDepth"
                className="field"
                component={renderTextField}
              />
            </div>
          </form>
          {error && <div className="error">{error}</div>}
        </Card>
      </Dialog>
    )
  }
}

AdminImageEdit = compose(
  connect((state, { item }) => {
    const values = item.values || {}
    return {
      form: `image_${item._id}`,
      item,
      initialValues: {
        ...values,
        zDepth: values.zDepth && values.zDepth.toString()
       }
    }
  }),
  reduxForm({
    destroyOnUnmount: false,
    asyncBlurFields: []
  }))(AdminImageEdit)

export default AdminImageEdit