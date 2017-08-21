import { type } from '../actions/cart'

const carts = (state = {
  isFetching: false,
  cart: {
    quantity: 0,
    total: 0,
    subTotal: 0,
    tax: 0,
    items: []
  }
}, action) => {
  switch (action.type) {
    case `REQUEST_${type}`:
      return {
        ...state,
        isFetching: true
      }
    case `ADD_${type}`:
      return {
        ...state,
        cart: action.cart
      }
    case `RECEIVE_${type}`:
      return {
        ...state,
        cart: action.cart,
        isFetching: false
      }
    case `UPDATE_${type}`:
      return {
        ...state,
        cart: action.cart
      }
    case `DELETE_${type}`:
      return {
        isFetching: false,
        cart: {
          items: []
        }
      }
    case `ERROR_${type}`:
      return {
        ...state,
        error: action.error
      }
    default:
      return state
  }
}

export default carts
