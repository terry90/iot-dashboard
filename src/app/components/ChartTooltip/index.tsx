import React, { PureComponent } from 'react';
import './ChartTooltip.css';

class ChartTooltip extends PureComponent<Props> {
  render() {
    if (this.props.tooltip.dataPoints.length === 0) {
      return <div />;
    }

    console.log(this.props.tooltip);

    const date = new Date(this.props.tooltip.dataPoints[0].xLabel);
    var options = {
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric'
    };
    const title = date.toLocaleDateString('en-US', options);

    const colors = this.props.tooltip.labelColors.map(c => c.backgroundColor);
    return (
      <div
        style={{
          position: 'absolute',
          top: this.props.position.top,
          left: this.props.position.left
        }}
        className={`ChartTooltip ChartTooltip__xAlign--${
          this.props.tooltip.xAlign
        }`}
      >
        <span className="ChartTooltip__title">{title}</span>
        {this.props.tooltip.dataPoints.map((v, i) => (
          <div
            className="ChartTooltip__elem"
            key={`${this.props.datasetNames[v.datasetIndex]}:${v.yLabel}`}
          >
            <span
              className="ChartTooltip__color"
              style={{ backgroundColor: colors[i] }}
            />
            <span className="ChartTooltip__type">
              {this.props.datasetNames[v.datasetIndex]}
            </span>
            <span className="ChartTooltip__value">{v.yLabel.toFixed(2)}</span>
          </div>
        ))}
      </div>
    );
  }
}

export default ChartTooltip;

interface Props {
  position: { top: number; left: number };
  tooltip: {
    xAlign: string;
    dataPoints: { datasetIndex: number; yLabel: number; xLabel: string }[];
    labelColors: { backgroundColor: string }[];
  };
  datasetNames: string[];
}
