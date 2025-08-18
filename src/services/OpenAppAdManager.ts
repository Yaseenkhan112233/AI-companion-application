

// services/OpenAppAdManager.ts
import { Platform, AppState, AppStateStatus } from 'react-native';
import {
  AppOpenAd,
  RewardedAd,
  AdEventType,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import { AD_CONFIG } from '../config/adConfig';

// -------------------- Open App Ad Manager --------------------
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

  // Prevent Open App Ad immediately after rewarded ad
  private preventShowAfterReward = false;
  private _disableTimeout: NodeJS.Timeout | null = null;

  // 🆕 Skip first ad show after login
  private skipFirstAd = true;

  constructor() {
    this.loadAd();
    this.setupAppStateListener();
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
      // 🆕 First time after login → skip ad
      if (this.skipFirstAd) {
        console.log('⚠️ Skipping first open app ad after login');
        this.skipFirstAd = false;
        this.appState = nextAppState;
        return;
      }

      const now = Date.now();
      if (
        !this.disableAppOpenAd &&
        !this.preventShowAfterReward &&
        now - this.lastAdShowTime > 30000
      ) {
        setTimeout(() => {
          this.showAdIfAvailable();
        }, 1000);
      } else if (this.preventShowAfterReward) {
        console.log('⚠️ Skipping open app ad due to recent rewarded ad');
        this.preventShowAfterReward = false;
      }
    }
    this.appState = nextAppState;
  };

  private loadAd = () => {
    if (this.isLoadingAd || this.isAdAvailable()) return;

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
      setTimeout(() => this.loadAd(), 10000);
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
      this.loadAd();
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
      console.error('❌ Failed to show open app ad:', error);
      onAdDismissed?.();
    }
  };

  public temporarilyDisable(durationMs: number = 60000) {
    this.disableAppOpenAd = true;
    if (this._disableTimeout) clearTimeout(this._disableTimeout);
    this._disableTimeout = setTimeout(() => {
      this.disableAppOpenAd = false;
    }, durationMs);
  }

  public markPreventShowAfterReward() {
    this.preventShowAfterReward = true;
  }

  public destroy() {
    this.appStateSubscription?.remove();
    this.appOpenAd = null;
    this.adLoaded = false;
  }
}

// -------------------- Rewarded Ad Manager --------------------
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
    if (this.isLoadingAd || this.rewardedAd !== null) return;

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
      setTimeout(() => this.loadAd(), 10000);
    });

    this.rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log('💰 User earned reward:', reward);
      }
    );

    this.rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('📪 Rewarded ad closed');
      this.isShowingAd = false;
      this.rewardedAd = null;
      this.loadAd();

      // // Prevent open app ad from showing immediately after reward
      // openAppAdManager.markPreventShowAfterReward();
      // openAppAdManager.temporarilyDisable(300000); // optional: extra 5 minutes safety
    });

    this.rewardedAd.load();
  };

  public showAd = async (
    onEarnedReward?: () => void
  ): Promise<boolean> => {
    if (this.isShowingAd || !this.rewardedAd) {
      console.log('⚠️ Rewarded ad not ready or already showing');
      return false;
    }

    try {
      this.isShowingAd = true;

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

// -------------------- Singleton Exports --------------------
// export const openAppAdManager = new OpenAppAdManager();
export const rewardedAdManager = new RewardedAdManager();

