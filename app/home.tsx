import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const [numQuestions, setNumQuestions] = useState('10');
  const [difficulty, setDifficulty] = useState('easy');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const router = useRouter();

  // Premium background image
  const backgroundImage = { uri: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80' };
  // Premium app logo
  const logoImage = { uri: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png' };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://opentdb.com/api_category.php');
        setCategories(res.data.trivia_categories);
        setSelectedCategory(res.data.trivia_categories[0]?.id.toString());
        setLoading(false);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Unable to load categories.');
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const startQuiz = () => {
    if (!numQuestions || isNaN(numQuestions) || parseInt(numQuestions) <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid number of questions.');
      return;
    }
    router.push({
      pathname: '/quiz',
      params: {
        amount: numQuestions,
        difficulty: difficulty,
        category: selectedCategory,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#6a11cb', '#2575fc']}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
      blurRadius={1}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* Professional Top Bar */}
          <View style={styles.topBar}>
            <Text style={styles.topBarTitle}>Quiz App</Text>
            <TouchableOpacity style={styles.settingsButton}>
              <MaterialIcons name="settings" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <Animatable.View
              animation="fadeInDown"
              duration={1200}
              style={styles.header}
            >
              <Image
                source={logoImage}
                style={styles.logo}
              />
              <Text style={styles.heading}>Test Your Knowledge</Text>
              <Text style={styles.subHeading}>Challenge yourself with our quiz</Text>
            </Animatable.View>
            <Animatable.View
              animation="fadeInUp"
              duration={1000}
              delay={300}
              style={styles.formContainer}
            >
              <View style={styles.inputContainer}>
                <MaterialIcons name="format-list-numbered" size={28} color="#6a11cb" />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Number of Questions"
                  placeholderTextColor="#888"
                  value={numQuestions}
                  onChangeText={setNumQuestions}
                />
              </View>
              <View style={styles.labelContainer}>
                <MaterialIcons name="speed" size={20} color="#6a11cb" />
                <Text style={styles.label}>Select Difficulty:</Text>
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={difficulty}
                  onValueChange={(value) => setDifficulty(value)}
                  style={styles.picker}
                  dropdownIconColor="#6a11cb"
                >
                  <Picker.Item label="Easy" value="easy" style={styles.pickerItem} />
                  <Picker.Item label="Medium" value="medium" style={styles.pickerItem} />
                  <Picker.Item label="Hard" value="hard" style={styles.pickerItem} />
                </Picker>
              </View>
              <View style={styles.labelContainer}>
                <MaterialIcons name="category" size={20} color="#6a11cb" />
                <Text style={styles.label}>Select Category:</Text>
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value)}
                  style={styles.picker}
                  dropdownIconColor="#6a11cb"
                >
                  {categories.map((cat) => (
                    <Picker.Item
                      key={cat.id}
                      label={cat.name}
                      value={cat.id.toString()}
                      style={styles.pickerItem}
                    />
                  ))}
                </Picker>
              </View>
              <Animatable.View
                animation="pulse"
                iterationCount="infinite"
                duration={2000}
              >
                <TouchableOpacity
                  style={styles.button}
                  onPress={startQuiz}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#6a11cb', '#2575fc']}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.buttonText}>START QUIZ</Text>
                    <MaterialIcons name="arrow-forward" size={26} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
              </Animatable.View>
            </Animatable.View>
          </ScrollView>
          
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    padding: 0,
  },
  // Professional Top Bar Styles
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(30, 30, 46, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  topBarTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  settingsButton: {
    padding: 8,
  },
  // Professional Tab Bar Styles
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(30, 30, 46, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#444',
    paddingVertical: 12,
  },
  tabItem: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    width: width * 0.28,
  },
  activeTab: {
    backgroundColor: 'rgba(106, 17, 203, 0.7)',
  },
  tabText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '700',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 80,
    padding: 25,
    paddingTop: 15,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 25,
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 10,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 15,
    tintColor: '#fff',
  },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'sans-serif-condensed',
    letterSpacing: 1,
  },
  subHeading: {
    fontSize: 16,
    color: '#e0e0ff',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 25,
    padding: 30,
    elevation: 15,
    shadowColor: '#6a11cb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#6a11cb',
    marginBottom: 30,
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 18,
    marginLeft: 12,
    color: '#333',
    fontWeight: '500',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  picker: {
    height: 56,
    color: '#333',
    fontSize: 18,
  },
  pickerItem: {
    fontSize: 18,
    fontWeight: '500',
  },
  button: {
    marginTop: 30,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
  },
  buttonGradient: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginRight: 12,
    letterSpacing: 0.5,
  },
});

export default HomeScreen;