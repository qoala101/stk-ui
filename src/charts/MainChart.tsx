import React from "react";

import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import Theme from "highcharts/themes/dark-green";

import { SymbolPriceRecord } from "../Types";

Theme(Highcharts);

type Props = {
  price_records: Array<SymbolPriceRecord>;
};

class MainChart extends React.Component<Props> {
  chart_ref?: HighchartsReact.RefObject;
  update_interval_ms: number = 1000;
  update_timer!: NodeJS.Timer;

  componentDidMount() {
    this.update_timer = setInterval(
      () => this.onUpdate(),
      this.update_interval_ms
    );
  }

  componentWillUnmount() {
    clearInterval(this.update_timer);
  }

  shouldComponentUpdate(nextProps: Props) {
    return false;
  }

  onUpdate() {
    this.chart_ref?.chart.series[0].setData(
      this.props.price_records.map((item: SymbolPriceRecord) => [
        item.time,
        item.buy_price,
      ]),
      false
    );

    this.chart_ref?.chart.series[1].setData(
      this.props.price_records.map((item: SymbolPriceRecord) => [
        item.time,
        item.sell_price,
      ]),
      false
    );

    this.chart_ref?.chart.redraw();
  }

  render() {
    let options: Highcharts.Options = {
      credits: {
        enabled: false,
      },

      exporting: {
        enabled: false,
      },

      rangeSelector: {
        buttons: [
          {
            count: 10,
            type: "minute",
            text: "10M",
          },
          {
            count: 30,
            type: "minute",
            text: "30M",
          },
          {
            type: "all",
            text: "All",
          },
        ],
        selected: 2,
      },

      yAxis: [
        {
          title: { text: "Price" },
          height: "60%",
        },
        {
          title: { text: "Balance" },
          top: "65%",
          height: "35%",
          offset: 0,
        },
      ],

      tooltip: {
        valueDecimals: 5,
      },

      series: [
        {
          type: "line",
          name: "Buy Price",
        },
        {
          type: "line",
          name: "Sell Price",
        },
      ],
    };

    return (
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"stockChart"}
          options={options}
          ref={(chart_ref: HighchartsReact.RefObject) =>
            (this.chart_ref = chart_ref)
          }
        />
      </div>
    );
  }
}

export default MainChart;
