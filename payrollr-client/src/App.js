import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Report from './report';
import { getPayrollReport, upload } from './api';

class App extends Component {
  state = {
    payrollData: []
  };

  componentDidMount() {
    return getPayrollReport().then(payrollData =>
      this.setState({ payrollData })
    );
  }

  handleFileChange = e => {
    return upload(e.target.files[0]).then(payrollData => {
      if (payrollData) {
        this.setState({ payrollData });
      }
    });
  };

  render() {
    return (
      <div className="App">
        <div className="App-body">
          <img src={logo} className="App-logo" alt="logo" />
          <Report
            data={this.state.payrollData}
            handleFileChange={this.handleFileChange}
          />
        </div>
      </div>
    );
  }
}

export default App;
