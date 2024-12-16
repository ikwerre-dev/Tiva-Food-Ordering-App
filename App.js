import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native"; // Import Sentry
import AuthContextProvider, { AuthContext } from "./context/AuthContext";
import AuthStack from "./navigation/AuthStack";
import AppStack from "./navigation/AppStack";
import { FoodProvider } from "./context/FoodContext";
import { CallProvider } from "./context/CallContext";
import CallNotification from "./components/CallNotification";

Sentry.init({
  dsn: "https://0c3d4d891d85b9e78f8694d9f33ec89a@o4508121170116608.ingest.us.sentry.io/4508472224055296",  
  enableInExpoDevelopment: true,  
  debug: true,  
});

export default function App() {
  return (
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
  );
}

function MainNavigator() {
  const { user } = React.useContext(AuthContext);
  return user ? <AppStack /> : <AuthStack />;
}