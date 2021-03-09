import * as React from 'react';
import {View, Button} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';

export default function SignInScreen(route) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const {authContext} = route.params;
  const {signIn} = React.useContext(authContext);

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign in" onPress={() => signIn({username, password})} />
    </View>
  );
}
