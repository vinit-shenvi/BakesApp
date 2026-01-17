
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../data/mock_data.dart';
import '../providers/wishlist_provider.dart';

class ProfileView extends StatefulWidget {
  const ProfileView({super.key});

  @override
  State<ProfileView> createState() => _ProfileViewState();
}

class _ProfileViewState extends State<ProfileView> {
  String _subView = 'main'; // main, orders, wishlist

  @override
  Widget build(BuildContext context) {
    if (_subView == 'orders') return _buildOrders();
    if (_subView == 'wishlist') return _buildWishlist();

    return SingleChildScrollView(
      padding: const EdgeInsets.only(bottom: 100),
      child: Column(
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(32),
            decoration: const BoxDecoration(
              color: Colors.white,
              border: Border(bottom: BorderSide(color: Colors.black12)),
            ),
            child: Column(
              children: [
                Stack(
                  alignment: Alignment.bottomRight,
                  children: [
                    Container(
                      width: 96,
                      height: 96,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.amber.shade50, width: 4),
                        image: const DecorationImage(
                          image: NetworkImage("https://picsum.photos/seed/kantiuser/200/200"),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: const BoxDecoration(color: Colors.deepOrange, shape: BoxShape.circle),
                      child: const Icon(LucideIcons.user, size: 14, color: Colors.white),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                const Text("Harshita Sharma", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
                const Text("+91 98765 43210 • harshita@example.com", style: TextStyle(color: Colors.grey, fontSize: 12)),
                const SizedBox(height: 24),
                Row(
                  children: [
                    Expanded(child: _buildStatCard("Loyalty Points", "1,250", Colors.orange)),
                    const SizedBox(width: 16),
                    Expanded(child: _buildStatCard("Total Orders", "${MOCK_ORDERS.length}", Colors.pink)),
                  ],
                ),
              ],
            ),
          ),
          
          // Menu
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                _buildMenuItem(LucideIcons.shoppingBag, "My Orders", "${MOCK_ORDERS.length} historical orders", () => setState(() => _subView = 'orders')),
                Consumer<WishlistProvider>(
                  builder: (context, wishlist, _) => _buildMenuItem(
                    LucideIcons.heart, 
                    "Wishlist", 
                    "${wishlist.wishlist.length} saved items", 
                    () => setState(() => _subView = 'wishlist')
                  ),
                ),
                _buildMenuItem(LucideIcons.mapPin, "Saved Addresses", "2 addresses", () {}),
                _buildMenuItem(LucideIcons.creditCard, "Payment Methods", "Visa •••• 4242", () {}),
                _buildMenuItem(LucideIcons.settings, "Settings", "Privacy & Security", () {}),
                _buildMenuItem(LucideIcons.helpCircle, "Support & FAQ", "Get help", () {}),
                
                const SizedBox(height: 24),
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(LucideIcons.logOut, color: Colors.red),
                  label: const Text("Logout Account", style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
                  style: TextButton.styleFrom(
                    padding: const EdgeInsets.all(16),
                    backgroundColor: Colors.grey.shade50,
                    minimumSize: const Size(double.infinity, 50),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                ),
                const SizedBox(height: 32),
                const Text("KANTI BAKES & FLAKES v2.4.0", style: TextStyle(color: Colors.grey, fontSize: 9, fontWeight: FontWeight.w900, letterSpacing: 2)),
                const Text("A LEGACY OF SWEETNESS SINCE 1957", style: TextStyle(color: Colors.grey, fontSize: 8, fontWeight: FontWeight.bold, letterSpacing: 1)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String value, MaterialColor color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.shade50.withOpacity(0.5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.shade100),
      ),
      child: Column(
        children: [
          Text(label.toUpperCase(), style: TextStyle(color: color.shade700, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1)),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
        ],
      ),
    );
  }

  Widget _buildMenuItem(IconData icon, String label, String sub, VoidCallback onTap) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.black12),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(color: Colors.grey.shade50, borderRadius: BorderRadius.circular(12)),
                child: Icon(icon, color: Colors.grey, size: 20),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
                    Text(sub, style: const TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.w500)),
                  ],
                ),
              ),
              const Icon(LucideIcons.chevronRight, color: Colors.grey, size: 18),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOrders() {
    return Column(
      children: [
        _buildSubHeader("Order History"),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: MOCK_ORDERS.length,
            itemBuilder: (context, index) {
              final order = MOCK_ORDERS[index];
              return Container(
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.black12),
                ),
                child: Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(order.id, style: const TextStyle(color: Colors.grey, fontWeight: FontWeight.w900, fontSize: 10, letterSpacing: 1.2)),
                              Text(order.date, style: const TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold)),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(4)),
                            child: Text(order.status, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 10, color: Colors.green)),
                          ),
                        ],
                      ),
                    ),
                    const Divider(height: 1),
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: order.items.map((item) => Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text("${item.quantity}x ${item.name}", style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 13, color: Colors.black54)),
                              Text("₹${item.price * item.quantity}", style: const TextStyle(fontWeight: FontWeight.bold)),
                            ],
                          ),
                        )).toList(),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(color: Colors.orange.shade50.withOpacity(0.3)),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text("PAID AMOUNT", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.black45)),
                          Text("₹${order.total}", style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: Colors.deepOrange)),
                        ],
                      ),
                    )
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildWishlist() {
    return Consumer<WishlistProvider>(
      builder: (context, wishlist, _) {
        final wishlistItems = PRODUCTS.where((p) => wishlist.isInWishlist(p.id)).toList();
        return Column(
          children: [
             _buildSubHeader("Your Wishlist"),
             if (wishlistItems.isEmpty) 
               const Expanded(child: Center(child: Text("Your wishlist is empty"))),
             if (wishlistItems.isNotEmpty)
               Expanded(
                 child: GridView.builder(
                   padding: const EdgeInsets.all(16),
                   gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                     crossAxisCount: 2,
                     childAspectRatio: 0.75,
                     crossAxisSpacing: 16,
                     mainAxisSpacing: 16,
                   ),
                   itemCount: wishlistItems.length,
                   itemBuilder: (context, index) {
                      final product = wishlistItems[index];
                      // Simple Wishlist Card
                      return Container(
                         decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.black12)),
                         padding: const EdgeInsets.all(12),
                         child: Column(
                           children: [
                             Expanded(
                               child: Stack(
                                 children: [
                                   Positioned.fill(child: ClipRRect(borderRadius: BorderRadius.circular(12), child: Image.network(product.image, fit: BoxFit.cover))),
                                   Positioned(
                                     top: 4, right: 4,
                                     child: GestureDetector(
                                       onTap: () => wishlist.toggleWishlist(product.id),
                                       child: CircleAvatar(backgroundColor: Colors.white70, radius: 14, child: Icon(LucideIcons.heart, size: 16, color: Colors.pink)),
                                     ),
                                   )
                                 ],
                               ),
                             ),
                             const SizedBox(height: 8),
                             Text(product.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                             Text("₹${product.price}", style: const TextStyle(color: Colors.deepOrange, fontWeight: FontWeight.bold)),
                           ],
                         ),
                      );
                   },
                 ),
               ),
          ],
        );
      },
    );
  }

  Widget _buildSubHeader(String title) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: Colors.black12)),
      ),
      child: Row(
        children: [
          IconButton(onPressed: () => setState(() => _subView = 'main'), icon: const Icon(LucideIcons.arrowLeft)),
          Text(title.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        ],
      ),
    );
  }
}
