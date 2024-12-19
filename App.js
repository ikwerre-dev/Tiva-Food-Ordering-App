import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native"; // Import Sentry
import AuthContextProvider, { AuthContext } from "./context/AuthContext";
import AuthStack from "./navigation/AuthStack";
import AppStack from "./navigation/AppStack";
import { FoodProvider } from "./context/FoodContext";
import { CallProvider } from "./context/CallContext";
import CallNotification from "./components/CallNotification";
import 'react-native-gesture-handler';

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
          <CallProvider>
            <NavigationContainer>
              <MainNavigator />
              <CallNotification />
            </NavigationContainer>
          </CallProvider>
        </FoodProvider>
      </AuthContextProvider>
    </Sentry.ErrorBoundary>
  );
}

function MainNavigator() {
  const { user } = React.useContext(AuthContext);
  return user ? <AppStack /> : <AuthStack />;
}

function FallbackComponent() {
  return (
    <React.Fragment>
      <Text>Something went wrong. Please restart the app.</Text>
    </React.Fragment>
  );
}