import React, { Component } from 'react'

class Product extends Component {
  render() {
    return (
      <div>
        {this.props.name}
      </div>
    )
  }
}

export default Product
