import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, StatusBar, Platform, Share } from 'react-native';
import { Header, Button, Card, Text, ListItem } from 'react-native-elements';
import { database } from '../database/database';

const SettingsScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const allNotes = await database.getNotes();
      setNotes(allNotes);
    } catch (error) {
      console.error('Ошибка загрузки заметок:', error);
    }
  };

  const shareAllNotes = async () => {
    try {
      if (notes.length === 0) {
        Alert.alert(
          'Нет заметок',
          'У вас пока нет заметок для экспорта',
          [{ text: 'OK' }]
        );
        return;
      }

      const notesContent = notes.map(note => 
        `Заголовок: ${note.title}\nСодержание: ${note.content}\nДата создания: ${new Date(note.created_at).toLocaleString('ru-RU')}\nДата изменения: ${new Date(note.updated_at).toLocaleString('ru-RU')}\n\n---\n`
      ).join('\n');

      const fullContent = `Мои заметки (всего: ${notes.length})\n\n${notesContent}`;

      await Share.share({
        title: 'Мои заметки',
        message: fullContent,
      });
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось поделиться заметками');
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
        centerComponent={{
          text: 'Настройки',
          style: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
        }}
        backgroundColor="#007AFF"
      />

      <ScrollView style={{ backgroundColor: '#f5f5f5', flex: 1 }}>
        <Card containerStyle={{ margin: 15, borderRadius: 10, borderWidth: 0, elevation: 2 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333' }}>
            Хранение данных
          </Text>
          
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title style={{ fontWeight: 'bold' }}>Способы хранения</ListItem.Title>
              <ListItem.Subtitle>
                SQLite база данных
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>

          <ListItem>
            <ListItem.Content>
              <ListItem.Title style={{ fontWeight: 'bold' }}>Экспорт заметок</ListItem.Title>
              <ListItem.Subtitle>
                Заметки можно экспортировать через системное меню "Поделиться"
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        </Card>

        <Card containerStyle={{ margin: 15, borderRadius: 10, borderWidth: 0, elevation: 2 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333' }}>
            Управление данными
          </Text>
          
          <Button
            title="Поделиться всеми заметками"
            type="outline"
            onPress={shareAllNotes}
            containerStyle={{ marginBottom: 10 }}
          />
          
          <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', marginTop: 10 }}>
            Всего заметок: {notes.length}
          </Text>
          <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', marginTop: 5 }}>
            Для экспорта отдельной заметки откройте её и нажмите кнопку "Поделиться"
          </Text>
        </Card>

        <Card containerStyle={{ margin: 15, borderRadius: 10, borderWidth: 0, elevation: 2 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333' }}>
            О приложении
          </Text>
          
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title style={{ fontWeight: 'bold' }}>Версия</ListItem.Title>
              <ListItem.Subtitle>1.0.0</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>

          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title style={{ fontWeight: 'bold' }}>Платформа</ListItem.Title>
              <ListItem.Subtitle>{Platform.OS}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>

          <ListItem>
            <ListItem.Content>
              <ListItem.Title style={{ fontWeight: 'bold' }}>Разработчик</ListItem.Title>
              <ListItem.Subtitle>Pastbin Alexander</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        </Card>
      </ScrollView>
    </>
  );
};

export default SettingsScreen;