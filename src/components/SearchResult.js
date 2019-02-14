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
              avatarStyle={styles.avatarStyle}
              containerStyle={{ backgroundColor: '#00754b' }}
              contentContainerStyle={{ backgroundColor: '#00754b' }}
              key={item.name}
              leftAvatar={{ uri: item.avatar_url }}
              onPress={this.props.onSelect.bind(null, item)}
              rightTitle={item.distance}
              subtitle={item.subtitle}
              subtitleStyle={{ color: 'white' }}
              title={item.name}
              titleStyle={{ color: 'white' }}
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
