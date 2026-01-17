
import 'package:flutter/foundation.dart';

class WishlistProvider with ChangeNotifier {
  final Set<String> _wishlist = {};

  Set<String> get wishlist => Set.from(_wishlist);

  bool isInWishlist(String productId) {
    return _wishlist.contains(productId);
  }

  void toggleWishlist(String productId) {
    if (_wishlist.contains(productId)) {
      _wishlist.remove(productId);
    } else {
      _wishlist.add(productId);
    }
    notifyListeners();
  }
}
