import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { AD_CONFIG } from '../config/adConfig';

const MyBannerAd = () => {
  const adUnitId = __DEV__
    ? TestIds.BANNER // Google Test ID
    : Platform.select({
        ios: AD_CONFIG.bannerAdId.ios,
        android: AD_CONFIG.bannerAdId.android,
      });

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          console.log('✅ Banner Ad loaded');
        }}
        onAdFailedToLoad={(error) => {
          console.error('❌ Banner Ad failed to load:', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    // marginVertical: 10,
    backgroundColor: '#fff',
  },
});

export default MyBannerAd;