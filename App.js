import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [userId, setUserId] = useState('');

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!response.ok) {
        throw new Error('Blad serwera: ' + response.status);
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!title.trim() || !body.trim() || !userId.trim()) {
      Alert.alert('Blad', 'Wypelnij wszystkie pola');
      return;
    }

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          title: title,
          body: body,
          userId: parseInt(userId, 10),
        }),
      });

      if (!response.ok) {
        throw new Error('Blad wysylania: ' + response.status);
      }

      const newPost = await response.json();
      
      Alert.alert(
        'Sukces', 
        'Dodano post o ID: ' + newPost.id
      );

      setTitle('');
      setBody('');
      setUserId('');
      setPosts((prev) => [newPost, ...prev]);

    } catch (err) {
      Alert.alert('Blad', err.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemMeta}>ID: {item.id} | User: {item.userId}</Text>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemBody}>{item.body}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Nowy wpis</Text>
          <TextInput
            style={styles.input}
            placeholder="Tytul"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Tresc"
            value={body}
            onChangeText={setBody}
          />
          <TextInput
            style={styles.input}
            placeholder="User ID"
            value={userId}
            onChangeText={setUserId}
            keyboardType="numeric"
          />
          <Pressable style={styles.btn} onPress={handleCreatePost}>
            <Text style={styles.btnText}>Wyslij</Text>
          </Pressable>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Posty</Text>
          
          {isLoading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable style={styles.retryBtn} onPress={fetchPosts}>
                <Text style={styles.btnText}>Ponow</Text>
              </Pressable>
            </View>
          )}

          {!isLoading && !error && (
            <FlatList
              data={posts}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listSection: {
    flex: 1,
    padding: 15,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 5,
  },
  itemMeta: {
    fontSize: 11,
    color: '#666',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  itemBody: {
    fontSize: 13,
    color: '#333',
  },
  errorContainer: {
    padding: 15,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  retryBtn: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 4,
  }
});
