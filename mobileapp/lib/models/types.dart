
enum DeliveryMethod { delivery, pickup }

class Location {
  final String id;
  final String name;
  final String address;
  final String? distance;
  final String? status;

  Location({
    required this.id,
    required this.name,
    required this.address,
    this.distance,
    this.status,
  });
}

class Product {
  final String id;
  final String name;
  final double price;
  final String? weight;
  final String? description;
  final String image;
  final String category;
  final bool isVeg;
  final String? discount;
  final bool? isLimited;

  Product({
    required this.id,
    required this.name,
    required this.price,
    this.weight,
    this.description,
    required this.image,
    required this.category,
    required this.isVeg,
    this.discount,
    this.isLimited,
  });
}

class CartItem extends Product {
  int quantity;

  CartItem({
    required Product product,
    required this.quantity,
  }) : super(
          id: product.id,
          name: product.name,
          price: product.price,
          weight: product.weight,
          description: product.description,
          image: product.image,
          category: product.category,
          isVeg: product.isVeg,
          discount: product.discount,
          isLimited: product.isLimited,
        );
        
  // Helper to create from existing Product
  factory CartItem.fromProduct(Product product, {int quantity = 1}) {
    return CartItem(product: product, quantity: quantity);
  }
}

class OrderItem {
  final String id;
  final String name;
  final int quantity;
  final double price;

  OrderItem({
    required this.id,
    required this.name,
    required this.quantity,
    required this.price,
  });
}

class Order {
  final String id;
  final String date;
  final String status; // 'Delivered' | 'In Transit' | 'Preparing'
  final double total;
  final List<OrderItem> items;
  final DeliveryMethod method;

  Order({
    required this.id,
    required this.date,
    required this.status,
    required this.total,
    required this.items,
    required this.method,
  });
}
