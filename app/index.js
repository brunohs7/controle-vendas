import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, Text, ImageBackground, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Preencha todos os campos.");
      return;
    }
  
    try {
      const response = await fetch('https://site.com/aplicativo/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json(); // Tente obter JSON diretamente
  
      if (data.success) {
        await AsyncStorage.setItem('token', data.token);
        router.push('/home');
      } else {
        setMessage("Login inválido. Verifique suas credenciais.");
      }
    } catch (error) {
      setMessage("Ocorreu um erro ao fazer login. Tente novamente.");
    }
  };
  

  return (
    <ImageBackground source={require('../assets/images/imagem-fundo.webp')} style={styles.background}>
      <Image source={require('../assets/images/pic-logo.png')} style={styles.logo} />
      <Text style={styles.title}>Login</Text>
      {message ? (
        <Text style={[
          styles.message, 
          message === "Preencha todos os campos." || message === "Login inválido. Verifique suas credenciais." 
          ? styles.errorMessage 
          : styles.successMessage
        ]}>
          {message}
        </Text>
      ) : null}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#aaa"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#3364f5' }]} onPress={handleLogin}>
          <Text style={[styles.buttonText, { color: '#fff' }]}>Login</Text>
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
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#fff',
  },
  inputContainer: {
    width: '80%',
    marginBottom: 0,
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    color: '#000',
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 0,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
  },
  message: {
    marginBottom: 20,
    fontSize: 18,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#fff',
  },
  errorMessage: {
    backgroundColor: 'red',
  },
  successMessage: {
    backgroundColor: 'green',
  },  
});
