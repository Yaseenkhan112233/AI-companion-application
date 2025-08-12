// import React, { useEffect } from 'react';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { AppNavigator } from './src/navigation';
// import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

// import { AD_CONFIG } from './src/config/adConfig';
// const App = () => {


//   useEffect(() => {
//     initializeAds();
//   }, []);

//   const initializeAds = async () => {
//     try {
//       await mobileAds().initialize();
      
//       // Configure ads settings
//       await mobileAds().setRequestConfiguration({
//         maxAdContentRating: MaxAdContentRating.PG,
//         tagForChildDirectedTreatment: false,
//         tagForUnderAgeOfConsent: false,
//         testDeviceIdentifiers: AD_CONFIG.testDeviceIds,
//       });

//       console.log('AdMob initialized successfully');
//     } catch (error) {
//       console.error('Failed to initialize AdMob:', error);
//     }
//   };
//   return (
//     <SafeAreaProvider>
//       <AppNavigator />
//     </SafeAreaProvider>
//   );
// };

// export default App;



// App.tsx
import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import { openAppAdManager } from './src/services/OpenAppAdManager';
import { AD_CONFIG } from './src/config/adConfig';

const App = () => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    initializeAds();

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  const initializeAds = async () => {
    try {
      await mobileAds().initialize();
      await mobileAds().setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
        testDeviceIdentifiers: AD_CONFIG.testDeviceIds,
      });

      // Preload open app ad here
      await openAppAdManager.loadAd();

      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
    }
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    const prevAppState = appState.current;
    appState.current = nextAppState;

    if (prevAppState.match(/inactive|background/) && nextAppState === 'active') {
      // App just came to foreground
      openAppAdManager.showAdIfAvailable(() => {
        console.log('Open App Ad dismissed on foreground');
      });
    }
  };

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
};

export default App;
