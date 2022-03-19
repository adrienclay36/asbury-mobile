import { Share } from "react-native";
import * as Haptics from 'expo-haptics';
export const onShare = async (message, url) => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  try {
    const result = await Share.share({
      message: message,
      url: url,
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log(result.activityType);
      }
    } else if (result.action === Share.dismissedAction) {
      console.log("Dismissed");
    }
  } catch (err) {
    console.log(err.message);
  }
};
