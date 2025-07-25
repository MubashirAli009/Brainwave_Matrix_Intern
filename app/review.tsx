import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
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

const ReviewScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const questions = params.questions ? JSON.parse(params.questions) : [];
  const userAnswers = params.userAnswers ? JSON.parse(params.userAnswers) : [];
  const score = Number(params.score);
  const total = Number(params.total);
  const percentage = Math.round((score / total) * 100);
  
  // Premium background image
  const backgroundImage = { uri: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80' };

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
          <Animatable.View 
            animation="fadeInDown"
            duration={800}
            style={styles.header}
          >
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <MaterialIcons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Review Answers</Text>
            <Text style={styles.scoreText}>{score}/{total}</Text>
          </Animatable.View>

          <ScrollView 
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.correct;
              
              return (
                <Animatable.View 
                  key={index} 
                  animation="fadeInUp"
                  duration={600}
                  delay={index * 100}
                  style={styles.questionCard}
                >
                  <Text style={styles.questionNumber}>Question {index + 1}</Text>
                  <Text style={styles.questionText}>{question.question}</Text>
                  
                  <View style={styles.optionsContainer}>
                    {question.options.map((option, optIndex) => {
                      const isUserAnswer = option === userAnswer;
                      const isCorrectOption = option === question.correct;
                      
                      return (
                        <View 
                          key={optIndex}
                          style={[
                            styles.optionReview,
                            isCorrectOption && styles.correctOption,
                            isUserAnswer && !isCorrect && styles.incorrectOption,
                          ]}
                        >
                          <View style={styles.optionMarker}>
                            {isCorrectOption && (
                              <MaterialIcons name="check" size={20} color="#4CAF50" />
                            )}
                            {isUserAnswer && !isCorrect && (
                              <MaterialIcons name="close" size={20} color="#F44336" />
                            )}
                          </View>
                          <Text style={[
                            styles.optionTextReview,
                            (isCorrectOption || (isUserAnswer && !isCorrect)) && 
                              { color: '#fff' }
                          ]}>
                            {option}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                  
                  {!isCorrect && (
                    <View style={styles.feedbackContainer}>
                      <Text style={styles.feedbackText}>
                        <Text style={{ fontWeight: 'bold' }}>Your answer:</Text> {userAnswer}
                      </Text>
                      <Text style={styles.feedbackText}>
                        <Text style={{ fontWeight: 'bold' }}>Correct answer:</Text> {question.correct}
                      </Text>
                    </View>
                  )}
                </Animatable.View>
              );
            })}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderBottomWidth: 1,
    borderBottomColor: '#6a11cb',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#6a11cb',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  questionCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6a11cb',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    lineHeight: 26,
  },
  optionsContainer: {
    marginBottom: 10,
  },
  optionReview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  correctOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },
  incorrectOption: {
    backgroundColor: '#F44336',
    borderColor: '#D32F2F',
  },
  optionMarker: {
    width: 30,
    alignItems: 'center',
    marginRight: 10,
  },
  optionTextReview: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  feedbackContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#6a11cb',
  },
  feedbackText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
});

export default ReviewScreen; 