import express from 'express'
import { ObjectID } from 'mongodb'

import Cart from '../models/Cart'
import Product from '../../products/models/Product'
import authenticate from '../../middleware/authenticate'

const carts = express.Router()


// Create
carts.post('/', (req, res) => {
  const { productId, productQty } = req.body
  Product.findOne({ _id: productId })
    .then(product => {
      const { price, name } = product.values
      const cart = new Cart({
        total: productQty * price + ((productQty * price) * .075),
        subTotal: productQty * price,
        quantity: productQty,
        items: [{
          productId,
          productQty,
          image: product.image,
          name,
          price,
          total: productQty * price
        }]
      })
      cart.save()
        .then(doc => {
          res.header('cart', doc._id).send(doc)
        })
        .catch(err => {
          console.log(err)
          res.status(400).send(err)
        })
    })
})



// Read
carts.get('/:_id', (req, res) => {
  const _id = req.params._id
  if (!ObjectID.isValid(_id)) {
    return res.status(404).send()
  }
  Cart.findById(_id)
    .then((cart) => {
      if (!cart) {
        return res.status(404).send()
      }
      res.send(cart)
    })
    .catch((err) => res.status(400).send(err))
})




// Update
carts.patch('/:_id', (req, res) => {
  const _id = req.params._id
  const { type, productId, productQty } = req.body
  if (!ObjectID.isValid(_id)) return res.status(404).send()
  Cart.findOne({ _id })
    .then(cart => {
      const index = cart.items.map(i => i.productId.toHexString()).indexOf(productId)
      if (index !== -1) {
        switch (type) {
          case 'ADD_TO_CART':
            cart.total = cart.total + ((cart.items[index].price * productQty) + (cart.items[index].price * productQty) * .075)
            cart.subTotal = cart.subTotal + (cart.items[index].price * productQty)
            cart.quantity = cart.quantity + productQty
            cart.items[index] = {
              total: cart.items[index].price * (cart.items[index].productQty + productQty),
              price: cart.items[index].price,
              image: cart.items[index].image,
              name: cart.items[index].name,
              productQty: cart.items[index].productQty + productQty,
              productId: cart.items[index].productId
            }
            cart.save()
              .then(cart => res.send(cart))
            break
          case 'REDUCE_FROM_CART':
            if (cart.items[index].productQty - productQty > 0) {
              cart.total = cart.total - ((cart.items[index].price * productQty) + (cart.items[index].price * productQty) * .075)
              cart.subTotal = cart.subTotal - (cart.items[index].price * productQty)
              cart.quantity = cart.quantity - productQty
              cart.items[index] = {
                total: cart.items[index].price * (cart.items[index].productQty - productQty),
                price: cart.items[index].price,
                image: cart.items[index].image,
                name: cart.items[index].name,
                productQty: cart.items[index].productQty - productQty,
                productId: cart.items[index].productId
              }
              cart.save()
                .then(cart => res.send(cart))
            } else {
              cart.total = cart.total - ((cart.items[index].price * productQty) + (cart.items[index].price * productQty) * .075)
              cart.subTotal = cart.subTotal - (cart.items[index].price * productQty)
              cart.quantity = cart.quantity - productQty
              cart.items = cart.items.filter(item =>
                item.productId.toHexString() !== productId
              )
              cart.save()
                .then(cart => res.send(cart))
            }

            break
          case 'REMOVE_FROM_CART':
            console.log(productQty)
            cart.total = cart.total - ((cart.items[index].price * cart.items[index].productQty) + ((cart.items[index].price * cart.items[index].productQty) * .075))
            cart.subTotal = cart.subTotal - (cart.items[index].price * cart.items[index].productQty)
            cart.quantity = cart.quantity - cart.items[index].productQty
            cart.items = cart.items.filter(item =>
              item.productId.toHexString() !== productId
            )
            console.log(cart)
            cart.save()
              .catch(err => console.log(err))
              .then(cart => res.send(cart))
            break
          default:
            return cart
        }
      } else {
        Product.findOne({ _id: productId })
          .then(pro => {
            cart.total = cart.total + ((pro.values.price * productQty) + (pro.values.price * productQty) * .075)
            cart.subTotal = cart.subTotal + (pro.values.price * productQty)
            cart.quantity = cart.quantity + productQty
            const item = {
              productId,
              productQty,
              image: pro.image,
              name: pro.values.name,
              price: pro.values.price,
              total: pro.values.price * productQty
            }
            cart.items.push(item)
            cart.save()
              .then(cart => res.send(cart))
          })
      }
  })
    .catch((err) => {
      console.log(err)
      res.status(400).send(err)
    })
})



// Delete
carts.delete('/:_id', (req, res) => {
  const _id = req.params._id
  if (!ObjectID.isValid(_id)) {
    return res.status(404).send()
  }
  Cart.findOneAndRemove({ _id,})
    .then((cart) => res.send(cart))
    .catch((err) => res.status(400).send(err))
})




export default carts
