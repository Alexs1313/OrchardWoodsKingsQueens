import React, { useEffect, useRef } from 'react';
import { View, Image, ScrollView, ImageBackground } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  OnboardScreen: undefined;
};

const loaderHTML = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  html, body {
    margin: 0;
    padding: 0;
    background: transparent;
  }

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .loader {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 200px;
    height: 15px;
    background-color: rgb(2, 2, 17);
    border-radius: 10px;
    overflow: hidden;
    position: relative;
  }

  .shape {
    width: 50px;
    height: 15px;
    background-image: linear-gradient(144deg, #AF40FF, #5B42F3 50%, #00DDEB);
    border-radius: 25px;
    position: absolute;
    animation: slide 1.9s linear infinite;
    background-size: 200%;
  }

  @keyframes slide {
    0% { left: 0; }
    50% { left: calc(100% - 50px); }
    100% { left: 0; }
  }
</style>
</head>

<body>
  <div class="container">
    <div class="loader">
      <div class="shape"></div>
    </div>
  </div>
</body>
</html>
`;

const Loader: React.FC = () => {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      try {
        nav.navigate('OnboardScreen');
        console.log('nav!');
      } catch (err) {
        try {
          nav.navigate('OnboardScreen');
        } catch (err2) {
          console.error('failed', err2);
        }
      }
    }, 6000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [nav]);

  return (
    <ImageBackground
      source={require('../../assets/images/loaderbackground.png')}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: 650,
          }}
        >
          <Image
            source={require('../../assets/images/loaderimg.png')}
            style={{ width: 250, height: 250 }}
          />
        </View>

        <View style={{ position: 'absolute', bottom: 40, alignSelf: 'center' }}>
          <WebView
            originWhitelist={['*']}
            source={{ html: loaderHTML }}
            style={{ width: 360, height: 10, backgroundColor: 'transparent' }}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Loader;
