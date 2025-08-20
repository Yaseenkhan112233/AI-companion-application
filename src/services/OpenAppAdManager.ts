

// // services/OpenAppAdManager.ts
// import { Platform, AppState, AppStateStatus } from 'react-native';
// import {
//   AppOpenAd,
//   RewardedAd,
//   AdEventType,
//   RewardedAdEventType,
// } from 'react-native-google-mobile-ads';
// import { AD_CONFIG } from '../config/adConfig';

// // -------------------- Open App Ad Manager --------------------
// class OpenAppAdManager {
//   private appOpenAd: AppOpenAd | null = null;
//   private isLoadingAd = false;
//   private isShowingAd = false;
//   private adLoaded = false;
//   private loadTime = 0;
//   private appState: AppStateStatus = 'active';
//   private appStateSubscription: any;
//   public disableAppOpenAd = false;
//   private lastAdShowTime = 0;

//   // Prevent Open App Ad immediately after rewarded ad
//   private preventShowAfterReward = false;
//   private _disableTimeout: NodeJS.Timeout | null = null;

//   // 🆕 Skip first ad show after login
//   private skipFirstAd = true;

//   constructor() {
//     this.loadAd();
//     this.setupAppStateListener();
//   }

//   private getAdUnitId(): string {
//     return Platform.OS === 'ios'
//       ? AD_CONFIG.openAppAdId.ios
//       : AD_CONFIG.openAppAdId.android;
//   }

//   private setupAppStateListener() {
//     this.appStateSubscription = AppState.addEventListener(
//       'change',
//       this.handleAppStateChange
//     );
//   }

//   private handleAppStateChange = (nextAppState: AppStateStatus) => {
//     if (this.appState === 'background' && nextAppState === 'active') {
//       // 🆕 First time after login → skip ad
//       if (this.skipFirstAd) {
//         console.log('⚠️ Skipping first open app ad after login');
//         this.skipFirstAd = false;
//         this.appState = nextAppState;
//         return;
//       }

//       const now = Date.now();
//       if (
//         !this.disableAppOpenAd &&
//         !this.preventShowAfterReward &&
//         now - this.lastAdShowTime > 30000
//       ) {
//         setTimeout(() => {
//           this.showAdIfAvailable();
//         }, 1000);
//       } else if (this.preventShowAfterReward) {
//         console.log('⚠️ Skipping open app ad due to recent rewarded ad');
//         this.preventShowAfterReward = false;
//       }
//     }
//     this.appState = nextAppState;
//   };

//   private loadAd = () => {
//     if (this.isLoadingAd || this.isAdAvailable()) return;

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
//       setTimeout(() => this.loadAd(), 10000);
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
//       this.loadAd();
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
//       this.isShowingAd = true;
//       this.lastAdShowTime = Date.now();

//       this.appOpenAd?.addAdEventListener(AdEventType.CLOSED, () => {
//         this.isShowingAd = false;
//         onAdDismissed?.();
//       });

//       this.appOpenAd?.show();
//     } catch (error) {
//       console.error('❌ Failed to show open app ad:', error);
//       onAdDismissed?.();
//     }
//   };

//   public temporarilyDisable(durationMs: number = 60000) {
//     this.disableAppOpenAd = true;
//     if (this._disableTimeout) clearTimeout(this._disableTimeout);
//     this._disableTimeout = setTimeout(() => {
//       this.disableAppOpenAd = false;
//     }, durationMs);
//   }

//   public markPreventShowAfterReward() {
//     this.preventShowAfterReward = true;
//   }

//   public destroy() {
//     this.appStateSubscription?.remove();
//     this.appOpenAd = null;
//     this.adLoaded = false;
//   }
// }

// // -------------------- Rewarded Ad Manager --------------------
// class RewardedAdManager {
//   private rewardedAd: RewardedAd | null = null;
//   private isLoadingAd = false;
//   private isShowingAd = false;

//   constructor() {
//     this.loadAd();
//   }

//   private getAdUnitId(): string {
//     return Platform.OS === 'ios'
//       ? AD_CONFIG.rewardedAdId.ios
//       : AD_CONFIG.rewardedAdId.android;
//   }

//   private loadAd = () => {
//     if (this.isLoadingAd || this.rewardedAd !== null) return;

