import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default class Map extends React.Component {
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(pos => {
      this.setState({ location: pos.coords });
    });
  }

  render() {
    const { location } = this.state;

    return (
      <MapView style={StyleSheet.absoluteFillObject} onMapReady={this.props.onMapReady}>
        {location && (
          <Marker
            coordinate={location}
            title={"That's you dawg"}
            description={'Does u need 2 knowz?'}
          />
        )}
      </MapView>
    );
  }
}
