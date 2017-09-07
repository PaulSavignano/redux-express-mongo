import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { connect } from 'react-redux'

const slideShowContainer = (ComposedComponent) => {
  class SlideShowContainer extends Component {
    state = {
      propsForParent: null,
      propsForChild: null
    }
    handleProps = (item) => {
      const {
        _id,
        image,
        values: {
          alignItems,
          backgroundColor,
          containerMarginTop,
          flexFlow,
          justifyContent,
          maxWidth,
          minHeight,
          margin,
          pageLink,
        }
      } = item
      const propsForParent = {
        id: pageLink || _id,
        style: {
          backgroundImage: image.src ? `url(${image.src})` : null,
          backgroundColor,
          marginTop: containerMarginTop,
          minHeight,
          position: 'relative'
        },
        className: image.src ? 'section background-image' : 'section'
      }
      const propsForChild = {
        style: {
          alignItems,
          display: 'flex',
          flexFlow,
          justifyContent,
          maxWidth,
          margin,
        }
      }
      this.setState({ propsForParent, propsForChild })
    }
    componentWillMount() {
      this.handleProps(this.props.item)
    }
    componentWillReceiveProps(nextProps) {
      this.handleProps(nextProps.item)
    }
    render() {
      const {
        propsForParent,
        propsForChild
      } = this.state
      const {
        autoplay,
        dispatch,
        item,
        pageId,
        pageSlug,
      } = this.props
      const props = {
        autoplay,
        dispatch,
        item,
        propsForParent,
        propsForChild,
        pageId,
        pageSlug,
      }
      return (
        <CSSTransitionGroup
          transitionName="image"
          transitionAppear={true}
          transitionAppearTimeout={600}
          transitionEnter={false}
          transitionLeave={false}
          style={{ width: '100%' }}
        >
          <ComposedComponent {...props} />
        </CSSTransitionGroup>
      )
    }
  }
  const mapStateToProps = ({
    swipeables: { autoplay },
  }, {
    item,
    pageId,
    pageSlug
  }) => ({
    autoplay,
    item,
    pageId,
    pageSlug
  })
  SlideShowContainer.propTypes = {
    autoplay: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired,
    pageId: PropTypes.string.isRequired,
    pageSlug: PropTypes.string.isRequired
  }
  return connect(mapStateToProps)(SlideShowContainer)
}

export default slideShowContainer
