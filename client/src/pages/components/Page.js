import React from 'react'
import { connect } from 'react-redux'

import PageHero from './PageHero'
import PageCard from './PageCard'

const Page = ({ isFetching, components, hero, cards }) => {
  console.log(isFetching)
  return (
    !isFetching ?
    <div>
      {hero ? <PageHero key={hero._id} {...hero} /> : null }
      <section>
        {cards ? cards.map(card => <PageCard key={card._id} {...card} />) : null }
      </section>
    </div>
    :
    null
  )
}

const mapStateToProps = (state, ownProps) => {
  if (!state.pages.isFetching) {
    const page = ownProps.params.slug ? ownProps.params.slug : 'home'
    const components = state.pages.items.find(p => p.slug === page).components
    const hero = components.find(c => c.type === 'hero')
    const cards = components.filter(c => c.type === 'card')
    console.log(cards.map(card => card._id))
    console.log(cards)
    return {
      isFetching: state.pages.isFetching,
      components,
      hero,
      cards
    }
  }
  return {}
}

export default connect(mapStateToProps)(Page)
