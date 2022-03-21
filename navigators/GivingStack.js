import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GivingHomePage from "../screens/Giving/GivingHomePage";
const Stack = createNativeStackNavigator();
import GivingHomePageHeader from "../screens/Giving/GivingHomePageHeader";
import { StripeProvider } from "@stripe/stripe-react-native";
import NewSubscriptionScreen from "../screens/Giving/NewSubscriptionScreen";
import axios from "axios";
import CenteredLoader from "../components/ui/CenteredLoader";
import { UserContext } from "../store/UserProvider";
const GivingStack = () => {
  const userContext = useContext(UserContext);
  const [publishableKey, setPublishableKey] = useState("");

  const getPublishableKey = async () => {
    const response = await axios.get(
      "https://asbury-next-website.vercel.app/api/keys"
    );

    setPublishableKey(response.data.publishableKey);
  };

  useEffect(() => {
    getPublishableKey();
  }, []);

  if (!publishableKey || userContext.gettingUser) {
    return <CenteredLoader />;
  }

  return (
    <StripeProvider publishableKey={publishableKey}>
      <View style={{ flex: 1 }} collapsable={false}>
        <Stack.Navigator>
          <Stack.Screen
            options={({ route }) => ({
              header: (props) => (
                <GivingHomePageHeader {...props} props={props} route={route} />
              ),
            })}
            name="GivingHomePage"
            component={GivingHomePage}
          />
          <Stack.Screen
            
            name="NewSubscriptionScreen"
            options={{ headerShown: false, presentation: "formSheet" }}
            component={NewSubscriptionScreen}
          />
        </Stack.Navigator>
      </View>
    </StripeProvider>
  );
};

export default GivingStack;

const styles = StyleSheet.create({});
