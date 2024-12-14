export const featuredRestaurants = [
  {
    id: 1,
    name: "Chicken Republic Refuel",
    image: "http://172.20.10.2/tiva/1.png",
    rating: 4.5,
    description: 'Jollof Rice is one of the most beloved and flavorful dishes available for delivery on our platform! This iconic West African delicacy features perfectly cooked long-grain rice simmered in a rich, tomato-based sauce infused with aromatic spices. Each serving is a vibrant mix of savory, smoky, and slightly spicy flavors, making it the ultimate comfort food for any occasion.',
    price: 8000,
    isVerified: true,
    delivery: {
      isFree: true,
      time: "10-15 mins"
    },
    tags: ["Promo", "Package", "Fast Food"]
  },
  {
    id: 2,
    name: "Urban Bites",
    image: "http://172.20.10.2/tiva/2.png",
    rating: 4.5,
    description: 'Jollof Rice is one of the most beloved and flavorful dishes available for delivery on our platform! This iconic West African delicacy features perfectly cooked long-grain rice simmered in a rich, tomato-based sauce infused with aromatic spices. Each serving is a vibrant mix of savory, smoky, and slightly spicy flavors, making it the ultimate comfort food for any occasion.',
    price: 8000,
    isVerified: false,
    delivery: {
      isFree: true,
      time: "15-20 mins"
    },
    addOns: [
      { name: 'Extra Chicken', price: 1200 },
      { name: 'Salad', price: 500 },
    ],
    tags: ["Yam"]
  }
];

export const foodCourt = [
  {
    id: 1,
    name: "Quarter Rotisserie",
    image: "http://172.20.10.2/tiva/1.png",
    isFavorite: false
  },
  {
    id: 2,
    name: "5-REFUEL-DODO-ME",
    image: "http://172.20.10.2/tiva/1.png",
    isFavorite: false
  }
];

export const categories = [
 
  {
    id: 1,
    name: "Food Court",
    icon: "🍽️",
    items: [
      {
        id: 1,
        name: "Quarter Rotisserie",
        image: "http://172.20.10.2/tiva/1.png",
        isFavorite: false,
        rating: 4.5,
        description: 'Jollof Rice is one of the most beloved and flavorful dishes available for delivery on our platform! This iconic West African delicacy features perfectly cooked long-grain rice simmered in a rich, tomato-based sauce infused with aromatic spices. Each serving is a vibrant mix of savory, smoky, and slightly spicy flavors, making it the ultimate comfort food for any occasion.',
        price: 8000,
        isVerified: false,
        delivery: {
          isFree: true,
          time: "15-20 mins"
        },
        tags: ["Yam"]
      },
      {
        id: 2,
        name: "5-REFUEL-DODO-ME",
        image: "http://172.20.10.2/tiva/1.png",
        isFavorite: false,
        rating: 4.5,
        description: 'Jollof Rice is one of the most beloved and flavorful dishes available for delivery on our platform! This iconic West African delicacy features perfectly cooked long-grain rice simmered in a rich, tomato-based sauce infused with aromatic spices. Each serving is a vibrant mix of savory, smoky, and slightly spicy flavors, making it the ultimate comfort food for any occasion.',
        price: 8000,
        isVerified: false,
        delivery: {
          isFree: true,
          time: "15-20 mins"
        },
        tags: ["Yam"]
      },
      {
        id: 3,
        name: "Quarter Rotisserie",
        image: "http://172.20.10.2/tiva/1.png",
        isFavorite: false,
        rating: 4.5,
        description: 'Jollof Rice is one of the most beloved and flavorful dishes available for delivery on our platform! This iconic West African delicacy features perfectly cooked long-grain rice simmered in a rich, tomato-based sauce infused with aromatic spices. Each serving is a vibrant mix of savory, smoky, and slightly spicy flavors, making it the ultimate comfort food for any occasion.',
        price: 8000,
        isVerified: false,
        delivery: {
          isFree: true,
          time: "15-20 mins"
        },
        tags: ["Yam"]
      },
      {
        id: 4,
        name: "5-REFUEL-DODO-ME",
        image: "http://172.20.10.2/tiva/1.png",
        isFavorite: false,
        rating: 4.5,
        description: 'Jollof Rice is one of the most beloved and flavorful dishes available for delivery on our platform! This iconic West African delicacy features perfectly cooked long-grain rice simmered in a rich, tomato-based sauce infused with aromatic spices. Each serving is a vibrant mix of savory, smoky, and slightly spicy flavors, making it the ultimate comfort food for any occasion.',
        price: 8000,
        isVerified: false,
        delivery: {
          isFree: true,
          time: "15-20 mins"
        },
        tags: ["Yam"]
      },
    ]
  },
  {
    id: 5,
    name: "Food Around You",
    icon: "🏙️",
    items: [
      {
        id: 1,
        name: "Garri Sharwama",
        image: "http://172.20.10.2/tiva/2.png",
        isFavorite: false,
        rating: 4.5,
        description: 'Jollof Rice is one of the most beloved and flavorful dishes available for delivery on our platform! This iconic West African delicacy features perfectly cooked long-grain rice simmered in a rich, tomato-based sauce infused with aromatic spices. Each serving is a vibrant mix of savory, smoky, and slightly spicy flavors, making it the ultimate comfort food for any occasion.',
        price: 8000,
        isVerified: true,
        delivery: {
          isFree: true,
          time: "15-20 mins"
        },
        tags: ["Yam"]
      },
      {
        id: 2,
        name: "Eba Fillet",
        image: "http://172.20.10.2/tiva/1.png",
        isFavorite: false,
        rating: 4.5,
        description: 'Jollof Rice is one of the most beloved and flavorful dishes available for delivery on our platform! This iconic West African delicacy features perfectly cooked long-grain rice simmered in a rich, tomato-based sauce infused with aromatic spices. Each serving is a vibrant mix of savory, smoky, and slightly spicy flavors, making it the ultimate comfort food for any occasion.',
        price: 8000,
        isVerified: true,
        delivery: {
          isFree: true,
          time: "15-20 mins"
        },
        tags: ["Yam"]
      },
      {
        id: 3,
        name: "Garri Sharwama",
        image: "http://172.20.10.2/tiva/2.png",
        isFavorite: false,
        rating: 4.5,
        description: 'Jollof Rice is one of the most beloved and flavorful dishes available for delivery on our platform! This iconic West African delicacy features perfectly cooked long-grain rice simmered in a rich, tomato-based sauce infused with aromatic spices. Each serving is a vibrant mix of savory, smoky, and slightly spicy flavors, making it the ultimate comfort food for any occasion.',
        price: 8000,
        isVerified: true,
        delivery: {
          isFree: true,
          time: "15-20 mins"
        },
        tags: ["Yam"]
      },
      {
        id: 4,
        name: "Eba Fillet Eba Fillet Eba Fillet Eba Fillet",
        image: "http://172.20.10.2/tiva/1.png",
        isFavorite: false,
        rating: 4.5,
        description: 'Jollof Rice is one of the most beloved and flavorful dishes available for delivery on our platform! This iconic West African delicacy features perfectly cooked long-grain rice simmered in a rich, tomato-based sauce infused with aromatic spices. Each serving is a vibrant mix of savory, smoky, and slightly spicy flavors, making it the ultimate comfort food for any occasion.',
        price: 8000,
        isVerified: false,
        delivery: {
          isFree: true,
          time: "15-20 mins"
        },
        tags: ["Yam"]
      },
    ]
  }
];