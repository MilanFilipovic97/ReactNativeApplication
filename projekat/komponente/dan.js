import React, {useState,useEffect,} from 'react';
import { StyleSheet, Text, View, Button, FlatList,ActivityIndicator,Image,
Alert,TouchableOpacity } from 'react-native';
import { globalStyles } from '../stilovi/global';

import DatePicker from '@react-native-community/datetimepicker'; // kalendar


import { AntDesign } from '@expo/vector-icons'; // ikonica
import { FontAwesome } from '@expo/vector-icons'; 

import { Dimensions } from "react-native";
import {PieChart} from "react-native-chart-kit";


export default function Dan({navigation}) {
  
  //#region - Kalendar
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  
  const [datum,setDatum] = useState('2020-01-01'); 


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    
    const datumPom = spremiDatumZaUpis(currentDate);
    setDatum(spremiDatumZaUpis(currentDate));
    
    //ucitajPodatke();
    //console.log("ucitao bih");
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };
// do ovde je za kalendar 
const spremiDatumZaUpis = (currentDate) =>{
  const mesec = currentDate.getMonth()+1
  const pomocniDatum = currentDate.getFullYear() + "-" +mesec + "-"+currentDate.getDate();
  //console.log("pomocni "+ pomocniDatum);
  return pomocniDatum.toString();
 }

 //#endregion


const [isLoading, setLoading] = useState(true);
  const [podaci, setPodaci] = useState([
  ]);
  const [podaciGrafikon, setPodaciGrafikon] = useState([
  ]);

  const chartConfig = {
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  };
  const [prihodi, setPrihodi] = useState([0]);
  const [rashodi, setRashodi] = useState([0]);
/*
  useEffect(() => {
    ucitajPodatke();
  }, []);

*/
  const navPrihod = () => {
    navigation.navigate('DodajPrihod', {datum: datum});
  }
  const navRashod = () => {
    navigation.navigate('DodajRashod', {datum: datum});
  }

  async function ucitajUkupanRashod(){
    try{
      fetch('https://reactprojekat.herokuapp.com/selectUkupniRashod/'+datum)      
      
    .then((response) => response.json())
    .then((json) => setRashodi(json))
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));

      }
      catch(error){
        console.error(error);
      }
  }
  
  async function ucitajUkupanPrihod(){
    try{
      fetch('https://reactprojekat.herokuapp.com/selectUkupniPrihod/'+datum)      
      
    .then((response) => response.json())
    .then((json) => setPrihodi(json))
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));

      }
      catch(error){
        console.error(error);
      }
  }

  async function ucitajPodatke(){
    try{
      fetch('https://reactprojekat.herokuapp.com/selectListaRashoda/'+datum)      
      
    .then((response) => response.json())
    .then((json) => setPodaci(json))
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));
      }
      catch(error){
        console.error(error);
      }
  }

  async function ucitajGrafikon(){
    try{
      fetch('https://reactprojekat.herokuapp.com/grafikonRashodaDan/'+datum)      
      
    .then((response) => response.json())
    .then((json) => setPodaciGrafikon(json))
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));
      }
      catch(error){
        console.error(error);
      }
  }

 const ucitajSvePodakte = () =>{
  ucitajPodatke();
  ucitajGrafikon();
  ucitajUkupanPrihod();
  ucitajUkupanRashod();
 }

  return (
    <View style = {styles.container}>
      <View style = {styles.dugme}>
      <AntDesign 
                
                name = 'minuscircleo'
                 size = {50}
                 color = '#ff5c33'
                 onPress = {navRashod}
                 />
                       
                       {/*KALENDAR */}
      <View style = {styles.kalendar}> 
          
      <View style = {{alignItems: 'center'}}>
      <AntDesign  
                name = 'calendar'
                 size = {50}
                 color = '#ff5c33'
                 onPress = {showDatepicker}
                 />
        
        <Text>Datum: {datum} </Text>
      </View>
      
      {show && (
        <DatePicker
          mode = "date"
          value={new Date()}
          onChange={onChange}
          format="YYYY-MM-DD"
      />
      )}
      

      </View>
          <View>
          <AntDesign name = 'pluscircleo'
                 size = {50}
                 color = 'green'
                 onPress = {navPrihod}
                 />
        </View>
      </View>
      <Button title = 'Prikazi' color = 'maroon' onPress={ucitajSvePodakte} />
      
      <View style = {styles.vrednosti}>

      <Text style = {styles.prihod}>Ukupan prihod: {prihodi[0].Vrednost} </Text>
      <Text style = {styles.rashod}>Ukupan rashod: {rashodi[0].Vrednost} </Text>
      <Text style = {styles.saldo}>Saldo: {prihodi[0].Vrednost - rashodi[0].Vrednost  }</Text>
      </View>

      <View style={styles.grafikon}>
      <PieChart
        data={podaciGrafikon}
        width={Dimensions.get('window').width}
        height={230}
        chartConfig={chartConfig}
        accessor="vrednost"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
    <View style = {{width: 100 }}>
    <FontAwesome name="euro" size={28} color = "#4d85ff"  onPress = {() => navigation.navigate('KarticaPrihoda', {datum: datum} )} /> 
    <Text >Kartica prihoda</Text>
    </View>
      <Text style = {styles.naslovTroslovi} >Troskovi</Text>

      <View style = {styles.container}>

      
      <FlatList
          data={podaci}
          keyExtractor = {(item,index) => index.toString()}
          renderItem={({ item }) => (
            <View style ={styles.lista}>
              <TouchableOpacity onPress = {() => navigation.navigate('KarticaRashoda',  item )}> 
          <Image source = {{uri: item.Slicica}} style = {{width: 50, height: 50}} />
          <Text>  {item.Name}  {item.Vrednost} </Text>
          </TouchableOpacity>
          </View>
          )}
        />
       
      </View>
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    
  },
  
  lista:{
  
    textAlign: 'center',
    marginTop: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: '#bbb',
    borderStyle: 'dashed',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  naslovTroslovi:{
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5
  },
  grafikon:{
    marginTop: 10,
    flex: 1
  },
  ikonica:{
    flexDirection: 'row',
    //marginRight: 10,
    //marginLeft: 10
    
  },
  dugme:{
    marginTop: 10,
    flexDirection: 'row',
 
    },
  kalendar:{
    marginLeft: 70,
    flexDirection: 'row',
    marginRight: 70
  },
  prihod:{ // vrednost prihoda
    marginTop: 15,
    color: 'green',
    fontSize: 15
  },
  rashod:{
    color: 'red',
    fontSize: 15
  },
  saldo:{
    color: 'blue',
    fontSize: 15
  },
  vrednosti:{
    alignItems: 'center',
  },
  grafikon: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
 
});


