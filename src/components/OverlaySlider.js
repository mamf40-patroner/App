import React from 'react';
import {
  View,
  Animated,
  Dimensions,
  PanResponder,
  ImageBackground,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

var yChange = 0;
var press = true;
const minHeight = 0;
const backDropColor = '#02744B';
const maxHeight = Dimensions.get('window').height - 83;

export default class OverlaySlider extends React.Component {
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
        if (change < startpoint - 10 || change > startpoint + 10) {
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
          if (gestureState.vy < -0.5) {
            yChange -= 200;
            if (yChange < minHeight) yChange = minHeight;
            this.move(yChange, 200);
          } else if (gestureState.vy > 0.5) {
            yChange += 200;
            if (yChange > maxHeight) yChange = maxHeight;
            this.move(yChange, 200);
          }
          startpoint = yChange;
        }
        press = true;
      },
    });
  }


  move = (target, speed) => {
    Animated.timing(this.state.heightA, {
      toValue: target,
      duration: speed,
    }).start();
  };

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
        >
          {this.props.children}
        </View>

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
          <FontAwesome
            name="navicon"
            size={32}
            color="white"
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
          <FontAwesome
            name="location-arrow"
            size={32}
            color="green"
            style={{
              width: '75%',
              height: '80%',
              alignSelf: 'center',
              top: '10%',
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
          <FontAwesome
            name="cog"
            size={32}
            color="green"
            style={{
              borderRadius: 100,
              alignSelf: 'center',
              top: '7.5%',
            }}
          />
        </View>
      </Animated.View>
    );
  }
}
