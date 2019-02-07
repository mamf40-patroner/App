import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ViewPager } from 'rn-viewpager';
import Map from './Map';
import OverlaySlider from './OverlaySlider';
import SearchForm from './SearchForm';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Map />
        <OverlaySlider>
          <ViewPager style={styles.pager}>
            <View key="1">
              <SearchForm />
            </View>

            <View key="2">
              <Text>SEARCH RESULTS</Text>
            </View>
          </ViewPager>
        </OverlaySlider>
      </View>
    );
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
  }
});
