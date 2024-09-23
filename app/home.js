import React from 'react';
import { View, Button, TouchableOpacity, Image, StyleSheet, Text, ImageBackground  } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground 
      source={require('../assets/images/imagem-mapa.webp')} 
      style={styles.background}
    >
      <Image source={require('../assets/images/pic-logo-warley-branca.png')} style={styles.logo} />
      <Text style={styles.title}>Controle de Vendas</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#3364f5' }]} onPress={() => router.push('/addVenda')}>
          <Text style={[styles.buttonText, {color: '#fff'}]}>Adicionar Venda</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#fff'}]} onPress={() => router.push('/vendas')}>
          <Text style={[styles.buttonText, {color: '#000'}]}>Ver Vendas</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 130,
    marginBottom: 40,
    borderRadius: 10,
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },  
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText:{
    color: '#fff',
    fontSize: 18,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#fff',
  }  
});
