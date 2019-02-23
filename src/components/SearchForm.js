import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableHighlight,
  Image,
} from 'react-native';
import { Button } from 'react-native-elements';
import ModalSelector from 'react-native-modal-selector';
import R from 'ramda';

export default class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.idCounter = 0;
    this.state = {
      origin: null,
      selectedCategory: null,
      selectedSubcategory: null,
      addedCategories: [],
    };
  }

  deleteCategoryByKey = (keyToRemove) => {
    this.setState({
      addedCategories: this.state.addedCategories.filter(({ key }) => key != keyToRemove)
    });
  }

  addCategory = (category) => {
    this.setState({
      addedCategories: [
        ...this.state.addedCategories,
        { ...category, key: String(++this.idCounter) },
      ]
    });
  }

  onSubmit = () => {
    const { origin, addedCategories } = this.state;
    this.props.onSubmit({ origin, categories: addedCategories });
  }

  render() {
    const isValidForm = this.state.addedCategories.length > 0 && this.state.origin !== null;
    const activeSubcategories = this.state.selectedCategory !== null
      ? this.props.items.find((category) => this.state.selectedCategory === category).subcategories
      : [];

    return (
      <View style={styles.container}>
        <View style={styles.group}>
          <Text style={styles.label}>Utgångspunkt:</Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            onChangeText={origin => this.setState({ origin })}
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.group}>
          <Text style={styles.label}>Kategori:</Text>
          <ModalSelector
            style={styles.input}
            data={this.props.items}
            keyExtractor={R.prop('name')}
            labelExtractor={R.prop('name')}
            onChange={(selectedCategory) => this.setState({ selectedCategory })}
            initValue="Välj kategori"
          />
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Aktivitet:</Text>
          <ModalSelector
            style={styles.input}
            data={activeSubcategories}
            keyExtractor={R.prop('name')}
            labelExtractor={R.prop('name')}
            onChange={(selectedSubcategory) => this.setState({ selectedSubcategory })}
            disabled={this.state.selectedCategory === null}
            initValue="Välj underkategori"
          />
        </View>

        <Button
          title="Lägg Till"
          buttonStyle={styles.buttonAdd}
          disabled={this.state.selectedSubcategory === null}
          onPress={() => this.addCategory(this.state.selectedSubcategory)}
        />

        <FlatList
          style={styles.list}
          data={this.state.addedCategories}
          renderItem={({ item }) => (
            <TouchableHighlight onPress={() => this.deleteCategoryByKey(item.key)}>
              <Text style={styles.categoryLabel}>{item.name}</Text>
            </TouchableHighlight>
          )}
        />

        <TouchableHighlight
          onPress={this.onSubmit}
          disabled={!isValidForm}
          style={styles.submit}
        >
          <Image source={require('../../assets/cont.jpg')} />
        </TouchableHighlight>
      </View>
    );
  }

  static defaultProps = {
    onSubmit: () => { },
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: '#00754b',
    flex: 1,
    flexDirection: 'column',
  },
  group: {
    flex: 0,
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'space-between',
  },
  label: {
    flex: 1,
    alignSelf: 'center',
  },
  input: {
    flex: 2,
    height: 40,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    marginLeft: 10,
  },
  separator: {
    backgroundColor: '#044229',
    width: '100%',
    height: 3,
  },
  list: {
    borderColor: '#044229',
    borderWidth: 3,
    backgroundColor: 'white',
    flex: 1,
    margin: 10,
  },
  buttonAdd: {
    margin: 10,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#3baf5b',
  },
  categoryLabel: {
    fontSize: 22,
    margin: 5,
  },
  submit: {
    alignSelf: 'flex-end',
    margin: 10,
    marginTop: 0,
  },
});
