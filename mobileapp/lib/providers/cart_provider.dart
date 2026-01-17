
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/types.dart';
import '../data/mock_data.dart';

class CartProvider with ChangeNotifier {
  final List<CartItem> _items = [];

  List<CartItem> get items => [..._items]; // Return copy

  int get itemCount => _items.fold(0, (sum, item) => sum + item.quantity);

  double get totalAmount {
    return _items.fold(0.0, (sum, item) => sum + (item.price * item.quantity));
  }

  void addItem(String productId, int delta) {
    final existingIndex = _items.indexWhere((item) => item.id == productId);

    if (existingIndex >= 0) {
      // Update existing item
      final existingItem = _items[existingIndex];
      final newQuantity = existingItem.quantity + delta;

      if (newQuantity <= 0) {
        _items.removeAt(existingIndex);
      } else {
        existingItem.quantity = newQuantity;
      }
    } else {
      // Add new item if delta > 0
      if (delta > 0) {
        final product = PRODUCTS.firstWhere((p) => p.id == productId, orElse: () => throw Exception('Product not found'));
        _items.add(CartItem.fromProduct(product, quantity: delta));
      }
    }
    notifyListeners();
  }

  void clearCart() {
    _items.clear();
    notifyListeners();
  }
  
  CartItem? getItem(String productId) {
    try {
      return _items.firstWhere((item) => item.id == productId);
    } catch (e) {
      return null;
    }
  }

  Future<bool> placeOrder(String customerName, String address, String deliveryMethod) async {
    final url = Uri.parse('http://localhost:5000/api/orders');
    try {
      final orderData = {
        'customerName': customerName,
        'customerAddress': address,
        'storeName': 'Kanti Bakes - HSR', // Default store
        'storeAddress': 'Sector 7, HSR Layout',
        'items': _items.map((i) => '${i.name} (${i.quantity})').toList(),
        'amount': totalAmount,
        'distanceKm': 3.5, // Mock distance
        'status': 'newRequest',
        'deliveryMethod': deliveryMethod,
      };

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: json.encode(orderData),
      );

      if (response.statusCode == 201) {
        clearCart();
        return true;
      }
      return false;
    } catch (e) {
      print('Error placing order: $e');
      return false;
    }
  }
}
