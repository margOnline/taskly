import { useEffect, useState } from 'react'
import { Text, View, StyleSheet, FlatList } from 'react-native'
import { countdownStorageKey, PersistedCountdownState } from '.'
import { getFromStorage } from '../utils/storage';
import { format } from "date-fns";
import { theme } from '../../theme';

const fullDateFormat = `LLL d yyy, h:mm aaa`

export default function HistoryScreen() {
  const [countdownState, setCountdownState] = useState<PersistedCountdownState>();

  useEffect(() => {
    const init = async() => {
      const value = await getFromStorage(countdownStorageKey);
      setCountdownState(value);
    };
    init();
  }, [])
  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.contentContainer}
      data={countdownState?.completedAtTimestamps}
      renderItem={( {item }) => (
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>{ format(item, fullDateFormat) }</Text>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.listEmptyContainer}>
          <Text>No history</Text>
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  contentContainer: {
    marginTop: 8,
  },
  listItem: {
    marginHorizontal: 8,
    marginBottom: 8,
    backgroundColor: theme.colorLightGrey,
    padding: 12,
    borderRadius: 6,
  },
  listItemText: {
    fontSize: 18,
  },
  listEmptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 18,
  },
})
