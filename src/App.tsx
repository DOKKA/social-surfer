import React from 'react';
import './App.css';
import { Menu } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import Windowtest from './components/WindowTest';
type MyState = {
  count: number;
  windows: Array<string>;
};

let items = [{
  "text": "Item1",
  "items": [{ "text": "Item1.1" }, { "text": "Item1.2", "items": [{ "text": "Item1.2.1" }, { "text": "Item1.2.2" }] }]
}, {
  "text": "Item2",
  "items": [{ "text": "Item2.1" }, { "text": "Item2.2" }, { "text": "Item2.3" }]
}, {
  "text": "Item3"
}];

class App extends React.Component {
state: MyState = {
  windows: [],
count: 0
};

  render(){
    let asdf = this.state.windows.map((win)=>{
      return (<Windowtest key={win}>{win}</Windowtest>);
    });
    return (
      <div className="outer">
      
      <Menu items={items} style={{backgroundColor: '#f0f0f0'}} />
      
      <div className='main'>
      <Button style={{margin: '20px'}} themeColor={"primary"}  onClick={() => this.increment(1)}>Button {this.state.count}</Button>
      {asdf}

      </div>
      <footer style={{ textAlign: 'center' }}>Social Surfer ©2022 Created by DOKKA</footer>
    </div>
    );
  }

  increment = (amt: number) => {
    // like this
    this.setState((state) => ({
      count: this.state.count + amt,
      windows: [...this.state.windows, 'new value '+this.state.count.toString()]
    }));
  };



}

export default App;
