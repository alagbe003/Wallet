import 'react-native-get-random-values'
import { registerRootComponent } from 'expo'

import { RootComponent } from './src/RootComponent'

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(RootComponent)
