import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getCurrentLocation } from '../api';
import { coordsArrayToObject } from '../util';

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
    setInterval(this.updateLocation.bind(this), 500);
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
            key={String(poi.properties.osm_id)}
            coordinate={coordsArrayToObject(poi.geometry.coordinates)}
            title={poi.properties.osm_tags.name}
          />
        ))}
      </MapView>
    );
  }
}
