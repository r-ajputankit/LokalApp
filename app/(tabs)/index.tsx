import { useEffect, useState } from 'react';
import { 
  ScrollView,
  StyleSheet, 
  View, 
  Text, 
  ActivityIndicator, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://testapi.getlokalapp.com/common/jobs?page=1';
const BOOKMARKS_KEY = 'saved_job_bookmarks';

export default function Jobs() {
  const navigation = useNavigation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const savedBookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
        if (savedBookmarks) {
          setBookmarkedJobs(JSON.parse(savedBookmarks));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };

    loadBookmarks();
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setJobs(data.results || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      Alert.alert('Error', 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (job: any) => {
    try {
      const newBookmarks = {...bookmarkedJobs};
      
      if (newBookmarks[job.id]) {
        delete newBookmarks[job.id];
      } else {
        newBookmarks[job.id] = job;
      }
      
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
      setBookmarkedJobs(newBookmarks);
      
    } catch (error) {
      console.error('Error saving bookmark:', error);
      Alert.alert('Error', 'Failed to save bookmark');
    }
  };

  const handleJobPress = (job: any) => {
    navigation.navigate('JobDetails', { 
      job: JSON.stringify(job) 
    });
  };

  // Filter out jobs without titles
  const validJobs = jobs.filter(job => job.title && job.title.trim() !== '');

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#F8FAFC' }]}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>Job Listings</ThemedText>
        <HelloWave />
      </ThemedView>
      
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0E56A8" />
        </View>
      ) : validJobs.length === 0 ? (
        <ThemedView style={styles.noJobsContainer}>
          <ThemedText style={styles.noJobsText}>No job listings available</ThemedText>
        </ThemedView>
      ) : (
        <View style={styles.jobsList}>
          {validJobs.map((job, index) => {
            const tag = job.job_tags?.[0] || {};
            const bgColor = tag.bg_color || '#E7F3FE';
            const titleColor = '#0E56A8';
            const contentColor = '#334155';
            const iconColor = '#475569';
            const isBookmarked = !!bookmarkedJobs[job.id];

            return (
              <TouchableOpacity
                key={index}
                style={[styles.jobContainer, { 
                  backgroundColor: '#FFFFFF',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }]}
                onPress={() => handleJobPress(job)}
              >
                {/* Colored header strip */}
                <View style={[styles.jobHeaderStrip, { backgroundColor: bgColor }]} />
                
                <View style={styles.jobContent}>
                  <View style={styles.headerRow}>
                    <Text style={[styles.title, { color: titleColor }]}>{job.title}</Text>
                    <TouchableOpacity 
                      onPress={(e) => {
                        e.stopPropagation();
                        toggleBookmark(job);
                      }}
                      style={styles.bookmarkButton}
                    >
                      <MaterialIcons 
                        name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
                        size={24} 
                        color={isBookmarked ? '#FFD700' : titleColor} 
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.row}>
                    <Entypo name="location-pin" size={20} color={iconColor} />
                    <Text style={[styles.infoText, { color: contentColor }]}>
                      {job.primary_details?.Place}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Entypo name="wallet" size={17} color={iconColor} />
                    <Text style={[styles.infoText, { color: contentColor }]}>
                      {job.primary_details?.Salary === '-' ? 'Not Specified' : job.primary_details?.Salary}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <FontAwesome name="whatsapp" size={17} color="#25D366" />
                    <Text style={[styles.infoText, { color: contentColor }]}>
                      {job.whatsapp_no}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    marginRight: 8,
    color: '#0E56A8',
  },
  jobsList: {
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  jobContainer: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  jobHeaderStrip: {
    height: 4,
    width: '100%',
  },
  jobContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 15,
    marginLeft: 8,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0E56A8',
    flex: 1,
  },
  bookmarkButton: {
    padding: 4,
  },
  noJobsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
  },
  noJobsText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
});