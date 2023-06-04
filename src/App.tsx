/**
 * STK-UI {@link https://github.com/qoala101/stk_ui}
 * @author Volodymyr Hromakov <4y5t6r@gmail.com>
 * @copyright Copyright (c) 2023, MIT License
 */

import * as React from "react";

import { Button, Col, Layout, Row, Select } from "antd";
import "antd/dist/reset.css";
import { Content, Footer, Header } from "antd/lib/layout/layout";

import queryString from "query-string";

import getPublicUrlFromAws from "./aws/Aws";
import { SymbolPriceRecord } from "./Types";
import MainChart from "./charts/MainChart";

type State = {
  app_uri: string;
  symbols: Array<string>;
  price_records: Array<SymbolPriceRecord>;
};

class App extends React.Component<{}, State> {
  state: State = {
    app_uri: "",
    symbols: [],
    price_records: [],
  };

  update_interval_ms: number = 1000;
  update_timer!: NodeJS.Timer;

  componentDidMount() {
    getPublicUrlFromAws((app_uri?: string) => this.onGetAppUriFromAws(app_uri));
  }

  componentWillUnmount() {
    clearInterval(this.update_timer);
  }

  onGetAppUriFromAws(app_uri?: string) {
    if (app_uri === undefined) {
      console.error("Couldn't get app URI");
      return;
    }

    this.setAppUri(app_uri);
  }

  setAppUri(app_uri: string) {
    this.setState({ app_uri: app_uri }, () => this.onAppUriSet());
  }

  onAppUriSet() {
    fetch(this.state.app_uri + "/symbols_db/SelectSymbolsWithPriceRecords")
      .then(
        (response) => response.json(),
        (error) => console.error(error)
      )
      .then(
        (json) => this.setSymbols(json),
        (error) => console.error(error)
      );
  }

  setSymbols(symbols: Array<string>) {
    this.setState({ symbols: symbols }, () => this.fetchNewPriceRecords());
  }

  fetchNewPriceRecords() {
    let start_time = undefined;

    if (this.state.price_records.length > 0) {
      start_time =
        this.state.price_records[this.state.price_records.length - 1].time;
    }

    fetch(
      this.state.app_uri +
        "/symbols_db/SelectSymbolPriceRecords?" +
        queryString.stringify({
          symbol: this.state.symbols[0],
          order: "kOldFirst",
          start_time: start_time,
          limit: 100,
        })
    )
      .then(
        (response) => response.json(),
        (error) => console.error(error)
      )
      .then(
        (json) => this.appendNewPriceRecords(json),
        (error) => console.error(error)
      );
  }

  appendNewPriceRecords(new_price_records: Array<SymbolPriceRecord>) {
    this.setState(
      {
        price_records: this.state.price_records.concat(new_price_records),
      },
      () => this.onNewPriceRecordsAppended()
    );
  }

  onNewPriceRecordsAppended() {
    this.update_timer = setInterval(() => {
      clearInterval(this.update_timer);
      this.fetchNewPriceRecords();
    }, this.update_interval_ms);
  }

  onRunClicked() {}

  render() {
    return (
      <Layout>
        <Header></Header>
        <Content>
          <MainChart price_records={this.state.price_records} />
        </Content>
        <Footer>
          <Row justify="start">
            <Col span={4}>
              <Select
                showSearch
                style={{ width: "100%" }}
                options={this.state.symbols.map((item: string) => ({
                  label: item,
                  value: item,
                }))}
                placeholder="Symbol"
              />
            </Col>
            <Col span={1} />
            <Col span={4}>
              <Button type="primary" onClick={() => this.onRunClicked()}>
                Run
              </Button>
            </Col>
          </Row>
        </Footer>
      </Layout>
    );
  }
}

export default App;
