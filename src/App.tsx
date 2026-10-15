import { OnboardingScreen } from './screens/OnboardingScreen';
import { ViewfinderIdleScreen } from './screens/ViewfinderIdleScreen';
import { LockingScreen } from './screens/LockingScreen';
import { MomentStripScreen } from './screens/MomentStripScreen';
import { GroupModeScreen } from './screens/GroupModeScreen';
import { ComponentKitScreen } from './screens/ComponentKitScreen';
import { InteractiveCameraScreen } from './screens/InteractiveCameraScreen';
import { HeroCompositeScreen } from './screens/HeroCompositeScreen';
import { CaseStudyScreen } from './screens/CaseStudyScreen';

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const screen = urlParams.get('screen');

  switch (screen) {
    case 'onboarding':
      return <OnboardingScreen />;
    case 'idle':
      return <ViewfinderIdleScreen />;
    case 'locking':
      return <LockingScreen />;
    case 'moments':
      return <MomentStripScreen />;
    case 'group':
      return <GroupModeScreen />;
    case 'kit':
      return <ComponentKitScreen />;
    case 'hero':
    case 'composite':
    case 'hero-composite':
      return <HeroCompositeScreen />;
    case 'case-study':
    case 'casestudy':
      return <CaseStudyScreen />;
    case 'interactive':
    case 'live':
    default:
      // Default root route renders the full interactive state-machine camera experience with DemoPanel
      return <InteractiveCameraScreen />;
  }
}
