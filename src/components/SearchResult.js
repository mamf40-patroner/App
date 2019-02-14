import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';

export default class SearchResult extends React.Component {
  constructor(props) {
    super(props);

    const { items } = props;
    this.state = { items };
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.state.items.map((item) => (
            <ListItem
              containerStyle={{ backgroundColor: '#00754b' }}
              contentContainerStyle={{ backgroundColor: '#00754b' }}
              avatarStyle={styles.avatarStyle}
              titleStyle={{ color: 'white' }}
              subtitleStyle={{ color: 'white' }}
              leftAvatar={{ uri: item.avatar_url }}
              key={item.name}
              title={item.name}
              subtitle={item.subtitle}
              rightTitle={item.distance}
            />
          ))
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00754b',
  },
  avatarStyle: {
    color: 'transparent',
  },
});
