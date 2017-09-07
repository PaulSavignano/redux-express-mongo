import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { connect } from 'react-redux'


const sectionContainer = (ComposedComponent) => {
  class SectionContainer extends Component {
    state = {
      backgroundImage: false,
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
          margin
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
        dispatch,
        item,
        autoplay,
        pageId,
        pageSlug,
      } = this.props
      const props = {
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
  }, {
    item, pageId, pageSlug
  }) => ({
    item, pageId, pageSlug
  })
  SectionContainer.propTypes = {
    item: PropTypes.object.isRequired,
    pageId: PropTypes.string.isRequired,
    pageSlug: PropTypes.string.isRequired
  }
  return connect(mapStateToProps)(SectionContainer)
}

export default sectionContainer
