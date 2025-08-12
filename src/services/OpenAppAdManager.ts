
// import { Platform, AppState, AppStateStatus } from 'react-native';
// import {
//   AppOpenAd,
//   AdEventType,
//   TestIds,
// } from 'react-native-google-mobile-ads';
// import { AD_CONFIG } from '../config/adConfig';

// class OpenAppAdManager {
//   private appOpenAd: AppOpenAd | null = null;
//   private isLoadingAd = false;
//   private isShowingAd = false;
//   private adLoaded = false;
//   private loadTime = 0;
//   private appState: AppStateStatus = 'active';

//   constructor() {
//     this.loadAd(); // ✅ Start loading ad at init
//     this.setupAppStateListener(); // ✅ Setup listener for app state changes
//   }

//   private getAdUnitId(): string {
//     return Platform.OS === 'ios'
//       ? AD_CONFIG.openAppAdId.ios
//       : AD_CONFIG.openAppAdId.android;
//   }

//   private setupAppStateListener() {
//     AppState.addEventListener('change', this.handleAppStateChange);
//   }

//   private handleAppStateChange = (nextAppState: AppStateStatus) => {
//     if (this.appState === 'background' && nextAppState === 'active') {
//       // ✅ Delay ad show to allow time for resume transition
//       setTimeout(() => {
//         this.showAdIfAvailable();
//       }, 1000);
//     }
//     this.appState = nextAppState;
//   };

//   private loadAd = () => {
//     if (this.isLoadingAd || this.isAdAvailable()) {
//       return;
//     }

//     this.isLoadingAd = true;

//     this.appOpenAd = AppOpenAd.createForAdRequest(this.getAdUnitId(), {
//       requestNonPersonalizedAdsOnly: false,
//     });

//     this.appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
//       console.log('✅ Open app ad loaded');
//       this.isLoadingAd = false;
//       this.adLoaded = true;
//       this.loadTime = Date.now();
//     });

//     this.appOpenAd.addAdEventListener(AdEventType.ERROR, (error) => {
//       console.error('❌ Open app ad failed to load:', error);
//       this.isLoadingAd = false;
//       this.adLoaded = false;

//       // Retry loading after a delay
//       setTimeout(() => {
//         this.loadAd();
//       }, 10000); // 10 seconds
//     });

//     this.appOpenAd.addAdEventListener(AdEventType.OPENED, () => {
//       console.log('📢 Open app ad opened');
//       this.isShowingAd = true;
//     });

//     this.appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
//       console.log('📪 Open app ad closed');
//       this.isShowingAd = false;
//       this.appOpenAd = null;
//       this.adLoaded = false;
//       this.loadAd(); // Prepare the next ad
//     });

//     this.appOpenAd.load();
//   };

//   private isAdAvailable(): boolean {
//     return (
//       this.appOpenAd !== null &&
//       this.adLoaded &&
//       this.wasLoadTimeLessThanNHoursAgo(4)
//     );
//   }

//   private wasLoadTimeLessThanNHoursAgo(numHours: number): boolean {
//     const dateDifference = Date.now() - this.loadTime;
//     const numMillisecondsPerHour = 3600000;
//     return dateDifference < numMillisecondsPerHour * numHours;
//   }

//   public showAdIfAvailable = (onAdDismissed?: () => void) => {
//     if (!this.isAdAvailable() || this.isShowingAd) {
//       console.log('⚠️ Open app ad is not ready or already showing');
//       onAdDismissed?.();
//       return;
//     }

//     try {
//       this.appOpenAd?.addAdEventListener(AdEventType.CLOSED, () => {
//         onAdDismissed?.();
//       });

//       this.appOpenAd?.show();
//     } catch (error) {
//       console.error('❌ Failed to show app open ad:', error);
//       onAdDismissed?.();
//     }
//   };

//   public destroy() {
//     AppState.removeEventListener('change', this.handleAppStateChange);
//     this.appOpenAd = null;
//     this.adLoaded = false;
//   }
// }

// // Singleton export
// export const openAppAdManager = new OpenAppAdManager();


// services/OpenAppAdManager
import { Platform, AppState, AppStateStatus } from 'react-native';
import {
  AppOpenAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { AD_CONFIG } from '../config/adConfig';

class OpenAppAdManager {
  private appOpenAd: AppOpenAd | null = null;
  private isLoadingAd = false;
  private isShowingAd = false;
  private adLoaded = false;
  private loadTime = 0;
  private appState: AppStateStatus = 'active';
  private appStateSubscription: any;

  constructor() {
    this.loadAd(); // ✅ Start loading ad at init
    this.setupAppStateListener(); // ✅ Setup listener for app state changes
  }

  private getAdUnitId(): string {
    return Platform.OS === 'ios'
      ? AD_CONFIG.openAppAdId.ios
      : AD_CONFIG.openAppAdId.android;
  }

  private setupAppStateListener() {
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange
    );
  }

  private handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (this.appState === 'background' && nextAppState === 'active') {
      // ✅ Delay ad show to allow time for resume transition
      setTimeout(() => {
        this.showAdIfAvailable();
      }, 1000);
    }
    this.appState = nextAppState;
  };

  private loadAd = () => {
    if (this.isLoadingAd || this.isAdAvailable()) {
      return;
    }

    this.isLoadingAd = true;

    this.appOpenAd = AppOpenAd.createForAdRequest(this.getAdUnitId(), {
      requestNonPersonalizedAdsOnly: false,
    });

    this.appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
      console.log('✅ Open app ad loaded');
      this.isLoadingAd = false;
      this.adLoaded = true;
      this.loadTime = Date.now();
    });

    this.appOpenAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('❌ Open app ad failed to load:', error);
      this.isLoadingAd = false;
      this.adLoaded = false;

      // Retry loading after a delay
      setTimeout(() => {
        this.loadAd();
      }, 10000); // 10 seconds
    });

    this.appOpenAd.addAdEventListener(AdEventType.OPENED, () => {
      console.log('📢 Open app ad opened');
      this.isShowingAd = true;
    });

    this.appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('📪 Open app ad closed');
      this.isShowingAd = false;
      this.appOpenAd = null;
      this.adLoaded = false;
      this.loadAd(); // Prepare the next ad
    });

    this.appOpenAd.load();
  };

  private isAdAvailable(): boolean {
    return (
      this.appOpenAd !== null &&
      this.adLoaded &&
      this.wasLoadTimeLessThanNHoursAgo(4)
    );
  }

  private wasLoadTimeLessThanNHoursAgo(numHours: number): boolean {
    const dateDifference = Date.now() - this.loadTime;
    const numMillisecondsPerHour = 3600000;
    return dateDifference < numMillisecondsPerHour * numHours;
  }

  public showAdIfAvailable = (onAdDismissed?: () => void) => {
    if (!this.isAdAvailable() || this.isShowingAd) {
      console.log('⚠️ Open app ad is not ready or already showing');
      onAdDismissed?.();
      return;
    }

    try {
      this.appOpenAd?.addAdEventListener(AdEventType.CLOSED, () => {
        onAdDismissed?.();
      });

      this.appOpenAd?.show();
    } catch (error) {
      console.error('❌ Failed to show app open ad:', error);
      onAdDismissed?.();
    }
  };

  public destroy() {
    this.appStateSubscription?.remove();
    this.appOpenAd = null;
    this.adLoaded = false;
  }
}

// Singleton export
export const openAppAdManager = new OpenAppAdManager();
