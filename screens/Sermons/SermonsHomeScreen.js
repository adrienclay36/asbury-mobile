import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Audio } from "expo-av";
import { Button } from 'react-native-paper';
import CenteredLoader from "../../components/ui/CenteredLoader";
import { supabase } from '../../supabase-service';

Audio.setAudioModeAsync({
  playsInSilentModeIOS: true,
  playThroughEarpieceAndroid: true,
  staysActiveInBackground: true,
  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
  interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
  allowsRecordingIOS: false,
  
});
const SermonsHomeScreen = () => {
    const [sound, setSound] = useState(new Audio.Sound());
    const [loading, setLoading] = useState(false);
    const status= {
        shouldPlay: false,
    }
    
    const loadSound = async () => {
        setLoading(true);
        // const { publicURL, error } = await supabase.storage.from('audio').getPublicUrl('JediChords.mp3');
        
        const fetchedSound = new Audio.Sound();
        fetchedSound.loadAsync(
          {
            uri: "https://www.dropbox.com/s/m8r0iyfr6x1488d/JediChords.mp3?dl=0",
          },
          status,
          false
        );
        setSound(fetchedSound);
        setLoading(false);
    }

    useEffect(() => {
        loadSound();
    }, [])

    const playSound = () => {
        sound.playAsync();
    }

    if(!sound) {
        return <CenteredLoader/>
    }
    
  return (
    <View>
      <Button onPress={playSound}>Play Sound</Button>
    </View>
  );
};

export default SermonsHomeScreen;

const styles = StyleSheet.create({});
