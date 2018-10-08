import React, { PureComponent } from 'react';
import { Line } from 'react-chartjs-2';
import ChartTooltip from '../ChartTooltip';

const DATASET_NAMES = ['Temperature', 'Humidity', 'Heat index'];
const MAX_ELEMS = 150;

class EnvSensorChart extends PureComponent<Props> {
  chart: any;
  state = {
    data: [],
    loading: true,
    tooltip: { xAlign: 'left', dataPoints: [], labelColors: [] },
    tooltipPosition: { top: 0, left: 0 }
  };

  getScaleTicks = (arr, factor = 0.5) => {
    const minValue = Math.min(...arr);
    const maxValue = Math.max(...arr);

    return (maxValue - minValue) * factor;
  };

  showTooltip = tooltip => {
    let tooltipPosition: { top: number; left: number };

    if (this.chart && this.chart.chartInstance) {
      const position = this.chart.chartInstance.canvas.getBoundingClientRect();

      const left = position.left + tooltip.caretX;
      const top = position.top + tooltip.caretY;

      tooltipPosition = { top, left };
    } else {
      tooltipPosition = { top: 0, left: 0 };
    }

    if (tooltip.opacity === 0) {
      this.setState({
        showTooltip: false,
        tooltip: undefined
      });
    } else {
      this.setState({
        showTooltip: true,
        tooltip,
        tooltipPosition
      });
    }
  };

  chartOptions = datasets => ({
    tooltips: {
      mode: 'index',
      intersect: false,
      enabled: false,
      custom: this.showTooltip
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
            unit: 'hour'
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

  getDatasets = (
    dataX: {
      temperature: number;
      humidity: number;
      heat_index: number;
      created_at: string;
    }[]
  ) => {
    const datasets: any = [];
    const data = dataX.slice(Math.max(dataX.length - MAX_ELEMS, 1));

    datasets.push({
      label: 'Temperature',
      yAxisID: 'temp',
      pointRadius: 0,
      borderWidth: 1.5,
      borderColor: '#8884d8',
      backgroundColor: '#8884d8',
      data: data.map(d => d.temperature),
      fill: false
    });
    datasets.push({
      label: 'Heat index',
      yAxisID: 'temp',
      pointRadius: 0,
      borderWidth: 1.5,
      borderColor: '#77A0AC',
      backgroundColor: '#77A0AC',
      data: data.map(d => d.heat_index),
      fill: false
    });
    datasets.push({
      label: 'Humidity',
      yAxisID: 'hum',
      pointRadius: 0,
      borderWidth: 1.5,
      borderColor: '#82ca9d',
      backgroundColor: '#82ca9d',
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
    const rawData = this.props.data;
    const data = rawData.map((d: any) => ({
      ...JSON.parse(d.value),
      created_at: d.created_at
    }));
    const datasets = this.getDatasets(data);
    return (
      <div className="EnvSensorChart">
        <Line
          ref={ref => (this.chart = ref)}
          data={datasets}
          options={this.chartOptions(datasets.datasets)}
        />
        {this.state.tooltip && (
          <ChartTooltip
            datasetNames={DATASET_NAMES}
            tooltip={this.state.tooltip}
            position={this.state.tooltipPosition}
          />
        )}
      </div>
    );
  }
}

export default EnvSensorChart;

interface Props {
  data: any;
}
