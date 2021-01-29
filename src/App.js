import React, {Component} from 'react';
import './App.css';
import lottery from './lottery';
import  web3 from './web3';
class App extends Component {

  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  }

  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({manager,players, balance});
  }

  onSubmit = async (event)=> {
    event.preventDefault();
    
    const accounts = await web3.eth.getAccounts();

    this.setState({
      message: 'Waiting on transaction success'
    })

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    })

    this.setState({
      message: "You've been entered"
    })

  }

  onClick = async () =>{
    const accounts = await web3.eth.getAccounts();

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })
    this.setState({message: 'A winner has been picked'});
  }
  render(){
  
    return(
      <div>
        <h1>Lottery Contract</h1>
        <p>This Contract is managed by {this.state.manager}</p>
        <p>There are {this.state.players.length} number of people competing</p>
        <p> To win {web3.utils.fromWei(this.state.balance,'ether')} Ether!</p>

      <hr/>

      <form onSubmit={this.onSubmit}>
        <h4> Want to try your luck</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input value = {this.state.value} onChange = {event => this.setState({value: event.target.value})}/>
          
        </div>
        <button>Enter</button>
      </form>

      <hr/>

      <div>
        <p>Ready to pick a Winner?</p>
        <button onClick={this.onClick}>Pick a Winner!</button>
      </div>

      <hr/>

      <div>
        <p>{this.state.message}</p>
      </div>
      </div>
    )
  }

  
}

export default App;
