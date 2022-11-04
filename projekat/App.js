import React, {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';


import DrawerNavigacija from './relacije/drawer'; // navigacija drawer

export default function App() {
  

  return (
      <DrawerNavigacija />
      
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
