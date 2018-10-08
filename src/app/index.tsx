import React, { PureComponent } from 'react';
import withRoot from '../withRoot';
import { BASE_URL } from '../.env';
import EnvSensorChart from './components/EnvSensorChart';

class Index extends PureComponent {
  state = {
    data: [],
    loading: true
  };

  async componentWillMount() {
    const response = await fetch(`${BASE_URL}/iot_datas`);
    const data = await response.json();
    console.log(data);
    this.setState({ loading: false, data });
  }

  render() {
    return (
      <div className="App">
        <EnvSensorChart data={this.state.data} />
      </div>
    );
  }
}

export default withRoot(Index);
