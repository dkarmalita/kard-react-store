import React, { Component } from 'react'

export function DataStore(initialState={}, getters){

  const observers = []
  let state = {}

  const invokeObservers = (state) => {
    observers.forEach( observer => observer(state) )
  }

  const store = {

    subscribe: (observer) => {
      observers.push(observer)
    },

    unSubscribe: (observer) => {
      const foundIdx = observers.some((x, idx)=>{
        if(x == observer){
          observers.splice(idx, 1)
          return true
        }
        return false
      })
    },

    setState: (update) => {
      state = {...state, ...update}
      if(getters){
        Object.keys(getters).forEach(
          value => state[value] = getters[value](state)
        )
      }
      invokeObservers(state)
    },

    getState: () => ({...state}),
  }

  store.setState(initialState)

  this.store = store

  this.connect = (mapStateToProps) => (WrappedComponent) =>
    class extends React.Component {

      constructor(props){
        super(props)
        this.observer = () => this.forceUpdate()
        store.subscribe(this.observer)
      }

      componentWillUnmount(){
        store.unSubscribe(this.observer)
      }

      render() {
        const { getState, setState } = store;
        const state = getState()
        const props = mapStateToProps
          ? mapStateToProps({
            state,
            setState,
            getState,
            props: this.props,
          })
          : {...this.props, store}
        return <WrappedComponent {...props} />
      }
    }
}
