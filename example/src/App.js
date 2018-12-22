import React, { Component } from 'react';
import { DataStore } from '@kard/react-store';

const { connect, store } = new DataStore(
  { // initial state
    employeesList: [
      { name: "John Doe", salary: 150 },
      { name: "Richard Roe", salary: 225 },
    ],
  },
  { // pure getters
    totalSum: (state) => {
      let sum = 0
      state.employeesList.map(e => sum = sum + e.salary)
      return sum
    },
    highEarnersCount: (state) => {
      return state.employeesList.filter(e => e.salary > 500).length
    },
  }
)

const stateLogger = state=>console.log('RS >> updated state',{state})

store.subscribe(stateLogger)

const mapStateToProps = ({state, props, setState, getState}) => {
  return {
    store: {
      ...state,

      clearList: () =>
        setState({ employeesList: [] }),

      pushEmployee: (e) =>
        setState({ employeesList: [...state.employeesList, e] }),
    }
  }
}

const Row = (props) => {
  return (<tr>
    <td>{props.data.name}</td>
    <td>{props.data.salary}</td>
  </tr>)
}

@connect(mapStateToProps)
class Table extends Component {
  render() {
    const { store } = this.props
    return (<div>
      <table>
        <thead>
          <tr>
            <td>Name:</td>
            <td>Daily salary:</td>
          </tr>
        </thead>
        <tbody>
          {store.employeesList.map((e, i) =>
            <Row
              key={i}
              data={e}
            />
          )}
        </tbody>
        <tfoot>
          <tr>
            <td>TOTAL:</td>
            <td>{store.totalSum}</td>
          </tr>
        </tfoot>
      </table>
      <div className="fade">
        You have <u>{store.highEarnersCount} team members </u>that earn more that 500$/day.
      </div>
    </div>)
  }
}

@connect(mapStateToProps)
class Controls extends Component {
  addEmployee = () => {
    const name = prompt("The name:")
    const salary = parseInt(prompt("The salary:"), 10)
    if(isNaN(salary)){ return }
    this.props.store.pushEmployee({ name, salary })
  }

  clearList = () => {
    this.props.store.clearList()
  }

  render() {
    return (
      <div className="controls">
        <button onClick={this.clearList}>clear table</button>
        <button onClick={this.addEmployee}>add record</button>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <h1>Mobx Table</h1>
        <Controls/>
        <Table/>
      </div>
    )
  }
}

export default App;
