import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { decode } from 'he';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const QuizScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const config = {
    amount: params.amount || 5,
    difficulty: params.difficulty || 'easy',
    category: params.category || undefined,
  };
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress] = useState(new Animated.Value(0));
  const [userAnswers, setUserAnswers] = useState([]); // Track user answers
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Premium background image
  const backgroundImage = { uri: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80' };

  useEffect(() => {
    Animated.timing(progress, {
      toValue: ((currentIndex + 1) / config.amount) * 100,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
    
    // Fade animation for question change
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        delay: 200,
      }),
    ]).start();
  }, [currentIndex]);

  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const tokenRes = await axios.get(
          'https://opentdb.com/api_token.php?command=request'
        );
        const token = tokenRes.data.token;

        const { amount, difficulty, category } = config;
        const url = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&category=${category}&type=multiple&token=${token}`;

        const res = await axios.get(url);
        const formatted = res.data.results.map((q) => ({
          question: decode(q.question),
          correct: decode(q.correct_answer),
          options: shuffle([q.correct_answer, ...q.incorrect_answers].map(decode)),
        }));

        setQuestions(formatted);
        setLoading(false);
      } catch (err) {
        console.error('❌ Failed to fetch quiz questions:', err);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleSelect = (option) => {
    // Record user answer
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentIndex] = option;
    setUserAnswers(newUserAnswers);
    
    setSelected(option);
    if (option === questions[currentIndex].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setSelected(null);
      } else {
        router.replace({
          pathname: '/result',
          params: {
            score: score + (option === questions[currentIndex].correct ? 1 : 0),
            total: questions.length,
            questions: JSON.stringify(questions),
            userAnswers: JSON.stringify(newUserAnswers),
          },
        });
      }
    }, 800);
  };

  if (loading || !questions[currentIndex]) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#6a11cb', '#2575fc']}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading questions...</Text>
        </LinearGradient>
      </View>
    );
  }

  const question = questions[currentIndex];
  const progressWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <ImageBackground 
      source={backgroundImage}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView 
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.progressBarContainer}>
              <Text style={styles.progressText}>
                Question {currentIndex + 1} of {questions.length}
              </Text>
              <View style={styles.progressBarBackground}>
                <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
              </View>
            </View>

            <Animated.View 
              style={[styles.questionContainer, { opacity: fadeAnim }]}
            >
              <Text style={styles.questionCounter}>
                Question {currentIndex + 1}
              </Text>
              <Text style={styles.question}>
                {question.question}
              </Text>
            </Animated.View>

            <View style={styles.optionsContainer}>
              {question.options.map((opt, idx) => (
                <Animatable.View 
                  key={idx} 
                  animation="fadeInUp"
                  duration={600}
                  delay={idx * 80}
                >
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      selected && {
                        backgroundColor: 
                          opt === question.correct ? '#4CAF50' : 
                          opt === selected ? '#f44336' : 'rgba(255,255,255,0.95)',
                        borderColor: 
                          opt === question.correct ? '#4CAF50' : 
                          opt === selected ? '#f44336' : '#6a11cb',
                      },
                    ]}
                    onPress={() => handleSelect(opt)}
                    disabled={!!selected}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionNumber}>
                      <Text style={styles.optionNumberText}>{idx + 1}</Text>
                    </View>
                    <Text style={[
                      styles.optionText,
                      selected && {
                        color: 
                          opt === question.correct || opt === selected ? '#fff' : '#333',
                      }
                    ]}>
                      {opt}
                    </Text>
                    {selected && opt === question.correct && (
                      <MaterialIcons name="check-circle" size={28} color="#fff" style={styles.optionIcon} />
                    )}
                    {selected && opt === selected && opt !== question.correct && (
                      <MaterialIcons name="cancel" size={28} color="#fff" style={styles.optionIcon} />
                    )}
                  </TouchableOpacity>
                </Animatable.View>
              ))}
            </View>
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
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 25,
    paddingBottom: 40,
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
  progressBarContainer: {
    marginBottom: 30,
    paddingTop: 15,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6a11cb',
    borderRadius: 6,
  },
  progressText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  questionContainer: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  questionCounter: {
    fontSize: 16,
    color: '#6a11cb',
    marginBottom: 12,
    fontWeight: '700',
  },
  question: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    lineHeight: 32,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 18,
    marginVertical: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#6a11cb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
  },
  optionNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6a11cb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionNumberText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  optionText: {
    fontSize: 18,
    flex: 1,
    fontWeight: '500',
  },
  optionIcon: {
    marginLeft: 10,
  },
});

export default QuizScreen; 