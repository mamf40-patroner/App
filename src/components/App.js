import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import R from 'ramda';
import Map from './Map';
import OverlaySlider from './OverlaySlider';
import SearchResult from './SearchResult';
import SearchForm from './SearchForm';
import { categories } from '../constants';
import { coordsArrayToObject } from '../util';
import { getCurrentLocation, getPois, getDirections } from '../api';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.slider = React.createRef();
    this.map = React.createRef();

    this.selectedOrigin = null;
    this.state = {
      route: null,
      availablePois: [],
      selectedPois: [],
      isLoading: false,
    }
  }

  componentDidMount() {
    SplashScreen.preventAutoHide();
  }

  renderBody() {
    return this.state.availablePois.length > 0 ? (
      <SearchResult
        items={this.state.availablePois[0]}
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
          route={this.state.route}
          pois={this.state.selectedPois}
          onMapReady={() => SplashScreen.hide()}
        />
        <OverlaySlider ref={this.slider}>
          {this.renderBody()}
          {this.state.isLoading && <ActivityIndicator style={styles.loader} />}
        </OverlaySlider>
      </View>
    );
  }

  async handleActivitySelect(poi) {
    await this.setStateAsync({
      selectedPois: [...this.state.selectedPois, poi],
      availablePois: this.state.availablePois.slice(1),
    });

    if (this.state.availablePois.length !== 0) {
      return;
    }

    const path = [
      this.selectedOrigin,
      ...this.state.selectedPois.map(p => {
        const [longitude, latitude] = p.geometry.coordinates;
        return { longitude, latitude };
      }),
      this.selectedOrigin,
    ];

    this.setState({ isLoading: true });
    try {
      const directions = await getDirections(path);

      const [firstRoute] = directions.routes;
      const bbox = R.splitEvery(2, firstRoute.bbox).map(coordsArrayToObject);
      const route = firstRoute.geometry.map(coordsArrayToObject);

      await this.setStateAsync({ route });

      this.map.current.focusBoundingBox(bbox);
      this.slider.current.moveDown();
    } catch (ex) {
      console.log("Failed to retrieve directions", ex, Object.keys(ex));
    } finally {
      this.setState({ isLoading: false });
    }
  }

  async handleSearchQuery({ categories }) {
    this.setState({ isLoading: true });
    try {
      const coords = await getCurrentLocation();
      const pois = await Promise.all(categories.map(({ id }) => getPois(coords, [id])));
      const namedPois = pois.map(l => l.filter(poi => !!poi.properties.osm_tags.name));

      this.selectedOrigin = coords;
      this.setState({ availablePois: namedPois });
    } catch (ex) {
      console.log("Failed to find POIs", ex, Object.keys(ex));
    } finally {
      this.setState({ isLoading: false });
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
