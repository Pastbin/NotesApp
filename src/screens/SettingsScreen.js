import React, { useState, useEffect } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  Platform,
  Share,
  Switch,
} from "react-native";
import { Header, Button, Card, Text, ListItem } from "react-native-elements";
import { database } from "../database/database";
import { useTheme } from "../theme/ThemeContext";
import { getColors } from "../theme/colors";

const SettingsScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const { isDark, toggleTheme } = useTheme();
  const colors = getColors(isDark);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const allNotes = await database.getNotes();
      setNotes(allNotes);
    } catch (error) {
      console.error("Ошибка загрузки заметок:", error);
    }
  };

  const shareAllNotes = async () => {
    try {
      if (notes.length === 0) {
        Alert.alert("Нет заметок", "У вас пока нет заметок для экспорта", [
          { text: "OK" },
        ]);
        return;
      }

      const notesContent = notes
        .map(
          (note) =>
            `Заголовок: ${note.title}\nСодержание: ${
              note.content
            }\nДата создания: ${new Date(note.created_at).toLocaleString(
              "ru-RU"
            )}\nДата изменения: ${new Date(note.updated_at).toLocaleString(
              "ru-RU"
            )}\n\n---\n`
        )
        .join("\n");

      const fullContent = `Мои заметки (всего: ${notes.length})\n\n${notesContent}`;

      await Share.share({
        title: "Мои заметки",
        message: fullContent,
      });
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось поделиться заметками");
    }
  };

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <Header
        leftComponent={
          <Button
            icon={{
              name: "arrow-back",
              size: 24,
              color: "white",
            }}
            type="clear"
            onPress={() => navigation.goBack()}
          />
        }
        centerComponent={{
          text: "Настройки",
          style: { color: "#fff", fontSize: 20, fontWeight: "bold" },
        }}
        backgroundColor={colors.header}
      />

      <ScrollView style={{ backgroundColor: colors.background, flex: 1 }}>
        <Card
          containerStyle={{
            margin: 15,
            borderRadius: 10,
            borderWidth: 0,
            elevation: 2,
            backgroundColor: colors.card,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 20,
              color: colors.text,
            }}
          >
            Внешний вид
          </Text>

          <ListItem
            bottomDivider
            containerStyle={{ backgroundColor: colors.card }}
          >
            <ListItem.Content>
              <ListItem.Title
                style={{ fontWeight: "bold", color: colors.text }}
              >
                Темная тема
              </ListItem.Title>
              <ListItem.Subtitle style={{ color: colors.textSecondary }}>
                Включить темный режим оформления
              </ListItem.Subtitle>
            </ListItem.Content>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isDark ? colors.primary : "#f4f3f4"}
            />
          </ListItem>
        </Card>

        <Card
          containerStyle={{
            margin: 15,
            borderRadius: 10,
            borderWidth: 0,
            elevation: 2,
            backgroundColor: colors.card,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 20,
              color: colors.text,
            }}
          >
            Хранение данных
          </Text>

          <ListItem bottomDivider containerStyle={{ backgroundColor: colors.card }}>
            <ListItem.Content>
              <ListItem.Title style={{ fontWeight: "bold", color: colors.text }}>
                Способы хранения
              </ListItem.Title>
              <ListItem.Subtitle style={{ color: colors.textSecondary }}>
                SQLite база данных
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>

          <ListItem containerStyle={{ backgroundColor: colors.card }}>
            <ListItem.Content>
              <ListItem.Title style={{ fontWeight: "bold", color: colors.text }}>
                Экспорт заметок
              </ListItem.Title>
              <ListItem.Subtitle style={{ color: colors.textSecondary }}>
                Заметки можно экспортировать через системное меню "Поделиться"
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        </Card>

        <Card
          containerStyle={{
            margin: 15,
            borderRadius: 10,
            borderWidth: 0,
            elevation: 2,
            backgroundColor: colors.card,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 20,
              color: colors.text,
            }}
          >
            Управление данными
          </Text>

          <Button
            title="Поделиться всеми заметками"
            type="outline"
            onPress={shareAllNotes}
            containerStyle={{ marginBottom: 10 }}
          />

          <Text
            style={{
              fontSize: 12,
              color: colors.textSecondary,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Всего заметок: {notes.length}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.textSecondary,
              textAlign: "center",
              marginTop: 5,
            }}
          >
            Для экспорта отдельной заметки откройте её и нажмите кнопку
            "Поделиться"
          </Text>
        </Card>

        <Card
          containerStyle={{
            margin: 15,
            borderRadius: 10,
            borderWidth: 0,
            elevation: 2,
            backgroundColor: colors.card,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 20,
              color: colors.text,
            }}
          >
            О приложении
          </Text>

          <ListItem bottomDivider containerStyle={{ backgroundColor: colors.card }}>
            <ListItem.Content>
              <ListItem.Title style={{ fontWeight: "bold", color: colors.text }}>
                Версия
              </ListItem.Title>
              <ListItem.Subtitle style={{ color: colors.textSecondary }}>1.0.0</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>

          <ListItem bottomDivider containerStyle={{ backgroundColor: colors.card }}>
            <ListItem.Content>
              <ListItem.Title style={{ fontWeight: "bold", color: colors.text }}>
                Платформа
              </ListItem.Title>
              <ListItem.Subtitle style={{ color: colors.textSecondary }}>{Platform.OS}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>

          <ListItem containerStyle={{ backgroundColor: colors.card }}>
            <ListItem.Content>
              <ListItem.Title style={{ fontWeight: "bold", color: colors.text }}>
                Разработчик
              </ListItem.Title>
              <ListItem.Subtitle style={{ color: colors.textSecondary }}>Pastbin Alexander</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        </Card>
      </ScrollView>
    </>
  );
};

export default SettingsScreen;
