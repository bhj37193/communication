import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import type { View } from 'react-native';
import { trackShareTapped } from './api';

// Capture the score card to a local PNG and hand it to the native share sheet.
// The analytics ping is fire-and-forget: a failed/rejected trackShareTapped must
// never reject out of here or delay the share sheet.
export async function shareScoreCard(viewShotRef: React.RefObject<View | null>): Promise<void> {
  const uri = await captureRef(viewShotRef, { format: 'png', quality: 1 });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri);
  }

  void trackShareTapped().catch(() => {
    // Analytics is best-effort; never surface to the user.
  });
}
