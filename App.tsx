import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Accelerometer, ThreeAxisMeasurement } from "expo-sensors";
import { Audio } from "expo-av";

export default function App() {
  const INTERVAL_TIME = 1000;

  const [data, setData] = useState<ThreeAxisMeasurement>({ x: 0, y: 0, z: 0 });
  const [oldData, setOldData] = useState<ThreeAxisMeasurement>({
    x: 0,
    y: 0,
    z: 0
  });
  let _subscription: any;

  useEffect(() => {
    _toggle();
  }, []);

  useEffect(() => {
    return () => {
      _unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isShake) {
      console.log("shake");
      playShakeSE();
    }
  }, [data.x, data.y, data.z]);

  const isShake = () => {
    return data.x - oldData.x > 1 || data.x - oldData.x < -1;
  };

  const playStartSE = async () => {
    const newSound = new Audio.Sound();
    await newSound.loadAsync(require("./assets/light_saber3.mp3"));
    newSound.playAsync();
  };

  const playShakeSE = async () => {
    const newSound = new Audio.Sound();
    await newSound.loadAsync(require("./assets/light_saber3.mp3"));
    newSound.playAsync();
  };

  const _toggle = () => {
    if (_subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const _subscribe = () => {
    _subscription = Accelerometer.addListener(accelerometerData => {
      Accelerometer.setUpdateInterval(INTERVAL_TIME);
      setData(accelerometerData);
      setOldData(data);
    });
  };

  const _unsubscribe = () => {
    _subscription && _subscription.remove();
    _subscription = null;
  };

  return (
    <View style={styles.sensor}>
      <Text style={styles.text}>
        x: {round(data.x)} y: {round(data.y)} z: {round(data.z)}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={_toggle} style={styles.button}>
          <Text>Toggle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function round(n: any) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 15
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10
  },
  sensor: {
    marginTop: 45,
    paddingHorizontal: 10
  },
  text: {
    textAlign: "center"
  }
});
