import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const ResultScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const score = Number(Array.isArray(params.score) ? params.score[0] : params.score);
  const total = Number(Array.isArray(params.total) ? params.total[0] : params.total);
  const questions = params.questions ? JSON.parse(Array.isArray(params.questions) ? params.questions[0] : params.questions) : [];
  const userAnswers = params.userAnswers ? JSON.parse(Array.isArray(params.userAnswers) ? params.userAnswers[0] : params.userAnswers) : [];
  const percentage = Math.round((score / total) * 100);

  // Web-based background image
  const backgroundImage = { uri: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' };

  // Web-based Lottie animations (using URLs from LottieFiles)
  const getAnimationUrl = () => {
    if (percentage === 100) return 'https://assets6.lottiefiles.com/packages/lf20_ollj3omi.json';
    if (percentage >= 80) return 'https://assets6.lottiefiles.com/packages/lf20_ye1rljef.json';
    if (percentage >= 60) return 'https://assets6.lottiefiles.com/packages/lf20_obhph3sh.json';
    return 'https://assets6.lottiefiles.com/packages/lf20_ypvsrqxh.json';
  };

  const getMessage = () => {
    if (percentage === 100) return 'Perfect Score! You\'re a genius!';
    if (percentage >= 80) return 'Excellent! You know your stuff!';
    if (percentage >= 60) return 'Good job! Keep learning!';
    if (percentage >= 40) return 'Not bad! Try again!';
    return 'Keep practicing! You\'ll get better!';
  };

  const getColor = () => {
    if (percentage === 100) return ['#4CAF50', '#2E7D32'];
    if (percentage >= 80) return ['#2196F3', '#1565C0'];
    if (percentage >= 60) return ['#FFC107', '#FF8F00'];
    return ['#FF5722', '#E64A19'];
  };

  // For the trophy icon (using web image)
  const getTrophyImage = () => {
    if (percentage === 100) return { uri: 'https://cdn-icons-png.flaticon.com/512/3132/3132735.png' };
    if (percentage >= 80) return { uri: 'https://cdn-icons-png.flaticon.com/512/3132/3132739.png' };
    return { uri: 'https://cdn-icons-png.flaticon.com/512/3132/3132733.png' };
  };

  const shareResults = async () => {
    try {
      await Share.share({
        message: `I scored ${score}/${total} (${percentage}%) on the Trivia Challenge! Can you beat me?`,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log('Unknown error', error);
      }
    }
  };

  const navigateToReview = () => {
    router.push({
      pathname: '/review',
      params: {
        questions: JSON.stringify(questions),
        userAnswers: JSON.stringify(userAnswers),
        score,
        total
      },
    });
  };

  return (
    <ImageBackground 
      source={backgroundImage}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <Animatable.View 
            animation="bounceIn"
            duration={1500}
            style={styles.resultCard}
          >
            <Text style={styles.title}>Quiz Results</Text>
            
            <View style={styles.animationContainer}>
              {/* Trophy image as fallback if Lottie doesn't work */}
              <Image 
                source={getTrophyImage()}
                style={styles.trophyImage}
                resizeMode="contain"
              />
              
              {/* Lottie animation from URL */}
              <LottieView
                source={{ uri: getAnimationUrl() }}
                autoPlay
                loop
                style={styles.animation}
              />
            </View>

            <Text style={styles.message}>{getMessage()}</Text>

            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>
                {score} / {total}
              </Text>
              <Text style={styles.percentageText}>
                {percentage}%
              </Text>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                <Text style={styles.detailText}>Correct: {score}</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialIcons name="cancel" size={24} color="#F44336" />
                <Text style={styles.detailText}>Wrong: {total - score}</Text>
              </View>
            </View>

            {/* Additional stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <MaterialIcons name="star" size={20} color="#FFD700" />
                <Text style={styles.statText}>Accuracy: {percentage}%</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialIcons name="timer" size={20} color="#6200ee" />
                <Text style={styles.statText}>Questions: {total}</Text>
              </View>
            </View>
          </Animatable.View>

          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            delay={500}
          >
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => router.replace('/')} // Go to Home
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={getColor()}
                style={styles.buttonGradient}
              >
                <MaterialIcons name="replay" size={24} color="white" />
                <Text style={styles.buttonText}>Try Again</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Review Answers button */}
            <TouchableOpacity 
              style={[styles.button, { marginTop: 15 }]} 
              onPress={navigateToReview}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#6200ee', '#3700b3']}
                style={styles.buttonGradient}
              >
                <MaterialIcons name="list" size={24} color="white" />
                <Text style={styles.buttonText}>Review Answers</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Share button */}
            <TouchableOpacity 
              style={[styles.button, { marginTop: 15 }]} 
              onPress={shareResults}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#6200ee', '#3700b3']}
                style={styles.buttonGradient}
              >
                <MaterialIcons name="share" size={24} color="white" />
                <Text style={styles.buttonText}>Share Results</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    padding: 25,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 30,
    padding: 30,
    width: '100%',
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#6a11cb',
    marginBottom: 5,
    textAlign: 'center',
    letterSpacing: 1,
  },
  animationContainer: {
    width: 180,
    height: 180,
    marginVertical: 15,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  trophyImage: {
    width: 90,
    height: 90,
    zIndex: 1,
  },
  message: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 28,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#333',
  },
  percentageContainer: {
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 10,
    elevation: 5,
  },
  percentageText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 25,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 20,
    marginLeft: 10,
    color: '#333',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#555',
    fontWeight: '600',
  },
  buttonsContainer: {
    width: '100%',
  },
  button: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 8,
  },
  shareButton: {
    backgroundColor: 'transparent',
  },
  buttonGradient: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
    letterSpacing: 0.5,
  },
});

export default ResultScreen; 