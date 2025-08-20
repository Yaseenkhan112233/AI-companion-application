



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
//       await mobileAds().setRequestConfiguration({
//         maxAdContentRating: MaxAdContentRating.PG,
//         tagForChildDirectedTreatment: false,
//         tagForUnderAgeOfConsent: false,
//         testDeviceIdentifiers: AD_CONFIG.testDeviceIds,
//       });

//       console.log('✅ AdMob initialized successfully');
//     } catch (error) {
//       console.error('❌ Failed to initialize AdMob:', error);
//     }
//   };

//   return (
//     <SafeAreaProvider>
//       <AppNavigator />
//     </SafeAreaProvider>
//   );
// };

// export default App;


import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';
import { AuthProvider } from './src/contexts/AuthContext'; // Add this import
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import { AD_CONFIG } from './src/config/adConfig';

const App = () => {
  useEffect(() => {
    initializeAds();
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

      console.log('✅ AdMob initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize AdMob:', error);
    }
  };

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;