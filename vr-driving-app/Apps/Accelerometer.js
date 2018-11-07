import React from 'react';
import io from 'socket.io-client';
import { Accelerometer } from 'expo';

export default class RaiseHand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accelerometerData: {},
      handRaised: false,
    };

    this.socket = io();
    this.getInQueue = this.getInQueue.bind(this);
    this.sendSocket = this.debounce(this.sendSocket.bind(this), 2000);
  }

  componentDidMount() {
    this._subscribe();
  }

  componentWillUnmount() {
    this.setState({ handRaise: false });
    this._unsubscribe();
    this.socket.close();
  }

  getInQueue() {
    const { y } = this.state.accelerometerData;
    if (y > 0.7) {
      this.setState({ handRaised: true });
      this.sendSocket();
    }
  }

  sendSocket() {
    this.socket.emit('raise-hand', {
      student: this.props.state.user.First_name,
      time: Date.now(),
    });
  }

  _subscribe = () => {
    // When invoked, the listener is provided a single argumument that is an object containing keys x, y, z.
    this._subscription = Accelerometer.addListener(accelerometerData => {
      this.setState({ accelerometerData });
      this.getInQueue();
    });
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };
}