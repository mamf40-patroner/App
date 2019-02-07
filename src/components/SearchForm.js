import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  CheckBox,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';

export default class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.stateCB = { data: ['Skog', 'Strand', 'Stad'], checked: 0 };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.block}>
          <View style={styles.row}>
            <Text> Från: </Text>

            <TextInput
              style={styles.textfield}
              underlineColorAndroid="transparent"
              onChangeText={text => this.setState({ text })}
              startPos={this.state.text}
            />
          </View>

          <View style={styles.row}>
            <Text>Ruttlängd: </Text>

            <TextInput
              style={styles.textfield}
              onChangeText={text => this.setState({ text })}
            />
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.block}>
          <View style={styles.row}>
            <Text>Omgivning: </Text>
          </View>
        </View>

        <View style={styles.block}>
          {this.stateCB.data.map((data, key) => {
            return (
              <View key={data}>
                {this.stateCB.checked == key ? (
                  <TouchableOpacity style={styles.btn}>
                    <Image
                      style={styles.img}
                      source={{
                        uri:
                          'https://d30y9cdsu7xlg0.cloudfront.net/png/868143-200.png',
                      }}
                    />
                    <Text>{data}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      this.state.setState({ checked: key });
                    }}
                    style={styles.btn}
                  >
                    <Image
                      style={styles.img}
                      source={{
                        uri:
                          'https://d30y9cdsu7xlg0.cloudfront.net/png/868142-200.png',
                      }}
                    />
                    <Text>{data}</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.separator} />

        <View style={styles.block}>
          <View style={styles.row}>
            <Text>Aktiviteter: </Text>

            <TextInput
              style={styles.textfield}
              onChangeText={text => this.setState({ text })}
              startPos={this.state.text}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'column' }}>
          <View style={{ flexDirection: 'row' }}>
            <CheckBox
              value={this.state.checked}
              onValueChange={checked =>
                this.setState({ checked: !this.state.checked })
              }
              distance={this.setState}
            />
            <Text style={{ marginTop: 5 }}>Undvik trafik</Text>

            <CheckBox
              value={this.state.checked}
              onValueChange={() =>
                this.setState({ checked: !this.state.checked })
              }
            />
            <Text style={{ marginTop: 5 }}>Undvik grusvägar</Text>

            <CheckBox
              value={this.state.checked}
              onValueChange={() =>
                this.setState({ checked: !this.state.checked })
              }
            />
            <Text style={{ marginTop: 5 }}>Undvik backar</Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <CheckBox
              value={this.state.checked}
              onValueChange={() =>
                this.setState({ checked: !this.state.checked })
              }
            />
            <Text style={{ marginTop: 5 }}>Bad</Text>

            <CheckBox
              value={this.state.checked}
              onValueChange={() =>
                this.setState({ checked: !this.state.checked })
              }
            />
            <Text style={{ marginTop: 5 }}>Café</Text>

            <CheckBox
              value={this.state.checked}
              onValueChange={() =>
                this.setState({ checked: !this.state.checked })
              }
            />
            <Text style={{ marginTop: 5 }}>Max</Text>

            <CheckBox
              value={this.state.checked}
              onValueChange={() =>
                this.setState({ checked: !this.state.checked })
              }
            />
            <Text style={{ marginTop: 5 }}>Annat</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00754b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#00754b',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 5,
  },
  textfield: {
    height: 40,
    width: 200,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  separator: {
    backgroundColor: '#044229',
    width: 400,
    height: 7,
  },
  block: {
    padding: 10,
    justifyContent: 'center',
  },
  img: {
    height: 30,
    resizeMode: 'contain',
    marginRight: 5,
  },
  btn: {
    marginLeft: 5,
  },
});
