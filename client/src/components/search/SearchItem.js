import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, CardTitle, CardText } from 'material-ui/Card'
import renderHTML from 'react-render-html'

import './search.css'
import history from '../../containers/routers/history'
import Text from '../typography/Text'
import Media from '../media/Media'
import { searchDelete } from '../../actions/search'

class SearchItem extends Component {
  state = {
    elevation: 1,
    slug: null
  }
  handleMouseEnter = () => this.setState({ elevation: 4 })
  handleMouseLeave = () => this.setState({ elevation: 1 })
  handleNavigation = () => {
    const { slug } = this.state
    const { dispatch, item: { item: _id }} = this.props
    dispatch(searchDelete())
    return history.push(`/${slug}#${_id}`)
  }
  componentWillMount() {
    const { productSlug, pageSlug } = this.props
    const slug = productSlug ? `products/${productSlug}` : pageSlug
    this.setState({ slug })
  }
  render() {
    const {
      item: {
        item: {
          image,
          values: {
            h1Text,
            h2Text,
            h3Text,
            iframe,
            pText,
            name,
            description,
            detail
          }
        }
      }
    } = this.props
    return (
      <Card
        zDepth={this.state.elevation}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onTouchTap={this.handleNavigation}
        className="card"
        containerStyle={{ display: 'flex', flexFlow: 'row wrap'}}
      >
        {image && image.src ?
          <Media
            image={image}
            iframe={iframe}
            flex="1 1 300px"
          />
        : null}
        <div className="search-content">
          {h1Text || h2Text || h3Text || pText ?
            <Text
              h1Text={h1Text}
              h2Text={h2Text}
              h3Text={h3Text}
              pText={pText}
            />
          : null}
          {name && <CardTitle>{name}</CardTitle>}
          {description && <CardText style={{paddingTop: 0}}>{description}</CardText>}
          {detail && <CardText style={{paddingTop: 0}}>{detail}</CardText>}
        </div>

      </Card>
    )
  }
}

SearchItem.propTypes = {
  dispatch: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
}

export default SearchItem