//     this.isLoadingAd = true;
//     this.rewardedAd = RewardedAd.createForAdRequest(this.getAdUnitId(), {
//       requestNonPersonalizedAdsOnly: false,
//     });

//     this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
//       console.log('✅ Rewarded ad loaded');
//       this.isLoadingAd = false;
//     });

//     this.rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
//       console.error('❌ Rewarded ad failed to load:', error);
//       this.isLoadingAd = false;
//       this.rewardedAd = null;
//       setTimeout(() => this.loadAd(), 10000);
//     });

//     this.rewardedAd.addAdEventListener(
//       RewardedAdEventType.EARNED_REWARD,
//       (reward) => {
//         console.log('💰 User earned reward:', reward);
//       }
//     );

//     this.rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
//       console.log('📪 Rewarded ad closed');
//       this.isShowingAd = false;
//       this.rewardedAd = null;
//       this.loadAd();

//       // // Prevent open app ad from showing immediately after reward
//       // openAppAdManager.markPreventShowAfterReward();
//       // openAppAdManager.temporarilyDisable(300000); // optional: extra 5 minutes safety
//     });

//     this.rewardedAd.load();
//   };

//   public showAd = async (
//     onEarnedReward?: () => void
//   ): Promise<boolean> => {
//     if (this.isShowingAd || !this.rewardedAd) {
//       console.log('⚠️ Rewarded ad not ready or already showing');
//       return false;
//     }

//     try {
//       this.isShowingAd = true;

//       if (onEarnedReward) {
//         this.rewardedAd.addAdEventListener(
//           RewardedAdEventType.EARNED_REWARD,
//           () => {
//             onEarnedReward();
//             this.rewardedAd?.removeAllListeners();
//           }
//         );
//       }

//       await this.rewardedAd.show();
//       return true;
//     } catch (error) {
//       console.error('❌ Failed to show rewarded ad:', error);
//       this.isShowingAd = false;
//       return false;
//     }
//   };
// }

