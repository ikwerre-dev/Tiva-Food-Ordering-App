import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {View, Text} from "react-native"
import * as Sentry from "@sentry/react-native"; // Import Sentry
import AuthContextProvider, { AuthContext } from "./context/AuthContext";
import AuthStack from "./navigation/AuthStack";
import AppStack from "./navigation/AppStack";
import { FoodProvider } from "./context/FoodContext";
import { CallProvider, SocketProvider } from "./context/CallContext";
import CallNotification from "./components/CallNotification";
import 'react-native-gesture-handler';
import Toast from "react-native-toast-message";

Sentry.init({
  dsn: "https://b5924853cd92384acf0a66476507c67e@o4508121170116608.ingest.us.sentry.io/4508482143911936",  
  enableInExpoDevelopment: true,  
  debug: true,  
});

export default function App() {
  return (
    <Sentry.ErrorBoundary fallback={<FallbackComponent />}>
      <AuthContextProvider>
        <FoodProvider>
          <SocketProvider>
            <NavigationContainer>
              <MainNavigator />
              <CallNotification />
            </NavigationContainer>
          </SocketProvider>
        </FoodProvider>
      </AuthContextProvider>
      <Toast/>
    </Sentry.ErrorBoundary>
  );
}

function MainNavigator() {
  const { user } = React.useContext(AuthContext);
  return user ? <AppStack /> : <AuthStack />;
}

function FallbackComponent() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>An error occurred</Text>
    </View>
  );
}