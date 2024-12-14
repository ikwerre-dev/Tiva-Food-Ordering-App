import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthContextProvider, { AuthContext } from "./context/AuthContext";
import AuthStack from "./navigation/AuthStack";
import AppStack from "./navigation/AppStack";
import { FoodProvider } from "./context/FoodContext";
import { CallProvider } from "./context/CallContext";
import CallNotification from "./components/CallNotification";

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