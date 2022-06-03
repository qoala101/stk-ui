import React from "react";

import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import Theme from "highcharts/themes/dark-green";

import {PriceTick} from "../Types";
import {BalanceTick} from "../Types";

Theme(Highcharts);

type Props = {
  price_ticks: PriceTick[];
  balance_ticks: BalanceTick[];
};

class MainChart extends React.Component<Props> {
  render() {
    let options: Highcharts.Options = {
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
          data: this.props.price_ticks.map((item: PriceTick) => [
            item.time,
            item.buy_price,
          ]),
        },
        {
          type: "line",
          name: "Sell Price",
          data: this.props.price_ticks.map((item: PriceTick) => [
            item.time,
            item.sell_price,
          ]),
        },
        {
          type: "line",
          name: "Base Balance",
          data: this.props.balance_ticks.map((item: BalanceTick) => [
            item.time,
            0,
          ]),
          yAxis: 1,
        },
        {
          type: "line",
          name: "Quote Balance",
          data: this.props.balance_ticks.map((item: BalanceTick) => [
            item.time,
            item.quote_balance,
          ]),
          yAxis: 1,
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
