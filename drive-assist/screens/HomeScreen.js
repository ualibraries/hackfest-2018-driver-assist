import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { KeepAwake } from 'expo';

class GeolocationExample extends Component {
    constructor(props) {
        super(props);

        this.state = {
            latitude: null,
            longitude: null,
            speed: null,
            counter: 0,
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
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    speed: position.coords.speed,
                    error: null,
                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
        this.setState({counter: this.state.counter + 1})
    }

    render() {
        return (
            <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: this.checkSpeeding(this.mpsToMph(this.state.speed)) ? 'red' : 'white' }}>
                <KeepAwake />
                <Text>Latitude: {this.state.latitude}</Text>
                <Text>Longitude: {this.state.longitude}</Text>
                <Text>Speed: {this.mpsToMph(this.state.speed)}</Text>
                <Text>Counter: {this.state.counter}</Text>
                {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
            </View>
        );
    }
}

export default GeolocationExample;