import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { theme } from "../theme";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { useEffect, useState } from "react";
import { getFromStorage, saveToStorage } from "./utils/storage";

const storageKey = "taskly"

type ShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
  lastUpdatedTimestamp: number;
};

export default function App() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([]);
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchInitial = async() => {
      const data = await getFromStorage(storageKey)
      if (data) {
        setShoppingList(data);
      }
    };
    fetchInitial();
  }, [])

  const handleSubmit = () => {
    if (value) {
      const newShoppingList = [
        { id: new Date().toISOString(), name: value, lastUpdatedTimestamp: Date.now() },
        ...shoppingList,
      ];
      saveToStorage(storageKey, shoppingList)
      setShoppingList(newShoppingList);
      setValue(undefined);
    }
  };

  const handleDelete = (id: string) => {
    const newShoppingList = shoppingList.filter(item => item.id !== id)
    saveToStorage(storageKey, shoppingList)
    setShoppingList(newShoppingList);
  }

  const handleComplete = (id: string) => {
    const newShoppingList = shoppingList.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          completedAtTimestamp: item.completedAtTimestamp
            ? undefined
            : Date.now(),
          lastUpdatedTimestamp: Date.now(),
        }
      }
      return item;
    })
    saveToStorage(storageKey, shoppingList)
    setShoppingList(newShoppingList);
  }

  return (
    <FlatList
      data={orderList(shoppingList)}
      stickyHeaderIndices={[0]}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      ListEmptyComponent={
        <View style={styles.listEmptyContainer}>
          <Text>Your shopping list is empty</Text>
        </View>
      }
      ListHeaderComponent={
        <TextInput
          value={value}
          style={styles.textInput}
          onChangeText={setValue}
          placeholder="E.g Coffee"
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
        />
      }
      renderItem={({ item }) => {
        return <ShoppingListItem
        name={item.name}
        key={item.id}
        onDelete={() => handleDelete(item.id)}
        onToggleComplete={() => handleComplete(item.id)}
        isCompleted={Boolean(item.completedAtTimestamp)}
      />
      }}
    />
  );
}

function orderList(shoppingList: ShoppingListItemType[]) {
  return shoppingList.sort((a, b) => {
    if (a.completedAtTimestamp && b.completedAtTimestamp) {
      return b.completedAtTimestamp - a.completedAtTimestamp
    }
    if (a.completedAtTimestamp && !b.completedAtTimestamp) {
      return 1
    }
    if (!a.completedAtTimestamp && b.completedAtTimestamp) {
      return -1
    }
    if (!a.completedAtTimestamp && !b.completedAtTimestamp) {
      return b.lastUpdatedTimestamp - a.lastUpdatedTimestamp
    }
    return 0;
  })
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colorWhite,
    paddingVertical: 12,
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  textInput: {
    borderColor: theme.colorLightGrey,
    borderWidth: 2,
    padding: 12,
    fontSize: 18,
    borderRadius: 50,
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: theme.colorWhite,
  },
  listEmptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18
  }
})
