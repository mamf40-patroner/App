import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getCurrentLocation } from '../api';

export default class Map extends React.Component {
  constructor(props) {
    super(props)
    this.map = React.createRef();
    this.state = {
      location: null,
      error: null,
    }
  }

  async componentDidMount() {
    const location = await getCurrentLocation();
    this.setState({ location });
    setInterval(this._getLocation.bind(this), 500);
  }

  async updateLocation() {
    const location = await getCurrentLocation();
    this.setState({ location });
  }

  focusBoundingBox = ([topLeft, bottomRight]) => {
    latitudeDelta = Math.abs(topLeft.latitude - bottomRight.latitude) / 2;
    longitudeDelta = Math.abs(topLeft.longitude - bottomRight.longitude) / 2;

    this.map.current.animateToRegion({
      latitude: topLeft.latitude + latitudeDelta,
      longitude: topLeft.longitude + longitudeDelta,
      latitudeDelta,
      longitudeDelta,
    })
  }

  render() {
    const { location } = this.state;

    return (
      <MapView
        style={StyleSheet.absoluteFillObject}
        onMapReady={this.props.onMapReady}
        ref={this.map}
      >
        {this.props.route && (
          <Polyline
            coordinates={this.props.route}
            strokeColor="#000"
            strokeWidth={6}
          />
        )}
        {location && (
          <Marker
            coordinate={location}
            title={"Nuvarande position"}
          />
        )}
        {this.props.pois.map((poi) => (
          <Marker
            coordinate={poi.geometry.map(([longitude, latitude]) => ({ longitude, latitude }))}
            title={poi.feature_properties.osm_tags.name}
          />
        ))}
      </MapView>
    );
  }
}
