


import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, TextInput, SafeAreaView, FlatList, ScrollView } from "react-native";

const windowWidth = Dimensions.get("window").width;

const App = () => {
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', phoneNumber: '', email: '', role: '' });
  const [isEditing, setIsEditing] = useState(false); // State to control editing
  const [editingUserId, setEditingUserId] = useState(null); // State to keep track of the user being edited

  const fetchData = async () => {
    const res = await fetch('http://192.168.1.5:4000/api/users');
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addUser = async () => {
    await fetch('http://192.168.1.5:4000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });
    closeModal();
    fetchData();
  };

  const editUser = async () => {
    await fetch(`http://192.168.1.5:4000/api/users/${editingUserId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });
    closeModal();
    fetchData();
  };

  const deleteUser = async (id) => {
    await fetch(`http://192.168.1.5:4000/api/users/${id}`, {
      method: 'DELETE',
    });
    fetchData();
  };

  const resetNewUser = () => {
    setNewUser({ firstName: '', lastName: '', phoneNumber: '', email: '', role: '' });
  };

  const closeModal = () => {
    setModalVisible(false);
    resetNewUser();
    setIsEditing(false);
    setEditingUserId(null);
  };

  const openEditModal = (user) => {
    setNewUser(user);
    setEditingUserId(user.id);
    setIsEditing(true);
    setModalVisible(true);
  };

  const openAddModal = () => {
    resetNewUser();
    setIsEditing(false);
    setEditingUserId(null);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data = {users}
        keyExtractor = {item => item.id.toString()}
        renderItem = {({ item }) => (
          <View style={styles.row}>
            <ScrollView horizontal>
              <Text>{item.id} {'|'} </Text>
              <Text>{item.firstName} {item.lastName} {'|'} </Text>
              <Text>{item.phoneNumber} {'|'} </Text>
              <Text>{item.email} {'|'} </Text>
              <Text>{item.role} {'|'} </Text>

              <TouchableOpacity onPress={() => openEditModal(item)}>
                <Text style={styles.editButton}> Edit </Text>
              </TouchableOpacity>
              <Text>{'|'}</Text>
              <TouchableOpacity onPress={() => deleteUser(item.id)}>
                <Text style={styles.deleteButton}> Delete </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Text style={styles.buttonText}>Add new user</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalView}>
          <TextInput
            placeholder="First Name"
            value={newUser.firstName}
            onChangeText={text => setNewUser({ ...newUser, firstName: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Last Name"
            value={newUser.lastName}
            onChangeText={text => setNewUser({ ...newUser, lastName: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Phone Number"
            value={newUser.phoneNumber}
            onChangeText={text => setNewUser({ ...newUser, phoneNumber: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={newUser.email}
            onChangeText={text => setNewUser({ ...newUser, email: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Role"
            value={newUser.role}
            onChangeText={text => setNewUser({ ...newUser, role: text })}
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={isEditing ? editUser : addUser}>
              <Text style={styles.buttonText}>{isEditing ? 'Save Changes' : 'Save'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deleteButton: {
    color: 'red',
  },
  editButton: {
    color: 'blue',
  },
  addButton: {
    backgroundColor: 'red',
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  input: {
    width: 200,
    height: 40,
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
});

export default App;
