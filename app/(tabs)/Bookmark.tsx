import { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ActivityIndicator, 
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';


const BOOKMARKS_KEY = 'saved_job_bookmarks';

export default function Bookmarks() {
  const navigation = useNavigation();
  const [bookmarkedJobs, setBookmarkedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load bookmarks with focus listener
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const savedBookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
        if (savedBookmarks) {
          const bookmarksObj = JSON.parse(savedBookmarks);
          const bookmarksArray = Object.values(bookmarksObj);
          setBookmarkedJobs(bookmarksArray);
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
    const unsubscribe = navigation.addListener('focus', loadBookmarks);
    return unsubscribe;
  }, [navigation]);

  const removeBookmark = async (jobId: string) => {
    try {
      const savedBookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
      if (savedBookmarks) {
        const bookmarksObj = JSON.parse(savedBookmarks);
        if (bookmarksObj[jobId]) {
          delete bookmarksObj[jobId];
          await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarksObj));
          setBookmarkedJobs(Object.values(bookmarksObj));
          
          Toast.show({
            type: 'success',
            text1: 'Bookmark removed',
            position: 'bottom',
          });
        }
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to remove bookmark',
        position: 'bottom',
      });
    }
  };

  const handleJobPress = (job: any) => {
    navigation.navigate('JobDetails', { 
      job: JSON.stringify(job) 
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={[styles.headerTitle, { color: '#7C3AED' }]}>Bookmarked Jobs</ThemedText>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : bookmarkedJobs.length === 0 ? (
        <ThemedView style={[styles.noJobsContainer,{backgroundColor: '#7C3AED'}]}>
          <ThemedText style={styles.noJobsText}>No bookmarked jobs</ThemedText>
        </ThemedView>
      ) : (
        <View style={styles.jobsList}>
          {bookmarkedJobs.map((job, index) => {
            const tag = job.job_tags?.[0] || {};
            const bgColor = tag.bg_color || '#E7F3FE';
            const titleColor = '#2b2b2b';
            const contentColor = '#7a7979';
            const iconColor = '#475569';

            return (
              <View key={index} style={[styles.jobContainer, { backgroundColor: bgColor }]}>
                <TouchableOpacity onPress={() => handleJobPress(job)}>
                  <View style={styles.headerRow}>
                    <Text style={[styles.title, { color: titleColor }]}>{job.title}</Text>
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
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeBookmark(job.id)}
                >
                  <MaterialIcons name="bookmark-remove" size={24} color="#FF3B30" />
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
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
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  jobsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  loader: {
    marginTop: 20,
  },
  jobContainer: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    flex: 1,
  },
  noJobsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noJobsText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#FF3B30',
    marginLeft: 8,
    fontWeight: '600',
  },
});