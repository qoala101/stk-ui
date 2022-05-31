import * as React from "react";

import { Layout, Select, Row, Col } from "antd";
import { Header, Content } from "antd/lib/layout/layout";

import getPublicUrlFromAws from "./aws/Aws";
import PriceTick from "./Types";
import MainChart from "./charts/MainChart";

import "antd/dist/antd.css";

type State = {
  public_url?: string;
  symbols: string[];
  strategy_names: string[];
  price_ticks: PriceTick[];
};

class App extends React.Component<{}, State> {
  state: State = {
    public_url: undefined,
    symbols: [],
    strategy_names: [],
    price_ticks: [],
  };

  componentDidMount(): void {
    getPublicUrlFromAws((public_url?: string) =>
      this.onGetPublicUrlFromAws(public_url)
    );
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
          (json: any) => this.setState({ strategy_names: json }),
          (error: any) => console.error(error)
        );
    });
  }

  onSymbolSelected(symbol: string): void {
    fetch(this.state.public_url + '/Info/GetPriceTicks?symbol="' + symbol + '"')
      .then((response: Response) => response.json())
      .then(
        (json: any) => this.setState({ price_ticks: json }),
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
            <Col span={4}></Col>
          </Row>
        </Header>
        <Content>
          <MainChart price_ticks={this.state.price_ticks} />
        </Content>
      </Layout>
    );
  }
}

export default App;
