import { registerRootComponent } from 'expo';
import MapboxGL from "@react-native-mapbox-gl/maps";
import App from './App';

MapboxGL.setAccessToken("sk.eyJ1IjoibXdldWM2NTQiLCJhIjoiY2xrdGY1bHM2MDQyMzNwbzlyc3F5cmh6MSJ9.J9jFoCswSzdsHf6xyY7B8Q");
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
