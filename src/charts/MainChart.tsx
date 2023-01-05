import React from "react";

import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import Theme from "highcharts/themes/dark-green";

import { PriceRecord } from "../Types";
import { BalanceRecord } from "../Types";

Theme(Highcharts);

type Props = {
  price_records: PriceRecord[];
  balance_records: BalanceRecord[];
};

class MainChart extends React.Component<Props> {
  render() {
    let options: Highcharts.Options = {
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
          data: this.props.price_records.map((item: PriceRecord) => [
            item.time,
            item.buy_price,
          ]),
        },
        {
          type: "line",
          name: "Sell Price",
          data: this.props.price_records.map((item: PriceRecord) => [
            item.time,
            item.sell_price,
          ]),
        },
        {
          type: "line",
          name: "Base Balance",
          data: this.props.balance_records.map((item: BalanceRecord) => [
            item.time,
            0,
          ]),
          yAxis: 1,
        },
        {
          type: "line",
          name: "Quote Balance",
          data: this.props.balance_records.map((item: BalanceRecord) => [
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
