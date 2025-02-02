import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import jwt_decode from 'jwt-decode'
import { BASE_URL } from "../config";

const AddBalanceModal = ({ visible, onClose, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('')
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setToken(token);
        }
      } catch (error) {
        console.error("Error retrieving user ID:", error);
      }
    };
    fetchUserId();
  }, []);

  const handleAddBalance = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert("Enter a valid amount");
      return;
    }

    setLoading(true);
    try {
        const decodedToken = jwt_decode(token);
        const { userid } = decodedToken; // Ensure correct key
      
        const response = await fetch(`${BASE_URL}/increment_balance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userid,
            amount: parseFloat(amount),
          }),
        });
      
        const data = await response.json();
        if (response.ok) {
          Alert.alert("Balance added successfully!");
          setAmount("");
          onSuccess(parseFloat(amount));
          setStatus("Balance updated");
      
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setStatus(data.message || "Failed to add balance");
        }
      } catch (error) {
        setStatus(error.message || "Failed to add balance"); // Fix here
        Alert.alert("Network error. Please try again.");
      }
       finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Balance</Text>
          <Text style={{
            textAlign: 'center',
            fontFamily: "Livvic_700Bold",
            fontSize: 15,
            color: 'red'
          }}>{status}</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "red" }]}
              onPress={handleAddBalance}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size={20}/>
              ) : (
                <Text style={styles.buttonText}>Confirm</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "gray" }]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    minHeight: "30%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Livvic_700Bold',
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    fontSize: 16,
    fontFamily: "Livvic_400Regular",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
};

export default AddBalanceModal;
