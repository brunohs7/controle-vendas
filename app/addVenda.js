import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ImageBackground, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { TextInputMask } from 'react-native-masked-text';

const SALES_KEY = '@sales';

export default function AddSaleScreen() {
  const [data, setDate] = useState('');
  const [sale, setSale] = useState('');
  const [cost, setCost] = useState('');
  const [commission, setCommission] = useState(''); // Novo estado para a comissão
  const [message, setMessage] = useState('');
  const router = useRouter();

  const formatToNumber = (value) => {
    return parseFloat(value.replace(/R\$|\./g, '').replace(',', '.'));
  };

  const addSale = async () => {
    if (!data || !sale || !cost || !commission) {
      setMessage("Preencha todos os campos.");
      return;
    }
  
    const newSale = {
      date: data,
      sale: formatToNumber(sale),
      cost: formatToNumber(cost) + formatToNumber(commission),
      commission: formatToNumber(commission),
    };
  
    try {
      const token = await AsyncStorage.getItem('token');
  
      const response = await fetch('https://site.com/aplicativo/addSale.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Inclui o token no cabeçalho
        },
        body: JSON.stringify(newSale),
      });
  
      const result = await response.json();
  
      if (result.success) {
        setMessage('Venda adicionada com sucesso!');
        setDate('');
        setSale('');
        setCost('');
        setCommission('');
      } else {
        setMessage(result.message || 'Erro ao adicionar venda');
      }
    } catch (error) {
      console.error('Erro ao adicionar venda:', error);
      setMessage('Erro ao se conectar com o servidor');
    }
  };
  

  return (
    <ImageBackground source={require('../assets/images/imagem.webp')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Adicionar Venda</Text>
        {message ? (
          <Text style={[styles.message, message === "Preencha todos os campos." ? styles.errorMessage : styles.successMessage]}>
            {message}
          </Text>
        ) : null}
        <TextInputMask
          placeholder="Data (dd/mm/aa)"
          value={data}
          onChangeText={setDate}
          type={'datetime'}
          options={{
            format: 'DD/MM/YYYY',
          }}
          style={styles.input}
          placeholderTextColor="#ffffff"
        />
        <TextInputMask
          placeholder="Venda"
          value={sale}
          onChangeText={setSale}
          keyboardType="numeric"
          type={'money'}
          options={{
            precision: 2,
            separator: ',',
            delimiter: '.',
            unit: 'R$ ',
            suffixUnit: ''
          }}
          style={styles.input}
          placeholderTextColor="#ffffff"
        />
        <TextInputMask
          placeholder="Custo"
          value={cost}
          onChangeText={setCost}
          keyboardType="numeric"
          type={'money'}
          options={{
            precision: 2,
            separator: ',',
            delimiter: '.',
            unit: 'R$ ',
            suffixUnit: ''
          }}
          style={styles.input}
          placeholderTextColor="#ffffff"
        />
        <TextInputMask
          placeholder="Comissão"
          value={commission}
          onChangeText={setCommission}
          keyboardType="numeric"
          type={'money'}
          options={{
            precision: 2,
            separator: ',',
            delimiter: '.',
            unit: 'R$ ',
            suffixUnit: ''
          }}
          style={[styles.input, { marginBottom: 20 }]}
          placeholderTextColor="#ffffff"
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#3364f5' }]} onPress={addSale}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>Adicionar Venda</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#fff' }]} onPress={() => { router.push('/home'); }}>
            <Text style={[styles.buttonText, { color: '#000' }]}>Voltar</Text>
          </TouchableOpacity>
        </View>
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
  container: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 60,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    fontSize: 16,
    marginBottom: 10,
    padding: 10,
    width: '80%',
    color: '#ffffff',
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
  buttonText: {
    color: '#fff',
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
