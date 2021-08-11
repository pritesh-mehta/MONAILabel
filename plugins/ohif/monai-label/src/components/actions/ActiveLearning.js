import React from 'react';

import './OptionTable.styl';
import BaseTab from './BaseTab';

export default class OptionTable extends BaseTab {
  constructor(props) {
    super(props);
    this.state = {
      strategy: 'random',
    };
  }

  onChangeStrategy = evt => {
    this.setState({ strategy: evt.target.value });
  };

  onClickNextSample = async () => {
    if (
      !window.confirm(
        'This action will reload current page.  Are you sure to continue?'
      )
    ) {
      return;
    }

    const response = await this.props.client().next_sample(this.state.strategy);
    if (response.status !== 200) {
      this.notification.show({
        title: 'MONAI Label',
        message: 'Failed to Fetch Next Sample',
        type: 'error',
        duration: 5000,
      });
    } else {
      window.location.pathname = '/viewer/' + response.data['id'];
    }
  };
  onClickUpdateModel = () => {};
  onClickSubmitLabel = () => {};

  render() {
    const ds = this.props.info.datastore;
    const completed = ds && ds.completed ? ds.completed : 0;
    const total = ds && ds.total ? ds.total : 1;
    const activelearning = Math.round(100 * (completed / total)) + '%';
    const activelearningTip = completed + '/' + total + ' samples annotated';

    const ts = this.props.info.train_stats;
    const epochs = ts && ts.total_time ? (ts.epoch ? ts.epoch : 1) : 0;
    const total_epochs = ts && ts.total_epochs ? ts.total_epochs : 1;
    const training = Math.round(100 * (epochs / total_epochs)) + '%';
    const trainingTip = epochs
      ? epochs + '/' + total_epochs + ' epochs completed'
      : 'Not Running';

    const accuracy =
      ts && ts.best_metric ? Math.round(100 * ts.best_metric) + '%' : '0%';
    const accuracyTip =
      ts && ts.best_metric
        ? accuracy + ' is current best metric'
        : 'not determined';

    const strategies = this.props.info.strategies
      ? this.props.info.strategies
      : {};

    return (
      <div className="tab">
        <input
          className="tab-switch"
          type="checkbox"
          id={this.tabId}
          name="activelearning"
          value="activelearning"
          defaultChecked
        />
        <label className="tab-label" htmlFor={this.tabId}>
          Active Learning
        </label>
        <div className="tab-content">
          <table style={{ fontSize: 'smaller', width: '100%' }}>
            <tbody>
              <tr>
                <td>
                  <button
                    className="actionInput"
                    onClick={this.onClickNextSample}
                  >
                    Next Sample
                  </button>
                </td>
                <td>
                  <button
                    className="actionInput"
                    onClick={this.onClickUpdateModel}
                  >
                    Update Model
                  </button>
                </td>
                <td>&nbsp;</td>
                <td>
                  <button
                    className="actionInput"
                    onClick={this.onClickSubmitLabel}
                  >
                    Submit Label
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <br />

          <table className="actionInput">
            <tbody>
              <tr>
                <td>Strategy:</td>
                <td width="80%">
                  <select
                    className="actionInput"
                    onChange={this.onChangeStrategy}
                    value={this.state.strategy}
                  >
                    {Object.keys(strategies).map(a => (
                      <option key={a} name={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>Annotated:</td>
                <td width="80%" title={activelearningTip}>
                  <div className="w3-round w3-light-grey w3-tiny">
                    <div
                      className="w3-round w3-container w3-blue w3-center"
                      style={{ width: activelearning }}
                    >
                      {activelearning}
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Training:</td>
                <td title={trainingTip}>
                  <div className="w3-round w3-light-grey w3-tiny">
                    <div
                      className="w3-round w3-container w3-orange w3-center"
                      style={{ width: training }}
                    >
                      {training}
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Accuracy:</td>
                <td title={accuracyTip}>
                  <div className="w3-round w3-light-grey w3-tiny">
                    <div
                      className="w3-round w3-container w3-green w3-center"
                      style={{ width: accuracy }}
                    >
                      {accuracy}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
