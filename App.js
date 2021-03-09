/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationActions} from 'react-navigation';
import {AsyncStorage, Button} from 'react-native';
import NotificationsScreen from './views/notifications';
import SplashScreen from './views/splash';
import SignInScreen from './views/signin';
import DashboardScreen from './views/dashboard';
import ProfileScreen from './views/profile';
import SettingsScreen from './views/settings';
import DrawerContentScrollView from '@react-navigation/drawer/src/views/DrawerContentScrollView';
import DrawerItem from '@react-navigation/drawer/src/views/DrawerItem';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AuthContext = React.createContext();

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();
  }, []);
  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
    }),
    [],
  );
  if (state.isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }
  const logout = () => {
    const actionToDispatch = NavigationActions.reset({
      index: 0,
      key: null, // black magic
      actions: [NavigationActions.navigate({routeName: 'HomeScreen'})],
    });
    this.props.navigation.dispatch(actionToDispatch);
  };

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          return (
          <DrawerContentScrollView>
            <DrawerItem label="Sign out" onPress={logout} />
          </DrawerContentScrollView>
          ) }}>
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Notifications" component={NotificationsScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );

  function HomeScreen() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              initialParams={{authContext: authContext}}
              options={{
                title: 'Sign in',
                // When logging out, a pop animation feels intuitive
                // You can remove this if you want the default 'push' animation
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          ) : (
            <>
              // User is signed in
              <Stack.Screen name="Dashboard" component={DashboardScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </>
          )}
          ; )
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
