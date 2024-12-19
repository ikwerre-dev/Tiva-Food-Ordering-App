import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

export default function ReviewsScreen({ navigation }) {
  const reviews = [
    {
      id: 1,
      name: "Arya Stark",
      date: "23/06/2024",
      rating: 4,
      comment:
        "Really convenient and the points system helps benefit loyalty. Some mild glitches here and there, but nothing too egregious. Obviously needs to roll out to more remote...",
    },
    {
      id: 2,
      name: "Tyrion Lannister",
      date: "22/06/2024",
      rating: 5,
      comment:
        "Been using this app since the pandemic, although they could improve some of their UI and how they handle specials as it often is unclear how to use them or everything is sold out so...",
    },
    {
      id: 3,
      name: "Daenerys Targaryen",
      date: "21/06/2024",
      rating: 3,
      comment:
        "Got an extra 50% off first order that did not work. I have added the promo code to find a button available.",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.writeReviewContainer}>
          <Image
            source={{ uri: "https://placeholder.com/50x50" }}
            style={styles.userAvatar}
          />
          <TouchableOpacity style={styles.writeReviewButton}>
            <Text style={styles.writeReviewText}>Write your review...</Text>
          </TouchableOpacity>
        </View>

        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Image
                source={{ uri: "https://placeholder.com/40x40" }}
                style={styles.reviewerAvatar}
              />
              <View style={styles.reviewerInfo}>
                <Text style={styles.reviewerName}>{review.name}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              <TouchableOpacity>
                <Icon name="more-vertical" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, index) => (
                <Icon
                  key={index}
                  name="star"
                  size={16}
                  color={index < review.rating ? "#FFD700" : "#666"}
                />
              ))}
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101112",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  writeReviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  writeReviewButton: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 25,
    padding: 15,
  },
  writeReviewText: {
    color: "#666",
  },
  reviewItem: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    color: "#fff",
    fontWeight: "bold",
  },
  reviewDate: {
    color: "#666",
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  reviewComment: {
    color: "#fff",
  },
});
