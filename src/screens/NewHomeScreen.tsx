import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  userName: string;
  onSearch: (query: string) => void;
  onNotifications: () => void;
}

export default function NewHomeScreen({ userName, onSearch, onNotifications }: Props) {
  const { t } = useTranslation();

  const goalTasks = [
    {
      id: '1',
      title: t('home.clearOutClutter'),
      price: '$140-150 avg.',
      image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400',
    },
    {
      id: '2',
      title: t('home.builtInShelving'),
      price: '$550-670 avg.',
      image: 'https://images.unsplash.com/photo-1554295405-abb8fd54f153?w=400',
    },
    {
      id: '3',
      title: t('home.cleanYourVacuum'),
      price: '$150-200 avg.',
      image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
    },
  ];

  const homeUpkeepTasks = [
    {
      id: '1',
      title: t('home.removeDeadLeaves'),
      price: '$350-400 avg.',
      image: 'https://images.unsplash.com/photo-1599629954294-c7b46c50c14e?w=400',
    },
    {
      id: '2',
      title: t('home.windowCleaning'),
      price: '$300-370 avg.',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
    },
    {
      id: '3',
      title: t('home.treeTrimming'),
      price: '$1,110-1,340 avg.',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    },
  ];

  const guides = [
    {
      id: '1',
      icon: 'trending-up-outline',
      title: t('home.increaseHomeValue'),
      description: t('home.increaseHomeValueDesc'),
      image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400',
    },
    {
      id: '2',
      icon: 'home-outline',
      title: t('home.preparingToSell'),
      description: t('home.preparingToSellDesc'),
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
    },
  ];

  const outdoorServices = [
    {
      id: '1',
      title: t('home.fullServiceLawnCare'),
      image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400',
    },
    {
      id: '2',
      title: t('home.outdoorLandscaping'),
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    },
  ];

  const essentialServices = [
    {
      id: '1',
      title: t('home.emergencyPlumbing'),
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400',
    },
    {
      id: '2',
      title: t('home.plumbingPipeRepair'),
      image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400',
    },
  ];

  const movingServices = [
    {
      id: '1',
      title: t('home.furnitureAssembly'),
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400',
    },
    {
      id: '2',
      title: t('home.interiorDesign'),
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    },
  ];

  const petServices = [
    {
      id: '1',
      title: t('home.dogWalking'),
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    },
    {
      id: '2',
      title: t('home.petGrooming'),
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
    },
  ];

  const tutoringServices = [
    {
      id: '1',
      title: t('home.collegeAdmissions'),
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    },
    {
      id: '2',
      title: t('home.testPrepServices'),
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    },
  ];

  const financialServices = [
    {
      id: '1',
      title: t('home.personalFinancialPlanning'),
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
    },
    {
      id: '2',
      title: t('home.individualTaxPreparation'),
      image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            {t('home.welcome')}, {userName}
          </Text>
          <TouchableOpacity onPress={onNotifications}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('home.searchPlaceholder')}
            placeholderTextColor="#999"
            onSubmitEditing={(e) => onSearch(e.nativeEvent.text)}
          />
        </View>

        {/* For your home */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.forYourHome')}</Text>
          <Text style={styles.sectionDescription}>
            {t('home.forYourHomeDesc')}
          </Text>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>{t('home.addYourAddress')}</Text>
            <Ionicons name="arrow-forward" size={16} color="#0066FF" />
          </TouchableOpacity>
        </View>

        {/* Your goals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.yourGoals')}</Text>
            <TouchableOpacity>
              <Ionicons name="arrow-forward" size={20} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800' }}
              style={styles.cardHeaderImage}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{t('home.keepThingsClean')}</Text>
              {goalTasks.map((task) => (
                <View key={task.id} style={styles.taskItem}>
                  <Image source={{ uri: task.image }} style={styles.taskImage} />
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={styles.taskPrice}>{task.price}</Text>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="bookmark-outline" size={24} color="#0066FF" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.viewGuideButton}>
                <Text style={styles.viewGuideText}>{t('home.viewGuide')}</Text>
                <Ionicons name="arrow-forward" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Custom goals prompt */}
        <View style={styles.promptCard}>
          <Text style={styles.promptText}>{t('home.lookingForTailored')}</Text>
          <TouchableOpacity>
            <Text style={styles.promptLink}>{t('home.tellUsAboutGoals')}</Text>
          </TouchableOpacity>
        </View>

        {/* Home upkeep */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.homeUpkeep')}</Text>
            <TouchableOpacity>
              <Ionicons name="arrow-forward" size={20} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1599629954294-c7b46c50c14e?w=800' }}
              style={styles.cardHeaderImage}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{t('home.fallUpkeep')}</Text>
              {homeUpkeepTasks.map((task) => (
                <View key={task.id} style={styles.taskItem}>
                  <Image source={{ uri: task.image }} style={styles.taskImage} />
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={styles.taskPrice}>{task.price}</Text>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="bookmark-outline" size={24} color="#0066FF" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.viewGuideButton}>
                <Text style={styles.viewGuideText}>{t('home.viewGuide')}</Text>
                <Ionicons name="arrow-forward" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* More guides */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.moreGuides')}</Text>
            <TouchableOpacity>
              <Ionicons name="arrow-forward" size={20} color="#333" />
            </TouchableOpacity>
          </View>

          {guides.map((guide) => (
            <TouchableOpacity key={guide.id} style={styles.guideCard}>
              <Image source={{ uri: guide.image }} style={styles.guideImage} />
              <View style={styles.guideContent}>
                <View style={styles.guideIconContainer}>
                  <Ionicons name={guide.icon as any} size={20} color="#0066FF" />
                </View>
                <Text style={styles.guideTitle}>{guide.title}</Text>
                <Text style={styles.guideDescription}>{guide.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Outdoor upkeep */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.outdoorUpkeep')}</Text>
          <View style={styles.serviceGrid}>
            {outdoorServices.map((service) => (
              <TouchableOpacity key={service.id} style={styles.serviceCard}>
                <Image source={{ uri: service.image }} style={styles.serviceImage} />
                <Text style={styles.serviceTitle}>{service.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Essential home services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.essentialHomeServices')}</Text>
          <View style={styles.serviceGrid}>
            {essentialServices.map((service) => (
              <TouchableOpacity key={service.id} style={styles.serviceCard}>
                <Image source={{ uri: service.image }} style={styles.serviceImage} />
                <Text style={styles.serviceTitle}>{service.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Moving into a new home */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.movingIntoNewHome')}</Text>
          <View style={styles.serviceGrid}>
            {movingServices.map((service) => (
              <TouchableOpacity key={service.id} style={styles.serviceCard}>
                <Image source={{ uri: service.image }} style={styles.serviceImage} />
                <Text style={styles.serviceTitle}>{service.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Caring for a pet */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.caringForPet')}</Text>
          <View style={styles.serviceGrid}>
            {petServices.map((service) => (
              <TouchableOpacity key={service.id} style={styles.serviceCard}>
                <Image source={{ uri: service.image }} style={styles.serviceImage} />
                <Text style={styles.serviceTitle}>{service.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Financial services section */}
        <View style={styles.serviceGrid}>
          {financialServices.map((service) => (
            <TouchableOpacity key={service.id} style={styles.serviceCard}>
              <Image source={{ uri: service.image }} style={styles.serviceImage} />
              <Text style={styles.serviceTitle}>{service.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Online tutoring */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.onlineTutoring')}</Text>
          <View style={styles.serviceGrid}>
            {tutoringServices.map((service) => (
              <TouchableOpacity key={service.id} style={styles.serviceCard}>
                <Image source={{ uri: service.image }} style={styles.serviceImage} />
                <Text style={styles.serviceTitle}>{service.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Get inspiration */}
        <View style={styles.inspirationCard}>
          <View style={styles.inspirationContent}>
            <Text style={styles.inspirationTitle}>{t('home.getInspiration')}</Text>
            <TouchableOpacity style={styles.inspirationButton}>
              <Text style={styles.inspirationLink}>{t('home.seeOurFavorites')}</Text>
              <Ionicons name="arrow-forward" size={16} color="#0066FF" />
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' }}
            style={styles.inspirationImage}
          />
        </View>

        {/* Footer prompt */}
        <View style={styles.footerPrompt}>
          <Text style={styles.footerText}>{t('home.dontSeeWhatLooking')}</Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>{t('home.searchAllServices')}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  linkText: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: '600',
    marginRight: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeaderImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  taskImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  taskPrice: {
    fontSize: 14,
    color: '#666',
  },
  viewGuideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
  },
  viewGuideText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginRight: 4,
  },
  promptCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  promptText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  promptLink: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: '600',
  },
  guideCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  guideImage: {
    width: 90,
    height: 90,
  },
  guideContent: {
    flex: 1,
    padding: 12,
  },
  guideIconContainer: {
    marginBottom: 4,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  guideDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  serviceCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  serviceImage: {
    width: '100%',
    height: 120,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    padding: 12,
  },
  inspirationCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inspirationContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  inspirationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    lineHeight: 22,
  },
  inspirationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inspirationLink: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: '600',
    marginRight: 4,
  },
  inspirationImage: {
    width: 120,
    height: 120,
  },
  footerPrompt: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  footerLink: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: '600',
  },
});
