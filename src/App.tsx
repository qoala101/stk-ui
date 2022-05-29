import * as React from "react";
import MainChart from "./charts/MainChart";
import getPublicUrlFromAws from "./aws/Aws"

type State = {
  public_url?: string;
};

class App extends React.Component<{}, State> {
  state: State = {
    public_url: undefined
  }

  componentDidMount() {
    var that = this
    getPublicUrlFromAws(function (public_url?: string) {
      that.onGetPublicUrlFromAws(public_url)
    });
  }

  onGetPublicUrlFromAws(public_url?: string) {
    this.setState({ public_url: public_url });
  }

  render() {
    if (this.state.public_url) {
      return (
        <div>
          <MainChart />
        </div>
      );
    }

    return (
      <div>
        Cannot get public URL
      </div>
    );
  }
}

export default App;