// // -------------------- Singleton Exports --------------------
// // export const openAppAdManager = new OpenAppAdManager();
// export const rewardedAdManager = new RewardedAdManager();
// services/RewardedAdManager.ts
import { Platform } from 'react-native';
import {
  RewardedAd,
  AdEventType,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { AD_CONFIG } from '../config/adConfig';

class RewardedAdManager {
  private rewardedAd: RewardedAd | null = null;
  private isLoadingAd = false;
  private isShowingAd = false;
  private isAdLoaded = false;
  private retryCount = 0;
  private maxRetries = 3;
  private retryDelay = 5000; // Start with 5 seconds

  constructor() {
    console.log('🚀 Initializing RewardedAdManager');
    this.loadAd();
  }

  private getAdUnitId(): string {
    // Use test ads during development
    const isDevelopment = __DEV__;
    
    if (isDevelopment) {
      return TestIds.REWARDED;
    }

    return Platform.OS === 'ios'
      ? AD_CONFIG.rewardedAdId.ios
      : AD_CONFIG.rewardedAdId.android;
  }

  private loadAd = () => {
    if (this.isLoadingAd || this.isAdLoaded) {
      console.log('⚠️ Already loading ad or ad already loaded');
      return;
    }

    console.log('📥 Loading rewarded ad...');
    this.isLoadingAd = true;

    try {
      this.rewardedAd = RewardedAd.createForAdRequest(this.getAdUnitId(), {
        requestNonPersonalizedAdsOnly: false,
        keywords: ['gaming', 'entertainment'], // Add relevant keywords
      });

      this.setupAdEventListeners();
      this.rewardedAd.load();
    } catch (error) {
      console.error('❌ Error creating rewarded ad:', error);
      this.handleLoadError();
    }
  };

  private setupAdEventListeners = () => {
    if (!this.rewardedAd) return;

    // Remove any existing listeners first
    this.rewardedAd.removeAllListeners();

    this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('✅ Rewarded ad loaded successfully');
      this.isLoadingAd = false;
      this.isAdLoaded = true;
      this.retryCount = 0; // Reset retry count on success
    });

    this.rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('❌ Rewarded ad error:', error);
      this.handleLoadError();
    });

    this.rewardedAd.addAdEventListener(AdEventType.OPENED, () => {
      console.log('📢 Rewarded ad opened');
      this.isShowingAd = true;
    });

    this.rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('📪 Rewarded ad closed');
      this.isShowingAd = false;
      this.isAdLoaded = false;
      this.rewardedAd = null;
      
      // Load next ad after a short delay
      setTimeout(() => {
        this.loadAd();
      }, 1000);
    });

    this.rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log('💰 User earned reward:', reward);
      }
    );
  };

  private handleLoadError = () => {
    this.isLoadingAd = false;
    this.isAdLoaded = false;
    this.rewardedAd = null;

    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      const delay = this.retryDelay * this.retryCount; // Exponential backoff
      
      console.log(`🔄 Retrying to load rewarded ad in ${delay}ms (attempt ${this.retryCount}/${this.maxRetries})`);
      
      setTimeout(() => {
        this.loadAd();
      }, delay);
    } else {
      console.error('❌ Max retries reached for rewarded ad loading');
      // Reset retry count after some time
      setTimeout(() => {
        this.retryCount = 0;
        this.loadAd();
      }, 60000); // Try again after 1 minute
    }
  };

  public isAdReady = (): boolean => {
    const ready = this.rewardedAd !== null && this.isAdLoaded && !this.isShowingAd;
    console.log(`🔍 Ad ready status: ${ready} (ad: ${!!this.rewardedAd}, loaded: ${this.isAdLoaded}, showing: ${this.isShowingAd})`);
    return ready;
  };

  public showAd = async (
    onEarnedReward?: (reward: any) => void,
    onAdClosed?: () => void,
    onAdFailedToShow?: (error: any) => void
  ): Promise<boolean> => {
    console.log('🎬 Attempting to show rewarded ad');

    if (this.isShowingAd) {
      console.log('⚠️ Rewarded ad is already showing');
      return false;
    }

    if (!this.isAdReady()) {
      console.log('⚠️ Rewarded ad not ready');
      onAdFailedToShow?.({ message: 'Ad not ready. Please try again later.' });
      
      // Try to load a new ad if none is loading
      if (!this.isLoadingAd) {
        this.loadAd();
      }
      return false;
    }

    try {
      // Add one-time event listeners for this show
      if (onEarnedReward) {
        const rewardListener = (reward: any) => {
          console.log('💰 Reward earned in show method:', reward);
          onEarnedReward(reward);
          this.rewardedAd?.removeAllListeners();
        };
        this.rewardedAd!.addAdEventListener(RewardedAdEventType.EARNED_REWARD, rewardListener);
      }

      if (onAdClosed) {
        const closedListener = () => {
          console.log('📪 Ad closed in show method');
          onAdClosed();
          if (this.rewardedAd) {
            this.rewardedAd.removeAllListeners();
          }
        };
        if (this.rewardedAd) {
          this.rewardedAd.addAdEventListener(AdEventType.CLOSED, closedListener);
        }
      }

      await this.rewardedAd!.show();
      console.log('✅ Rewarded ad show command sent');
      return true;

    } catch (error) {
      console.error('❌ Failed to show rewarded ad:', error);
      this.isShowingAd = false;
      onAdFailedToShow?.(error);
      
      // Try to load a new ad
      if (!this.isLoadingAd) {
        this.loadAd();
      }
      return false;
    }
  };

  // Method to manually reload ad
  public reloadAd = () => {
    console.log('🔄 Manual ad reload requested');
    if (this.rewardedAd) {
      this.rewardedAd.removeAllListeners();
      this.rewardedAd = null;
    }
    this.isLoadingAd = false;
    this.isAdLoaded = false;
    this.isShowingAd = false;
    this.retryCount = 0;
    this.loadAd();
  };

  // Get current status for debugging
  public getStatus = () => {
    return {
      hasAd: !!this.rewardedAd,
      isLoaded: this.isAdLoaded,
      isLoading: this.isLoadingAd,
      isShowing: this.isShowingAd,
      isReady: this.isAdReady(),
      retryCount: this.retryCount,
      adUnitId: this.getAdUnitId(),
    };
  };

  public destroy = () => {
    console.log('🗑️ Destroying RewardedAdManager');
    if (this.rewardedAd) {
      this.rewardedAd.removeAllListeners();
      this.rewardedAd = null;
    }
    this.isLoadingAd = false;
    this.isAdLoaded = false;
    this.isShowingAd = false;
  };
}

// Export singleton instance
export const rewardedAdManager = new RewardedAdManager();
