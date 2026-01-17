
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../models/types.dart';
import '../providers/cart_provider.dart';
import '../providers/wishlist_provider.dart';

class ProductCard extends StatelessWidget {
  final Product product;
  final bool isGridView;

  const ProductCard({
    super.key,
    required this.product,
    this.isGridView = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: isGridView ? double.infinity : 192, // w-48 ~ 192px
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: Colors.amber.shade50),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFD48D2A).withOpacity(0.08),
            blurRadius: 30,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Badges
          if (product.discount != null)
            Positioned(
              top: 16,
              left: 16,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Colors.orange, Color(0xFFE65100)],
                  ),
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: const [
                     BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2))
                  ],
                ),
                child: Text(
                  product.discount!,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 9,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ),
            
           if (product.isLimited == true)
            Positioned(
              top: 16,
              left: 16, // In React it was overlapping if both exist, let's keep it simple or offset
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.black,
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: const [
                     BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2))
                  ],
                ),
                child: const Text(
                  "COLLECTOR'S",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 9,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ),

          // Wishlist Button
          Positioned(
            top: 16,
            right: 16,
            child: Consumer<WishlistProvider>(
              builder: (context, wishlist, _) {
                final isWishlisted = wishlist.isInWishlist(product.id);
                return GestureDetector(
                  onTap: () => wishlist.toggleWishlist(product.id),
                  child: Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.9),
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: const [
                         BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2))
                      ],
                    ),
                    child: Center(
                      child: Icon(
                        LucideIcons.heart,
                        size: 18,
                        color: isWishlisted ? Colors.pink : Colors.grey.shade300,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Image
                AspectRatio(
                  aspectRatio: 1,
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.orange.shade50.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(24),
                      child: Image.network(
                        product.image,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => const Center(child: Icon(Icons.broken_image)),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                
                // Add to Bag / Quantity
                Consumer<CartProvider>(
                  builder: (context, cart, _) {
                    final cartItem = cart.getItem(product.id);
                    final quantity = cartItem?.quantity ?? 0;

                    if (quantity == 0) {
                      return SizedBox(
                        width: double.infinity,
                        child: TextButton(
                          onPressed: () => cart.addItem(product.id, 1),
                          style: TextButton.styleFrom(
                            backgroundColor: Colors.orange.shade50,
                            foregroundColor: Colors.deepOrange,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                              side: BorderSide(color: Colors.orange.shade100),
                            ),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                          child: const Text(
                            "ADD TO BAG",
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 1.2,
                            ),
                          ),
                        ),
                      );
                    } else {
                      return Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.deepOrange,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(color: Colors.orange.shade100, blurRadius: 10, offset: const Offset(0, 5)),
                          ],
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            InkWell(
                              onTap: () => cart.addItem(product.id, -1),
                              child: const Icon(LucideIcons.minus, size: 16, color: Colors.white),
                            ),
                            Text(
                              "$quantity",
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w900,
                                fontSize: 14,
                              ),
                            ),
                            InkWell(
                              onTap: () => cart.addItem(product.id, 1),
                              child: const Icon(LucideIcons.plus, size: 16, color: Colors.white),
                            ),
                          ],
                        ),
                      );
                    }
                  },
                ),
                const SizedBox(height: 16),

                // Details
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    if(product.weight != null)
                      Text(
                        product.weight!,
                        style: const TextStyle(
                          fontSize: 9, 
                          color: Colors.orangeAccent, 
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.5,
                        ),
                      ),
                    if(product.isVeg)
                      Container(
                        padding: const EdgeInsets.all(1),
                        decoration: BoxDecoration(border: Border.all(color: Colors.green)),
                        child: const Icon(Icons.circle, color: Colors.green, size: 8),
                      ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  product.name,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w900,
                    height: 1.1,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  "₹${product.price}".replaceAll(RegExp(r"([.]*0)(?!.*\d)"), ""),
                  style: const TextStyle(
                     fontSize: 16,
                     fontWeight: FontWeight.w900,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
