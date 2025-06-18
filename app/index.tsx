import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { theme } from "../theme";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { useState } from "react";

type ShoppingListItemType = {
  id: string;
  name: string;
};

const initialList: ShoppingListItemType[] = [
  { id: '1', name: 'Coffee' },
  { id: '2', name: 'Tea' },
  { id: '3', name: 'Milk' },
  { id: '4', name: 'Sugar' },
  { id: '5', name: 'Chicken' },
  { id: '6', name: 'Yoghurt' },
  { id: '7', name: 'Oats' },
  { id: '8', name: 'Blueberries' },
  { id: '9', name: 'Cheese' },
  { id: '10', name: 'Crackers' },
  { id: '11', name: 'Eggs' },
  { id: '12', name: 'Bread' },
]

export default function App() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>(initialList);
  const [value, setValue] = useState<string>();

  const handleSubmit = () => {
    if (value) {
      const newShoppingList = [
        { id: new Date().toISOString(), name: value },
        ...shoppingList,
      ];
      setShoppingList(newShoppingList);
      setValue(undefined);
    }
  };

  const handleDelete = (id: string) => {
    console.log("deleting item... ", id)
    const newShoppingList = shoppingList.filter(item => item.id !== id)
    setShoppingList(newShoppingList);
  }

  return (
    <FlatList
      data={shoppingList}
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
        return <ShoppingListItem name={item.name} key={item.id} onDelete={() => handleDelete(item.id)}/>
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colorWhite,
    paddingTop: 12,
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
