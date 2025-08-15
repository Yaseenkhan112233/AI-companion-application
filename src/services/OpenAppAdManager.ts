

// services/OpenAppAdManager
import { Platform, AppState, AppStateStatus } from 'react-native';
import {
  AppOpenAd,
  RewardedAd,
  AdEventType,
  TestIds,
  RewardedAdEventType,
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
  public disableAppOpenAd = false;
  private lastAdShowTime = 0;

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
      const now = Date.now();
      // Only show if not disabled and at least 30 seconds since last ad
      if (!this.disableAppOpenAd && now - this.lastAdShowTime > 30000) {
        // ✅ Delay ad show to allow time for resume transition
        setTimeout(() => {
          this.showAdIfAvailable();
        }, 1000);
      }
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
      this.isShowingAd = true;
      this.lastAdShowTime = Date.now();
      
      this.appOpenAd?.addAdEventListener(AdEventType.CLOSED, () => {
        this.isShowingAd = false;
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
class RewardedAdManager {
  private rewardedAd: RewardedAd | null = null;
  private isLoadingAd = false;
  private isShowingAd = false;

  constructor() {
    this.loadAd();
  }

  private getAdUnitId(): string {
    return Platform.OS === 'ios'
      ? AD_CONFIG.rewardedAdId.ios
      : AD_CONFIG.rewardedAdId.android;
  }

  private loadAd = () => {
    if (this.isLoadingAd || this.rewardedAd !== null) {
      return;
    }

    this.isLoadingAd = true;
    this.rewardedAd = RewardedAd.createForAdRequest(this.getAdUnitId(), {
      requestNonPersonalizedAdsOnly: false,
    });

    this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('✅ Rewarded ad loaded');
      this.isLoadingAd = false;
    });

    this.rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('❌ Rewarded ad failed to load:', error);
      this.isLoadingAd = false;
      this.rewardedAd = null;
      setTimeout(() => this.loadAd(), 10000); // Retry after 10 seconds
    });

    this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      console.log('💰 User earned reward:', reward);
    });

    this.rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('📪 Rewarded ad closed - disabling open app ads for 5 minutes');
      this.isShowingAd = false;
      this.rewardedAd = null;
      this.loadAd(); // Prepare next ad
      temporarilyDisableAppOpenAd(300000); // Prevent open app ads for 5 minutes
      console.log('🔴 Open app ads temporarily disabled');
    });

    this.rewardedAd.load();
  };

  public showAd = async (onEarnedReward?: () => void): Promise<boolean> => {
    if (this.isShowingAd || !this.rewardedAd) {
      console.log('⚠️ Rewarded ad not ready or already showing');
      return false;
    }

    try {
      this.isShowingAd = true;
      
      // Add one-time event listener for reward
      if (onEarnedReward) {
        this.rewardedAd.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD,
          () => {
            onEarnedReward();
            this.rewardedAd?.removeAllListeners();
          }
        );
      }

      await this.rewardedAd.show();
      return true;
    } catch (error) {
      console.error('❌ Failed to show rewarded ad:', error);
      this.isShowingAd = false;
      return false;
    }
  };
}

// Singleton exports
export const openAppAdManager = new OpenAppAdManager();
export const rewardedAdManager = new RewardedAdManager();

// Helper to temporarily disable app open ads (e.g. after showing rewarded ad)
export const temporarilyDisableAppOpenAd = (durationMs: number = 60000) => {
  openAppAdManager.disableAppOpenAd = true;
  setTimeout(() => {
    openAppAdManager.disableAppOpenAd = false;
  }, durationMs);
};


