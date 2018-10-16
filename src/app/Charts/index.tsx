import React, { PureComponent } from 'react';
import EnvSensorChart from '../components/EnvSensorChart';
import './Charts.css';

export default class Charts extends PureComponent<Props> {
  render() {
    return (
      <div className="Charts">
        {this.props.data.map((thing: Thing) => (
          <EnvSensorChart key={thing.id} data={thing} />
        ))}
      </div>
    );
  }
}

interface Props {
  data: Thing[];
}
