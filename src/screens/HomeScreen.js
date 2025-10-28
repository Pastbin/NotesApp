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
import { useTheme } from "../theme/ThemeContext";
import { getColors } from "../theme/colors";

export default function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const { isDark } = useTheme();
  const colors = getColors(isDark);

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
        backgroundColor: colors.card,
      }}
    >
      <ListItem
        key={item.id}
        onPress={() => navigation.navigate("NoteDetail", { note: item })}
        bottomDivider
        containerStyle={{ backgroundColor: colors.card }}
      >
        <ListItem.Content>
          <ListItem.Title
            style={{
              fontWeight: "bold",
              fontSize: 18,
              marginBottom: 5,
              color: colors.text
            }}
          >
            {item.title}
          </ListItem.Title>
          <ListItem.Subtitle
            numberOfLines={2}
            style={{
              color: colors.textSecondary,
              marginBottom: 8
            }}
          >
            {item.content}
          </ListItem.Subtitle>
          <ListItem.Subtitle style={{
            color: colors.textTertiary,
            fontSize: 12
          }}>
            {new Date(item.created_at).toLocaleDateString("ru-RU")}
          </ListItem.Subtitle>
        </ListItem.Content>
        <Button
          icon={{
            name: "delete",
            size: 24,
            color: colors.error,
          }}
          type="clear"
          onPress={() => deleteNote(item.id)}
        />
      </ListItem>
    </Card>
  );

  return (
    <>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
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
        backgroundColor={colors.header}
      />

      <View style={[styles.searchContainer, { backgroundColor: colors.searchBackground }]}>
        <TextInput
          style={[styles.searchInput, {
            backgroundColor: colors.searchInput,
            color: colors.text,
          }]}
          placeholder="Поиск заметок..."
          placeholderTextColor={colors.placeholder}
          onChangeText={setSearchText}
          value={searchText}
        />
        {searchText && filteredNotes.length === 0 && (
          <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>
            Заметок не найдено
          </Text>
        )}
      </View>

      {notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Пока нет ни одной заметки
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
            Нажмите на кнопку "+" чтобы создать первую заметку
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          renderItem={renderNote}
          style={{ backgroundColor: colors.background, flex: 1 }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
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
    fontSize: 16,
    marginTop: 10,
    fontStyle: "italic",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "500",
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
