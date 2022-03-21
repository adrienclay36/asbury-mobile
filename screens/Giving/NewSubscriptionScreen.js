import { Platform, StyleSheet, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import NewSubscriptionHeader from './NewSubscriptionHeader'
import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { SERVER_URL } from '../../constants/serverURL'
import CenteredLoader from '../../components/ui/CenteredLoader'
import { Picker } from '@react-native-picker/picker'
import { UserContext } from '../../store/UserProvider'
import * as WebBrowser from 'expo-web-browser';
const NewSubscriptionScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [amounts, setAmounts] = useState([]);
  const [stripePrices, setStripPrices] = useState();
  const [selectedAmount, setSelectedAmount] = useState("$25");
  const [submitting, setSubmitting] = useState(false);
  const userContext = useContext(UserContext);

  const getPlans = async () => {
    setLoadingProducts(true);
    const response = await axios.get(`${SERVER_URL}/get-products`);
    setProducts(response.data.products);
    setStripPrices(response.data.prices);
    setAmounts(response.data.namesOnly);
    setLoadingProducts(false);
  }

  useEffect(() => {
    getPlans();
  }, [])


  const checkOutWithPlan = async () => {
    setSubmitting(true);
    if(selectedAmount){
      const chosenProduct = products.find(product => product.name === selectedAmount);
      const chosenPrice = stripePrices.find(price => price.product === chosenProduct.id);
      const response = await axios.post(`${SERVER_URL}/create-checkout-session`, {
        priceID: chosenPrice.id,
        userID: userContext.userValue.id,
      });

      if(response.data?.sessionURL){
        const result = await WebBrowser.openBrowserAsync(response.data.sessionURL);
        // userContext.checkUser();
        setTimeout(() => {
          navigation.push("GivingHomePage");
        }, 500);
        
      }
    }
    setSubmitting(false);

  }

  if(!products || loadingProducts || submitting) {
    return (
      <>
        <NewSubscriptionHeader navigation={navigation} />
        <CenteredLoader />
      </>
    );
  }


  return (
    <View>
      <StatusBar style={Platform.OS === "android" ? "dark" : "light"} />
      <NewSubscriptionHeader
        navigation={navigation}
        checkOutWithPlan={checkOutWithPlan}
        submitting={submitting}
      />
      <Picker
        onValueChange={(itemValue, itemIndex) => setSelectedAmount(itemValue)}
        selectedValue={selectedAmount}
      >
        {amounts.map((price, index) => (
          <Picker.Item key={index} value={price} label={price} />
        ))}
      </Picker>
    </View>
  );
}

export default NewSubscriptionScreen

const styles = StyleSheet.create({})