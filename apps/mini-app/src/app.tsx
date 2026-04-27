import { Component } from 'react';
import './app.css';

class App extends Component {
  componentDidMount() {
    if (typeof wx !== 'undefined') {
      console.log('Taro Todo Mini Program is running');
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return this.props.children;
  }
}

export default App;
