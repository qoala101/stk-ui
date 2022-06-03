import * as React from "react";

import { Layout, Select, Row, Col, Button } from "antd";
import { Header, Content, Footer } from "antd/lib/layout/layout";

import getPublicUrlFromAws from "./aws/Aws";
import { PriceTick } from "./Types";
import { BalanceTick } from "./Types";
import MainChart from "./charts/MainChart";

import "antd/dist/antd.dark.min.css";

type State = {
  public_url?: string;
  symbols: string[];
  strategies: string[];
  price_ticks: PriceTick[];
  balance_ticks: BalanceTick[];

  current_symbol: string;
  current_strategy: string;
};

class App extends React.Component<{}, State> {
  state: State = {
    public_url: undefined,
    symbols: [],
    strategies: [],
    price_ticks: [],
    balance_ticks: [],

    current_symbol: "",
    current_strategy: "",
  };

  componentDidMount(): void {
    getPublicUrlFromAws((public_url?: string) =>
      this.onGetPublicUrlFromAws(public_url)
    );
    // this.onGetPublicUrlFromAws("http://localhost:6507");
  }

  onGetPublicUrlFromAws(public_url?: string): void {
    this.setState({ public_url: public_url }, () => {
      fetch(this.state.public_url + "/Info/GetSymbols")
        .then((response: Response) => response.json())
        .then(
          (json: any) => this.setState({ symbols: json }),
          (error: any) => console.error(error)
        );

      fetch(this.state.public_url + "/Info/GetStrategyNames")
        .then((response: Response) => response.json())
        .then(
          (json: any) => this.setState({ strategies: json }),
          (error: any) => console.error(error)
        );
    });
  }

  onSymbolSelected(symbol: string): void {
    fetch(this.state.public_url + '/Info/GetPriceTicks?symbol="' + symbol + '"')
      .then((response: Response) => response.json())
      .then(
        (json: any) =>
          this.setState({ current_symbol: symbol, price_ticks: json }),
        (error: any) => console.error(error)
      );
  }

  onStrategySelected(strategy: string): void {
    this.setState({ current_strategy: strategy });
  }

  isRunEnabled(): boolean {
    return (
      this.state.current_strategy.length > 0 &&
      this.state.current_symbol.length > 0
    );
  }

  onRunClicked(): void {
    fetch(
      this.state.public_url + "/" +
        this.state.current_strategy +
        '/Run?symbol="' +
        this.state.current_symbol +
        '"'
    )
      .then((response: Response) => response.json())
      .then(
        (json: any) => this.setState({ balance_ticks: json }),
        (error: any) => console.error(error)
      );
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
                // defaultValue={0}
                onChange={(value: string) => this.onSymbolSelected(value)}
              />
            </Col>
            <Col span={1} />
            <Col span={4}>
              <Select
                showSearch
                style={{ width: "100%" }}
                options={this.state.strategies.map((item: string) => ({
                  label: item,
                  value: item,
                }))}
                placeholder="Strategy"
                onChange={(value: string) => this.onStrategySelected(value)}
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
            price_ticks={this.state.price_ticks}
            balance_ticks={this.state.balance_ticks}
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
