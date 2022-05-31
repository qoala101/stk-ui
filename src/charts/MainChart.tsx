import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import PriceTick from "../Types";

type Props = {
  price_ticks: PriceTick[];
};

class MainChart extends React.Component<Props> {
  render() {
    let options: Highcharts.Options = {
      rangeSelector: {
        selected: 4,
      },
      yAxis: {
        labels: {
          formatter: function () {
            return (this.value > 0 ? " + " : "") + this.value + "%";
          },
        },
        plotLines: [
          {
            value: 0,
            width: 2,
            color: "silver",
          },
        ],
      },
      plotOptions: {
        series: {
          compare: "percent",
          showInNavigator: true,
        },
      },
      tooltip: {
        pointFormat:
          '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
        valueDecimals: 2,
        split: true,
      },
      series: [
        {
          type: "line",
          data: this.props.price_ticks.map((item: PriceTick) => [
            item.time,
            item.buy_price,
          ]),
        },
        {
          type: "line",
          data: this.props.price_ticks.map((item: PriceTick) => [
            item.time,
            item.sell_price,
          ]),
        },
      ],
    };

    return (
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"stockChart"}
          options={options}
        />
      </div>
    );
  }
}

export default MainChart;
