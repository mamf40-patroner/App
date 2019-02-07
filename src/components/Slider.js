import React from 'react';
import {
  View,
  Animated,
  Dimensions,
  PanResponder,
  ImageBackground,
} from 'react-native';

var yChange = 0;
var press = true;
const minHeight = 0;
const backDropColor = '#02744B';
const maxHeight = Dimensions.get('window').height - 83;

export default class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.moveUp = this.moveUp.bind(this.moveUp);
    this.state = {
      heightA: new Animated.Value(maxHeight),
    };
    var startpoint = maxHeight;
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderMove: (evt, gestureState) => {
        change = gestureState.dy + startpoint;
        if (change !== startpoint) {
          press = false;
        }
        if (change > minHeight && change < maxHeight) {
          this.state.heightA.setValue(change);
          yChange = change;
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (press) {
          if (startpoint > maxHeight - 10) {
            this.moveUp();
            startpoint = minHeight;
          } else {
            this.moveDown();
            startpoint = maxHeight;
          }
        } else {
          startpoint = yChange;
        }
        press = true;
      },
    });
  }

  moveUp = () => {
    Animated.timing(this.state.heightA, {
      toValue: minHeight,
      duration: 300,
    }).start();
  };

  moveDown = () => {
    Animated.timing(this.state.heightA, {
      toValue: maxHeight,
      duration: 300,
    }).start();
  };

  render() {
    return (
      <Animated.View
        style={[
          {
            flex: 2,
            backgroundColor: 'transparent',
            width: '92%',
            left: '4%',
          },
          {
            top: this.state.heightA,
          },
        ]}
      >
        <View
          style={{
            position: 'absolute',
            backgroundColor: backDropColor,
            width: '100%',
            height: '100%',
            marginTop: '10%',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        />

        <View
          {...this._panResponder.panHandlers}
          style={{
            width: '15%',
            aspectRatio: 1,
            borderRadius: 100,
            borderWidth: 1,
            backgroundColor: backDropColor,
            borderColor: backDropColor,
            alignSelf: 'center',
          }}
        >
          <ImageBackground
            source={require("../../assets/scrollSign.jpg")}
            style={{
              width: '72%',
              height: '80%',
              borderRadius: 100,
              alignSelf: 'center',
              top: '9%',
              left: '9%',
              borderColor: backDropColor,
              borderWidth: 1,
            }}
          />
        </View>
        <View
          style={{
            width: '13%',
            aspectRatio: 1,
            borderRadius: 100,
            borderWidth: 2,
            position: 'absolute',
            backgroundColor: 'white',
            borderColor: 'white',
            top: '1%',
            left: '15%',
            borderColor: backDropColor,
          }}
        >
          <ImageBackground
            source={require('../../assets/arrowSign.jpg')}
            style={{
              width: '75%',
              height: '80%',
              alignSelf: 'center',
              left: '10%',
              top: '15%',
            }}
          />
        </View>
        <View
          style={{
            width: '13%',
            aspectRatio: 1,
            borderRadius: 100,
            borderWidth: 2,
            position: 'absolute',
            backgroundColor: 'white',
            borderColor: 'white',
            top: '1%',
            right: '15%',
            borderColor: backDropColor,
          }}
        >
          <ImageBackground
            source={require('../../assets/settingsSign.jpg')}
            style={{
              width: '80%',
              height: '80%',
              borderRadius: 100,
              alignSelf: 'center',
              left: '9%',
              top: '15%',
            }}
          />
        </View>
      </Animated.View>
    );
  }
}
