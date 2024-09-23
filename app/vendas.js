import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ImageBackground, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Dimensions } from 'react-native';

const SALES_KEY = '@sales';
const screenWidth = Dimensions.get('window').width;

export default function ViewSalesScreen() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const loadSales = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('https://warleyagentedeviagens.com/aplicativo/sales.php', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.success) {
          if (Array.isArray(data.sales)) {
            const sortedSales = data.sales.sort((a, b) => {
              if (a.data && b.data) {
                const dateA = new Date(a.data.split('/').reverse().join('-'));
                const dateB = new Date(b.data.split('/').reverse().join('-'));
                return dateA - dateB;
              }
              return 0;
            });
            setSales(sortedSales);
            setFilteredSales(sortedSales);

            // Extraindo anos únicos das vendas
            const years = [...new Set(sortedSales.map(sale => sale.data.split('/')[2]))];
            setAvailableYears(years);
          } else {
            console.error('Dados de vendas não estão no formato esperado:', data.sales);
          }
        } else {
          console.error('Erro ao carregar vendas:', data.message);
        }
      } catch (error) {
        console.error('Erro de rede:', error);
      }
    };

    loadSales();
  }, []);

  useEffect(() => { 
    const filtered = sales.filter(sale => {
      const [day, month, year] = sale.data.split('/');
      const saleMonth = parseInt(month, 10);
      const saleYear = parseInt(year, 10);
      const selectedMonthNum = parseInt(selectedMonth, 10);
      return saleMonth === selectedMonthNum && saleYear === parseInt(selectedYear, 10);
    });

    setFilteredSales(filtered);
  }, [selectedMonth, selectedYear, sales]);

  const removeSale = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`https://warleyagentedeviagens.com/aplicativo/removeSale.php?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
  
      if (response.ok) {
        const updatedSales = sales.filter(sale => sale.id !== id);
        setSales(updatedSales);
        setFilteredSales(updatedSales);
      } else {
        const errorData = await response.json();
        console.error('Erro ao remover venda:', errorData.message);
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
    }
  };

  const formatCurrency = (value) => {
    return `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`;
  };
  
  const [monthlyData, setMonthlyData] = useState({});

  const calculateMonthlyData = () => {
    const data = {};

    sales.forEach(sale => {
      const [day, month, year] = sale.data.split('/');
      const monthKey = `${month}/${year}`;

      if (!data[monthKey]) {
        data[monthKey] = { revenue: 0, cost: 0, profit: 0 };
      }

      data[monthKey].revenue += parseFloat(sale.sale);
      data[monthKey].cost += parseFloat(sale.cost);
      data[monthKey].profit = data[monthKey].revenue - data[monthKey].cost;
    });

    setMonthlyData(data);
  };

  useEffect(() => {
    calculateMonthlyData();
  }, [sales]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.scrollGeral} contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground source={require('../assets/images/imagem-mapa.webp')} style={styles.background}>
          <Text style={styles.title}>Vendas</Text>
          <View style={styles.viewFiltro}>
            <Picker
              selectedValue={selectedMonth}
              style={{ height: 40, width: 150, color: '#000', backgroundColor: '#fff' }}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <Picker.Item key={i} label={new Date(0, i).toLocaleString('pt-BR', { month: 'long' })} value={i} />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedYear}
              style={{ height: 40, width: 150, color: '#000', backgroundColor: '#fff' }}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
            >
              {availableYears.map(year => (
                <Picker.Item key={year} label={year} value={parseInt(year, 10)} />
              ))}
            </Picker>
          </View>
          <View style={styles.salesContainer}>
            <ScrollView contentContainerStyle={styles.tableContainer} style={{ width: '100%', marginBottom: 30 }}>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderCell}>Data</Text>
                  <Text style={styles.tableHeaderCell}>Venda</Text>
                  <Text style={styles.tableHeaderCell}>Custo</Text>
                  <Text style={styles.tableHeaderCell}>Ação</Text>
                </View>
                <FlatList
                  data={filteredSales}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>{item.data}</Text>
                      <Text style={styles.tableCell}>{formatCurrency(parseFloat(item.sale))}</Text>
                      <Text style={styles.tableCell}>{formatCurrency(parseFloat(item.cost))}</Text>
                      <View style={styles.viewBotao}>
                        <TouchableOpacity onPress={() => removeSale(item.id)} style={styles.removeButton}>
                          <Text style={{ color: '#fff' }}>Remover</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  scrollEnabled={false}
                />
              </View>
            </ScrollView>

            <Text style={styles.title}>Receitas e Custos Mensais</Text>
            <ScrollView contentContainerStyle={styles.tableContainer} style={{ width: '100%', marginBottom: 20 }}>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderCell}>Mês</Text>
                  <Text style={styles.tableHeaderCell}>Receitas</Text>
                  <Text style={styles.tableHeaderCell}>Custos</Text>
                  <Text style={styles.tableHeaderCell}>Lucro</Text>
                </View>
                {Object.keys(monthlyData).map(monthKey => (
                  <View style={styles.tableRow} key={monthKey}>
                    <Text style={styles.tableCell}>{monthKey}</Text>
                    <Text style={styles.tableCell}>{formatCurrency(monthlyData[monthKey].revenue)}</Text>
                    <Text style={styles.tableCell}>{formatCurrency(monthlyData[monthKey].cost)}</Text>
                    <Text style={styles.tableCell}>{formatCurrency(monthlyData[monthKey].profit)}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#3364f5' }]} onPress={() => router.push('/addVenda')}>
                <Text style={[styles.buttonText, { color: '#fff' }]}>Adicionar Venda</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#fff' }]} onPress={() => router.push('/home')}>
                <Text style={[styles.buttonText, { color: '#000' }]}>Voltar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );  
}

const styles = StyleSheet.create({
  container: {
    
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  salesContainer: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  viewFiltro: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  tableContainer: {
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  table: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    marginBottom: 20,
    paddingBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    padding: 5,
  },
  tableHeaderCell: {
    color: '#fff',
    fontWeight: 'bold',
    width: '25%',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    width: '100%',
  },
  tableCell: {
    color: '#fff',
    width: '25%',
    textAlign: 'center',
  },
  viewBotao: {
    width: '25%',
    alignItems: 'center',
  },
  removeButton: {
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 5,
    width: 'fit-content',
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
  },
});
