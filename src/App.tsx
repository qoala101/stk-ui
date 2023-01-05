import * as React from "react";

import { Layout, Select, Row, Col, Button } from "antd";
import { Header, Content, Footer } from "antd/lib/layout/layout";

import getPublicUrlFromAws from "./aws/Aws";
import { PriceRecord } from "./Types";
import { BalanceRecord } from "./Types";
import MainChart from "./charts/MainChart";

import "antd/dist/antd.dark.min.css";

type State = {
  public_url: string;
  symbols: string[];
  price_records: PriceRecord[];
  balance_records: BalanceRecord[];

  current_symbol: string;
};

class App extends React.Component<{}, State> {
  state: State = {
    public_url: "",
    symbols: [],
    price_records: [],
    balance_records: [],

    current_symbol: "",
  };

  componentDidMount(): void {
    // getPublicUrlFromAws((public_url?: string) =>
    //   this.onGetPublicUrlFromAws(public_url)
    // );
    this.onGetPublicUrlFromAws("http://localhost");
  }

  onGetPublicUrlFromAws(public_url: string): void {
    this.setState({ public_url: public_url }, () => {
      fetch(this.state.public_url + "/symbol_price_streams/GetStreamedSymbols")
        .then((response: Response) => response.json())
        .then(
          (json: any) => this.setState({ symbols: json }),
          (error: any) => console.error(error)
        );
    });
  }

  onSymbolSelected(symbol: string): void {
    this.setState({ current_symbol: symbol });

    fetch(
      this.state.public_url +
        "/symbols_db/SelectSymbolPriceRecords?limit=100&symbol=" +
        symbol
    )
      .then((response: Response) => response.json())
      .then(
        (json: any) => this.setState({ price_records: json }),
        (error: any) => console.error(error)
      );
  }

  isRunEnabled(): boolean {
    return this.state.current_symbol.length > 0;
  }

  onRunClicked(): void {
    this.setState({ price_records: [] });
  }

  render(): JSX.Element {
    return (
      <Layout>
        <Header>
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
                onChange={(value: string) => this.onSymbolSelected(value)}
              />
            </Col>
            <Col span={1} />
            <Col span={4}>
              <Button
                type="primary"
                disabled={!this.isRunEnabled()}
                onClick={() => this.onRunClicked()}
              >
                Run
              </Button>
            </Col>
          </Row>
        </Header>
        <Content>
          <MainChart
            price_records={this.state.price_records}
            balance_records={this.state.balance_records}
          />
        </Content>
        <Footer>
          <Button
            type="primary"
            disabled={!this.isRunEnabled()}
            onClick={() => this.onRunClicked()}
          >
            Run
          </Button>
        </Footer>
      </Layout>
    );
  }
}

export default App;
