import { Text, View } from "react-native";

export default function TestScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ textAlign: 'center',color: 'white' }}>
        Hello Testing
      </Text>
    </View>
  );
}