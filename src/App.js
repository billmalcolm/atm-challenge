import React from 'react';

import Thanks from './Components/Thanks';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    // setting up initial state
    this.state = {
      bills: {
        100: 10,
        50: 10,
        20: 10,
        10: 10,
        5: 10,
        1: 10
      },
      input: '',
      output: '',
      isActive: true
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleCommand = this.handleCommand.bind(this);

    this.restock = this.restock.bind(this);
    this.withdraw = this.withdraw.bind(this);
    this.inquire = this.inquire.bind(this);
    this.quit = this.quit.bind(this);

  }

  handleChange(event) { // making sure we capture user input
    this.setState({ input: event.target.value })
  }

  handleCommand(event) { // processes command
    let input = this.state.input;
    // Still want to accept input in case user doesn't enter command in uppercase
    let commandType = input.charAt(0).toUpperCase();
    let dollarVal = parseInt(input.substr(2));

    switch (commandType) {
      case 'W':
        this.withdraw(dollarVal);
        break;
      case 'R':
        this.restock();
        break;
      case 'I':
        this.inquire(dollarVal);
        break;
      case 'Q':
        this.quit();
        break;
      default:
        this.setState({ output: 'Invalid Command' })

    }

    this.setState({ input: '' });
    event.preventDefault();
  }

  restock() {
    this.setState({
      bills: {
        100: 10,
        50: 10,
        20: 10,
        10: 10,
        5: 10,
        1: 10
      },
      input: '',
      output: 'Success: Machine has been restocked'
    })
  }

  withdraw(amt) {
    let leftover = amt;
    // Starting up string for output if request is successfull
    let receipt = `Success: Dispensed $${amt}: `;
    let bills = this.state.bills;
    let newInventory = {}

    // Turning object into an array. Order of insertion is important, so need to reverse the order of the array
    Object.entries(bills).reverse().forEach(([key, value]) => {
      // See how many denominations can fit into the requested amount
      let requestedDenom = Math.floor(leftover / key);
      // Is there enough larger bills?
      if (value >= requestedDenom) {
        newInventory.key = key - requestedDenom;
        leftover = leftover - requestedDenom * key;
        // I'm not thrilled about how the output is formatted, but don't want to take up too much time on nice-to-haves
        receipt += `  $${key} - ${requestedDenom}  | `
      } else {
        // if we don't have enough large bills, 
        leftover = leftover - value * 100;
        receipt += `$${key} - ${value}`;
        newInventory.hundreds = 0;
      }
    });

    // If there is still money leftover to fulfill, we know the request failed
    if (leftover !== 0) {
      receipt = "Failure: insufficient funds";
      newInventory = this.state.bills
    }

    // Update the existing inventory and output for user
    this.setState({
      bills: newInventory,
      output: receipt
    })

  }

  inquire(denom) {

    let bills = this.state.bills;
    let quantity = 0;

    // Integers aren't great for object property names, but I made them work
    switch (denom) {
      case 100:
        quantity = bills['100'];
        break;
      case 50:
        quantity = bills['50'];
        break;
      case 20:
        quantity = bills['20'];
        break;
      case 10:
        quantity = bills['10'];
        break;
      case 5:
        quantity = bills['5'];
        break;
      case 1:
        quantity = bills['1'];
        break;
      default:
        quantity = 'invalid denomination'
    }

    // In case user command is malformed, check to make sure integer was captured. If it wasn't quantity will be a message
    let output = (isNaN(quantity)) ? quantity : quantity + ' $' + denom + ' bills';

    this.setState({ output: output })
  }

  quit() {
    this.setState({ isActive: false })
  }

  render() {
    // if user quit application, thank you screen will show
    if (!this.state.isActive) {
      return <Thanks />
    } else {

      return (
        <div className="App">
          <h1>ATM Machine Coding Challenge</h1>
          <h2>Command List</h2>
          <ul>
            <li>R - Restock</li>
            <li>W$[dollar amount] - Withdraw amount</li>
            <li>I$&lt;denominations&gt; Display number of bills in denomination</li>
            <li>Q - Quit</li>
          </ul>

          <form onSubmit={this.handleCommand}>
            <label>Enter command</label>
            <input type="text" value={this.state.input} onChange={this.handleChange} />
            <input type="submit" value="Submit" />
          </form>

          <div className="output">
            {this.state.output}
          </div>
        </div >
      );
    }
  }
}

export default App;
