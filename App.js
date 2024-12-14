import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthContextProvider, { AuthContext } from "./context/AuthContext";
import AuthStack from "./navigation/AuthStack";
import AppStack from "./navigation/AppStack";
import { FoodProvider } from "./context/FoodContext";

export default function App() {
  return (
    <AuthContextProvider>
      <FoodProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </FoodProvider>
    </AuthContextProvider>
  );
}

function MainNavigator() {
  const { user } = React.useContext(AuthContext);
  return user ? <AppStack /> : <AuthStack />;
}
