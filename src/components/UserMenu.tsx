import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Customer, Provider } from '../types';

interface Props {
  user: Customer | Provider;
  onLogout: () => void;
  onViewProfile: () => void;
  onSettings?: () => void;
}

export default function UserMenu({ user, onLogout, onViewProfile, onSettings }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems = [
    {
      icon: 'person-outline' as const,
      label: 'View Profile',
      onPress: () => {
        setMenuVisible(false);
        onViewProfile();
      },
    },
    {
      icon: 'settings-outline' as const,
      label: 'Settings',
      onPress: () => {
        setMenuVisible(false);
        onSettings?.();
      },
    },
    {
      icon: 'log-out-outline' as const,
      label: 'Log out',
      onPress: () => {
        setMenuVisible(false);
        onLogout();
      },
      danger: true,
    },
  ];

  return (
    <View>
      <TouchableOpacity
        style={styles.userButton}
        onPress={() => setMenuVisible(true)}
      >
        <Image source={{ uri: user.profileImage }} style={styles.avatar} />
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Image source={{ uri: user.profileImage }} style={styles.menuAvatar} />
              <View style={styles.menuUserInfo}>
                <Text style={styles.menuUserName}>{user.name}</Text>
                <Text style={styles.menuUserEmail}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.menuDivider} />

            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={item.danger ? '#F44336' : '#666'}
                />
                <Text style={[styles.menuItemText, item.danger && styles.menuItemTextDanger]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  userButton: {
    padding: 5,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#667eea',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 20,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    minWidth: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  menuHeader: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  menuAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  menuUserInfo: {
    flex: 1,
  },
  menuUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  menuUserEmail: {
    fontSize: 13,
    color: '#666',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#eee',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 12,
  },
  menuItemText: {
    fontSize: 15,
    color: '#333',
  },
  menuItemTextDanger: {
    color: '#F44336',
  },
});