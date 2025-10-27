import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  Platform,
  View,
  Share,
} from "react-native";
import { Header, Button, Input, Card, Text } from "react-native-elements";
import { database } from "../database/database";

export default function NoteDetailScreen({ navigation, route }) {
  const { note } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const updateNote = async () => {
    if (!title.trim()) {
      Alert.alert("Ошибка", "Введите заголовок заметки");
      return;
    }

    if (!content.trim()) {
      Alert.alert("Ошибка", "Введите содержание заметки");
      return;
    }

    try {
      await database.updateNote(note.id, title.trim(), content.trim());
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось обновить заметку");
    }
  };

  const deleteNote = async () => {
    Alert.alert(
      "Удалить заметку",
      "Вы уверены, что хотите удалить эту заметку?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            try {
              await database.deleteNote(note.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert("Ошибка", "Не удалось удалить заметку");
            }
          },
        },
      ]
    );
  };

  const saveNoteAsFile = async () => {
    try {
      const noteContent = `Заголовок: ${note.title}\n\nСодержание: ${
        note.content
      }\n\nДата создания: ${new Date(note.created_at).toLocaleString(
        "ru-RU"
      )}\nДата изменения: ${new Date(note.updated_at).toLocaleString("ru-RU")}`;

      await Share.share({
        title: `Заметка: ${note.title}`,
        message: noteContent,
      });
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось сохранить заметку как файл");
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
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
          text: "Заметка",
          style: { color: "#fff", fontSize: 20, fontWeight: "bold" },
        }}
        rightComponent={null}
        backgroundColor="#007AFF"
      />

      <ScrollView style={{ backgroundColor: "#f5f5f5", flex: 1 }}>
        <Card
          containerStyle={{
            margin: 15,
            borderRadius: 10,
            borderWidth: 0,
            elevation: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginBottom: 15,
            }}
          >
            {isEditing ? (
              <Button
                icon={{
                  name: "check",
                  size: 24,
                  color: "#007AFF",
                }}
                type="clear"
                onPress={updateNote}
              />
            ) : (
              <>
                <Button
                  icon={{
                    name: "edit",
                    size: 24,
                    color: "#007AFF",
                  }}
                  type="clear"
                  onPress={() => setIsEditing(true)}
                />
                <Button
                  icon={{
                    name: "share",
                    size: 24,
                    color: "#007AFF",
                  }}
                  type="clear"
                  onPress={() => saveNoteAsFile()}
                />
              </>
            )}
            <Button
              icon={{
                name: "delete",
                size: 24,
                color: "#ff3b30",
              }}
              type="clear"
              onPress={deleteNote}
            />
          </View>

          {/* Заголовок занимает всю ширину */}
          {isEditing ? (
            <Input
              value={title}
              onChangeText={setTitle}
              multiline
              inputStyle={{
                fontSize: 24,
                fontWeight: "bold",
                textAlignVertical: "top",
              }}
              containerStyle={{ paddingHorizontal: 0, marginBottom: 15 }}
            />
          ) : (
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 15,
              }}
            >
              {title}
            </Text>
          )}

          {isEditing ? (
            <Input
              value={content}
              onChangeText={setContent}
              multiline
              inputStyle={{
                fontSize: 16,
                textAlignVertical: "top",
                minHeight: 200,
                lineHeight: 24,
              }}
              containerStyle={{ paddingHorizontal: 0 }}
            />
          ) : (
            <Text
              style={{
                fontSize: 16,
                color: "#333",
                lineHeight: 24,
                marginBottom: 20,
              }}
            >
              {content}
            </Text>
          )}

          <Text style={{ fontSize: 12, color: "#999", fontStyle: "italic" }}>
            Создано: {new Date(note.created_at).toLocaleString("ru-RU")}
          </Text>
          {note.updated_at !== note.created_at && (
            <Text style={{ fontSize: 12, color: "#999", fontStyle: "italic" }}>
              Изменено: {new Date(note.updated_at).toLocaleString("ru-RU")}
            </Text>
          )}
        </Card>
      </ScrollView>
    </>
  );
}
