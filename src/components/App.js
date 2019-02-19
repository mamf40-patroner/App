import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ViewPager } from 'rn-viewpager';
import Map from './Map';
import OverlaySlider from './OverlaySlider';
import SearchResult from './SearchResult';
import SearchForm from './SearchForm';
import { SplashScreen } from 'expo';
import { categories } from '../constants';

export default class App extends React.Component {
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
              <SearchForm items={categories} />
            </View>

            <View key="2">
              <SearchResult
                items={mockItems}
                onSelect={this.handleActivitySelect.bind(this)}
              />
            </View>
          </ViewPager>
        </OverlaySlider>
      </View>
    );
  }

  handleActivitySelect(item) {
    console.log(item);
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
