import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import R from 'ramda';
import Map from './Map';
import OverlaySlider from './OverlaySlider';
import SearchResult from './SearchResult';
import SearchForm from './SearchForm';
import { categories } from '../constants';
import { getCurrentLocation, getPois, getDirections } from '../api';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.slider = React.createRef();
    this.map = React.createRef();

    this.route = { origin: null, pois: [] };
    this.state = {
      polyline: null,
      loading: false,
      query: null,
      pois: [],
    }
  }

  componentDidMount() {
    SplashScreen.preventAutoHide();
  }

  renderBody() {
    return this.state.pois.length > 0 ? (
      <SearchResult
        items={this.state.pois[0]}
        onSelect={this.handleActivitySelect.bind(this)}
      />
    ) : (
      <SearchForm
        items={categories}
        onSubmit={this.handleSearchQuery.bind(this)}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Map
          ref={this.map}
          route={this.state.polyline}
          onMapReady={() => SplashScreen.hide()}
        />
        <OverlaySlider ref={this.slider}>
          {this.renderBody()}
          {this.state.loading && <ActivityIndicator style={styles.loader} />}
        </OverlaySlider>
      </View>
    );
  }

  async handleActivitySelect(poi) {
    this.route.pois.push(poi);
    await this.setStateAsync({ pois: this.state.pois.slice(1) });

    if (this.state.pois.length !== 0) {
      return;
    }

    const path = [
      this.route.origin,
      ...this.route.pois.map(p => {
        const [longitude, latitude] = p.geometry.coordinates;
        return { longitude, latitude };
      }),
      this.route.origin,
    ];

    this.setState({ loading: true });
    try {
      const directions = await getDirections(path);

      const [route] = directions.routes;
      const bbox = R.splitEvery(2, route.bbox).map(([longitude, latitude]) => ({ longitude, latitude }));
      const polyline = route.geometry.map(([longitude, latitude]) => ({ longitude, latitude }));

      await this.setStateAsync({ polyline });

      this.map.current.focusBoundingBox(bbox);
      this.slider.current.moveDown();
    } catch (ex) {
      console.log("Failed to retrieve directions", ex, Object.keys(ex));
    } finally {
      this.setState({ loading: false });
    }
  }

  async handleSearchQuery({ categories }) {
    this.setState({ loading: true });
    try {
      const coords = await getCurrentLocation();
      const pois = await Promise.all(categories.map(({ id }) => getPois(coords, [id])));
      const namedPois = pois.map(l => l.filter(poi => !!poi.properties.osm_tags.name));

      this.route.origin = coords;
      this.setState({ pois: namedPois });
    } catch (ex) {
      console.log("Failed to find POIs", ex, Object.keys(ex));
    } finally {
      this.setState({ loading: false });
    }
  }

  setStateAsync = (updater) => new Promise(resolve => this.setState(updater, resolve))
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pager: {
    flex: 1
  },
  loader: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }
});
