import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Alert, FlatList, Platform, StatusBar, TextInput, View, StyleSheet, Text } from "react-native";
import {
  Header,
  Card,
  ListItem,
  Button,
} from "react-native-elements";
import { database } from "../database/database";

export default function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      loadNotes();
    }, [])
  );

  const loadNotes = async () => {
    try {
      const allNotes = await database.getNotes();
      setNotes(allNotes);
    } catch (error) {
      console.error(error);
      Alert.alert("Ошибка", "Не удалось загрузить заметки");
    }
  };

  const deleteNote = async (id) => {
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
              await database.deleteNote(id);
              loadNotes();
            } catch (error) {
              Alert.alert("Ошибка", "Не удалось удалить заметку");
            }
          },
        },
      ]
    );
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchText.toLowerCase()) ||
      note.content.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderNote = ({ item }) => (
    <Card
      containerStyle={{
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
        borderWidth: 0,
        elevation: 2,
      }}
    >
      <ListItem
        key={item.id}
        onPress={() => navigation.navigate("NoteDetail", { note: item })}
        bottomDivider
      >
        <ListItem.Content>
          <ListItem.Title
            style={{ fontWeight: "bold", fontSize: 18, marginBottom: 5 }}
          >
            {item.title}
          </ListItem.Title>
          <ListItem.Subtitle
            numberOfLines={2}
            style={{ color: "#666", marginBottom: 8 }}
          >
            {item.content}
          </ListItem.Subtitle>
          <ListItem.Subtitle style={{ color: "#999", fontSize: 12 }}>
            {new Date(item.created_at).toLocaleDateString("ru-RU")}
          </ListItem.Subtitle>
        </ListItem.Content>
        <Button
          icon={{
            name: "delete",
            size: 24,
            color: "#ff3b30",
          }}
          type="clear"
          onPress={() => deleteNote(item.id)}
        />
      </ListItem>
    </Card>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header
        leftComponent={
          <Button
            icon={{
              name: "settings",
              size: 24,
              color: "white",
            }}
            type="clear"
            onPress={() => navigation.navigate("Settings")}
          />
        }
        centerComponent={{
          text: "Мои заметки",
          style: { color: "#fff", fontSize: 20, fontWeight: "bold" },
        }}
        rightComponent={
          <Button
            icon={{
              name: "add",
              size: 24,
              color: "white",
            }}
            type="clear"
            onPress={() => navigation.navigate("AddNote")}
          />
        }
        backgroundColor="#007AFF"
      />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск заметок..."
          onChangeText={setSearchText}
          value={searchText}
        />
        {searchText && filteredNotes.length === 0 && (
          <Text style={styles.noResultsText}>
            Заметок не найдено
          </Text>
        )}
      </View>

      <FlatList
        data={filteredNotes}
        renderItem={renderNote}
        style={{ backgroundColor: "#f5f5f5", flex: 1 }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  noResultsText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 10,
    fontStyle: "italic",
  },
});
