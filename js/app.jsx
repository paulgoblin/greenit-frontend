import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './components/Navbar.jsx';
import Main from './components/Main.jsx';
import '../css/sweetalert.css';
import '../css/google.css';
import '../css/style.css';

class App extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <div className="container">
          <Main />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('React'));
