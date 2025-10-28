import React, { useState } from 'react';
import { Alert, ScrollView, StatusBar, Platform } from 'react-native';
import { Header, Button, Input, Card } from 'react-native-elements';
import { database } from '../database/database';
import { useTheme } from '../theme/ThemeContext';
import { getColors } from '../theme/colors';

export default function AddNoteScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { isDark } = useTheme();
  const colors = getColors(isDark);

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
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
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
        backgroundColor={colors.header}
      />

      <ScrollView style={{ backgroundColor: colors.background, flex: 1 }}>
        <Card containerStyle={{
          margin: 15,
          borderRadius: 10,
          borderWidth: 0,
          elevation: 2,
          backgroundColor: colors.card
        }}>
          <Input
            placeholder="Заголовок заметки"
            value={title}
            onChangeText={setTitle}
            multiline
            inputStyle={{
              fontSize: 18,
              fontWeight: 'bold',
              textAlignVertical: 'top',
              color: colors.text
            }}
            placeholderTextColor={colors.placeholder}
            containerStyle={{ paddingHorizontal: 0 }}
          />
          
          <Input
            placeholder="Содержание заметки"
            value={content}
            onChangeText={setContent}
            multiline
            inputStyle={{
              fontSize: 16,
              textAlignVertical: 'top',
              minHeight: 300,
              color: colors.text
            }}
            placeholderTextColor={colors.placeholder}
            containerStyle={{ paddingHorizontal: 0 }}
          />
        </Card>
      </ScrollView>
    </>
  );
}

// Стили больше не нужны, используются компоненты React Native Elements
