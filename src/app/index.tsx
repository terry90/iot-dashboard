import React, { PureComponent } from 'react';
import withRoot from '../withRoot';
import { Line } from 'react-chartjs-2';
import { BASE_URL } from '../../.env';

class Index extends PureComponent {
  state = {
    data: [],
    loading: true
  };

  getScaleTicks = (arr, factor = 0.5) => {
    const minValue = Math.min(...arr);
    const maxValue = Math.max(...arr);

    return (maxValue - minValue) * factor;
  };

  chartOptions = datasets => ({
    tooltips: {
      mode: 'index',
      intersect: false
    },
    hover: {
      mode: 'index',
      intersect: false
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'day'
          },
          distribution: 'linear'
        }
      ],
      yAxes: [
        {
          ticks: {
            min:
              Math.min(...datasets[0].data.concat(datasets[1].data)) -
              this.getScaleTicks(datasets[0].data.concat(datasets[1].data)),
            max:
              Math.max(...datasets[0].data.concat(datasets[1].data)) +
              this.getScaleTicks(datasets[0].data.concat(datasets[1].data))
          },
          type: 'linear',
          display: true,
          position: 'left',
          id: 'temp'
        },
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'hum',
          ticks: {
            min:
              Math.min(...datasets[2].data) -
              this.getScaleTicks(datasets[2].data),
            max:
              Math.max(...datasets[2].data) +
              this.getScaleTicks(datasets[2].data)
          },
          gridLines: {
            drawOnChartArea: false
          }
        }
      ]
    }
  });

  async componentWillMount() {
    const response = await fetch(`${BASE_URL}/iot_datas`);
    const data = await response.json();
    console.log(data);
    this.setState({ loading: false, data });
  }

  getDatasets = (
    dataX: {
      temperature: number;
      humidity: number;
      heat_index: number;
      created_at: string;
    }[]
  ) => {
    const datasets: any = [];
    const data = dataX;

    datasets.push({
      label: 'Temperature',
      yAxisID: 'temp',
      pointRadius: 0,
      borderColor: '#FF867C',
      backgroundColor: '#FF867C',
      data: data.map(d => d.temperature),
      fill: false
    });
    datasets.push({
      label: 'Heat index',
      yAxisID: 'temp',
      pointRadius: 0,
      borderColor: '#77A0AC',
      backgroundColor: '#77A0AC',
      data: data.map(d => d.heat_index),
      fill: false
    });
    datasets.push({
      label: 'Humidity',
      yAxisID: 'hum',
      pointRadius: 0,
      borderColor: '#65D1F1',
      backgroundColor: '#65D1F1',
      data: data.map(d => d.humidity),
      fill: false
    });

    const res = {
      datasets,
      labels: data.map(d => {
        const da = new Date(d.created_at);
        const resw = da.getTime() + da.getTimezoneOffset() * 60000;
        return new Date(resw + 3600000 * 4);
      })
    };

    return res;
  };

  render() {
    const rawData = this.state.data;
    const data = rawData.map((d: any) => ({
      ...JSON.parse(d.value),
      created_at: d.created_at
    }));
    const datasets = this.getDatasets(data);
    return (
      <div className="App">
        <Line data={datasets} options={this.chartOptions(datasets.datasets)} />>
      </div>
    );
  }
}

export default withRoot(Index);
