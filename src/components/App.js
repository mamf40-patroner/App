import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ViewPager } from 'rn-viewpager';
import Map from './Map';
import OverlaySlider from './OverlaySlider';
import SearchResult from './SearchResult';
import SearchForm from './SearchForm';
import { SplashScreen } from 'expo';
import { categories } from '../constants';
import { getCurrentLocation, getPois } from '../api';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      query: null,
    }
  }

  componentDidMount() {
    SplashScreen.preventAutoHide();
  }

  render() {
    return (
      <View style={styles.container}>
        <Map onMapReady = {() => SplashScreen.hide()} />
        <OverlaySlider>
          <ViewPager style={styles.pager}>
            <View key="1">
              <SearchForm
                items={categories}
                onSubmit={this.handleSearchQuery.bind(this)}
              />
            </View>

            <View key="2">
              <SearchResult
                items={mockItems}
                onSelect={this.handleActivitySelect.bind(this)}
              />
            </View>
          </ViewPager>
          {this.state.loading && <ActivityIndicator style={styles.loader} />}
        </OverlaySlider>
      </View>
    );
  }

  async handleActivitySelect(item) {
    console.log(item);
  }

  async handleSearchQuery({ categories }) {
    this.setState({ loading: true });
    try {
      const coords = await getCurrentLocation();
      const pois = await getPois(coords, categories.map(({ id }) => id));
      const namedPois = pois.filter(poi => !!poi.properties.osm_tags.name);
      console.log(namedPois);
    } catch (ex) {
      console.log("Failed to find POIs", ex);
    } finally {
      this.setState({ loading: false });
    }
  }
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

const mockItems = [
  {
    name: 'Max',
    avatar_url: 'https://image.shutterstock.com/image-vector/chef-logo-restaurant-symbol-vector-260nw-334673846.jpg',
    subtitle: 'Restaurang',
    distance: '500m'
  },
  {
    name: 'Saltbadet',
    avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmbSe7gXHIQAhfZUmn_YX7geLM51M-t1w2aOQTzWKyy3bNnJIn',
    subtitle: 'Bad',
    distance: '700m'
  },
]
