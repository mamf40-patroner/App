import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getCurrentLocation } from '../api';

export default class Map extends React.Component {
  constructor(props) {
    super(props)
    this.state = { location: null }
  }

  async componentDidMount() {
    const location = await getCurrentLocation();
    this.setState({ location })
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
