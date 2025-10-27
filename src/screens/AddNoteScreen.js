import React, { useState } from 'react';
import { Alert, ScrollView, StatusBar, Platform } from 'react-native';
import { Header, Button, Input, Card } from 'react-native-elements';
import { database } from '../database/database';

export default function AddNoteScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const saveNote = async () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Введите заголовок заметки');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Ошибка', 'Введите содержание заметки');
      return;
    }

    try {
      await database.addNote(title.trim(), content.trim());
      navigation.goBack();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить заметку');
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header
        leftComponent={
          <Button
            icon={{
              name: 'arrow-back',
              size: 24,
              color: 'white',
            }}
            type="clear"
            onPress={() => navigation.goBack()}
          />
        }
        centerComponent={{ text: 'Новая заметка', style: { color: '#fff', fontSize: 20, fontWeight: 'bold' } }}
        rightComponent={
          <Button
            icon={{
              name: 'check',
              size: 24,
              color: 'white',
            }}
            type="clear"
            onPress={saveNote}
          />
        }
        backgroundColor="#007AFF"
      />

      <ScrollView style={{ backgroundColor: '#f5f5f5', flex: 1 }}>
        <Card containerStyle={{ margin: 15, borderRadius: 10, borderWidth: 0, elevation: 2 }}>
          <Input
            placeholder="Заголовок заметки"
            value={title}
            onChangeText={setTitle}
            multiline
            inputStyle={{ fontSize: 18, fontWeight: 'bold', textAlignVertical: 'top' }}
            containerStyle={{ paddingHorizontal: 0 }}
          />
          
          <Input
            placeholder="Содержание заметки"
            value={content}
            onChangeText={setContent}
            multiline
            inputStyle={{ fontSize: 16, textAlignVertical: 'top', minHeight: 300 }}
            containerStyle={{ paddingHorizontal: 0 }}
          />
        </Card>
      </ScrollView>
    </>
  );
}

// Стили больше не нужны, используются компоненты React Native Elements
