import React, { Component } from 'react';
import { View, Text, DeviceEventEmitter } from 'react-native';
import { KeepAwake } from 'expo';
import { Accelerometer } from 'expo';

class GeolocationExample extends Component {
    constructor(props) {
        super(props);

        this.state = {
            oldLatitude: null,
            oldLongitude: null,
            oldSpeed: null,
            latitude: null,
            longitude: null,
            speed: null,
            counter: 0,
            acc: {
                x: null,
                y: null,
                z: null
            },
            error: null,
        };
    }

    mpsToMph(meters) {
        const MILES_PER_METER = 0.000621371;
        return (meters * MILES_PER_METER) * 60 * 60;
    }

    checkSpeeding(mph) {
        return mph > 45;
    }

    componentDidMount() {
        this._subscribe();
    }

    _subscribe = () => {
        // When invoked, the listener is provided a single argument that is an object containing keys x, y, z.
        this._subscription = Accelerometer.addListener((accelerometerData) => {
            this.setState({ acc: accelerometerData });
        });
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    getDistance() {
        let R = 6371000;
        let la1 = this.state.oldLatitude * Math.PI/180;
        let la2 = this.state.latitude * Math.PI/180;
        let lo1 = this.state.oldLongitude * Math.PI/180;
        let lo2 = this.state.longitude * Math.PI/180;
        let tmp1 = Math.sin((la1-la2)/2)*Math.sin((la1-la2)/2) + Math.cos(la1)*Math.cos(la2) * Math.sin((lo1-lo2)/2) * Math.sin((lo1-lo2)/2);
        let tmp2 = Math.sqrt(tmp1);
        let d = Math.abs(2 * R * Math.asin(tmp2) * 100000) / 100000;
        this.setState({
            speed: d
        });

        return d;
    }

    tick() {
        /*navigator.geolocation.getCurrentPosition(
            (position) => {
                //if (position.coords.speed !== 0) {
                    /*this.setState({
                        oldLatitude: this.state.latitude,
                        oldLongitude: this.state.longitude,
                        oldSpeed: this.state.speed,
                        error: null,
                    });
                    this.setState({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        speed: position.coords.speed,
                        error: null,
                    });
                //}
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
            //this.getDistance()
        );*/
        this.setState({counter: this.state.counter + 1})
        console.log(this.state)
    }

    render() {
        return (
            <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Counter: {this.state.counter}</Text>
                {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
                <Text>x: {this.state.acc.x}</Text>
                <Text>y: {this.state.acc.y}</Text>
                <Text>z: {this.state.acc.z}</Text>
            </View>
        );
    }
}

export default GeolocationExample;