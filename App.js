import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
   StyleSheet,
   Text,
   View,
   TouchableOpacity,
   ImageBackground,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";

export default function App() {
   const [sound, setSound] = useState();
   const [isPlaying, setIsPlaying] = useState(false);
   const [position, setPosition] = useState(0);
   const [duration, setDuration] = useState(0);

   const audioFiles = [require("./assets/audio/ansiedade.m4a")];

   async function playAudio() {
      const randomIndex = Math.floor(Math.random() * audioFiles.length);
      const { sound, status } = await Audio.Sound.createAsync(
         audioFiles[randomIndex]
      );

      setSound(sound);
      setDuration(status.durationMillis);
      await sound.playAsync();
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
         if (status.isLoaded) {
            setPosition(status.positionMillis);
            if (status.didJustFinish) {
               setIsPlaying(false);
               sound.unloadAsync();
            }
         }
      });
   }

   const togglePlayPause = async () => {
      if (sound) {
         if (isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
         } else {
            await sound.playAsync();
            setIsPlaying(true);
         }
      } else {
         playAudio();
      }
   };

   const handleSliderChange = async (value) => {
      if (sound) {
         await sound.setPositionAsync(value);
      }
   };

   // Formatar o tempo em minutos e segundos
   const formatTime = (time) => {
      const minutes = Math.floor(time / 60000);
      const seconds = Math.floor((time % 60000) / 1000);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
   };

   return (
      <ImageBackground
         source={require("./assets/bg-main.webp")} // Substitua pelo caminho da nova imagem
         style={styles.background}
      >
         <StatusBar style="auto" />
         <Text style={styles.title}>App Equilíbrio</Text>
         <View style={styles.container}>
            <Text style={styles.text}>Iniciar Meditação</Text>
            <TouchableOpacity onPress={togglePlayPause} style={styles.playIcon}>
               <FontAwesome
                  name={isPlaying ? "pause-circle-o" : "play-circle-o"}
                  size={48}
                  color="green"
               />
            </TouchableOpacity>
            {/* Exibe o tempo decorrido e a duração total */}
            {isPlaying && (
               <>
                  <View style={styles.timeContainer}>
                     <Text style={styles.timeText}>{formatTime(position)}</Text>
                     <Text style={styles.timeText}>{formatTime(duration)}</Text>
                  </View>

                  <Slider
                     style={styles.slider}
                     minimumValue={0}
                     maximumValue={duration}
                     value={position}
                     onValueChange={handleSliderChange}
                     minimumTrackTintColor="white"
                     maximumTrackTintColor="#d3d3d3"
                     thumbTintColor="white"
                  />
               </>
            )}
         </View>
      </ImageBackground>
   );
}

const styles = StyleSheet.create({
   background: {
      flex: 1,
      justifyContent: "center",
   },
   title: {
      textAlign: "center",
      paddingTop: 100,
      fontSize: 48,
      color: "green",
      fontWeight: "bold",
   },
   container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 80,
   },
   text: {
      color: "green",
      fontSize: 20,
      fontWeight: "bold",
   },
   playIcon: {
      paddingTop: 10,
      paddingLeft: 2,
   },
   timeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "80%",
      marginVertical: 10,
   },
   timeText: {
      color: "green",
      fontSize: 16,
   },
   slider: {
      width: 300,
      height: 40,
      marginTop: 20,
   },
});
