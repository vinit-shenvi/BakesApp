
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../models/types.dart';
import '../providers/cart_provider.dart';

class CheckoutModal extends StatelessWidget {
  final DeliveryMethod deliveryMethod;
  final Location location;

  const CheckoutModal({
    super.key,
    required this.deliveryMethod,
    required this.location,
  });

  @override
  Widget build(BuildContext context) {
    return Consumer<CartProvider>(
      builder: (context, cart, _) {
        final subtotal = cart.totalAmount;
        final cgst = subtotal * 0.025;
        final sgst = subtotal * 0.025;
        
        // Parse distance logic simplistic
        final distanceNum = double.tryParse(location.distance?.split(' ')[0] ?? '2.0') ?? 2.0;
        final deliveryFee = deliveryMethod == DeliveryMethod.pickup ? 0.0 : (distanceNum * 10);
        final total = subtotal + cgst + sgst + deliveryFee;

        return Container(
          height: MediaQuery.of(context).size.height * 0.9,
          decoration: const BoxDecoration(
            color: Color(0xFFFDFCF8),
            borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
          ),
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    IconButton(
                        icon: const Icon(LucideIcons.chevronLeft, color: Colors.deepOrange),
                        onPressed: () => Navigator.pop(context)),
                    Text(
                      "Confirm ${deliveryMethod == DeliveryMethod.pickup ? 'Store Pickup' : 'Delivery'}",
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    // Status
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        border: Border(bottom: BorderSide(color: Colors.black12)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: const BoxDecoration(
                              color: Color(0xFFFFF7ED), // orange-50
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              deliveryMethod == DeliveryMethod.pickup ? LucideIcons.store : LucideIcons.clock,
                              color: Colors.deepOrange,
                              size: 24,
                            ),
                          ),
                          const SizedBox(width: 16),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                deliveryMethod == DeliveryMethod.pickup ? 'STORE PICKUP' : 'HERITAGE DELIVERY',
                                style: const TextStyle(
                                  color: Colors.deepOrange,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 1.2,
                                ),
                              ),
                              Text(
                                deliveryMethod == DeliveryMethod.pickup
                                    ? "Ready for pickup in 15 mins"
                                    : "Arriving in 20 mins",
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                              ),
                            ],
                          )
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Valentine Banner
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.pink.shade50,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Row(
                        children: [
                          Icon(LucideIcons.heart, size: 20, color: Colors.pink.shade500),
                          const SizedBox(width: 12),
                          const Expanded(
                            child: Text(
                              "VALENTINE SPECIAL: SPREADING LOVE WITH ₹20 SAVINGS",
                              style: TextStyle(
                                color: Colors.pink,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Items
                    const Text(
                      "REVIEW ITEMS",
                      style: TextStyle( color: Colors.grey, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.2),
                    ),
                    const SizedBox(height: 16),
                    ...cart.items.map((item) => Padding(
                          padding: const EdgeInsets.only(bottom: 16.0),
                          child: Row(
                            children: [
                              Container(
                                width: 48,
                                height: 48,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(8),
                                  image: DecorationImage(
                                    image: NetworkImage(item.image),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(item.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                                    if(item.weight != null)
                                      Text(item.weight!, style: const TextStyle(color: Colors.grey, fontSize: 10)),
                                    Text("₹${item.price}", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                                  ],
                                ),
                              ),
                              Container(
                                decoration: BoxDecoration(
                                  color: Colors.grey.shade100,
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                child: Row(
                                  children: [
                                    GestureDetector(
                                      onTap: () => cart.addItem(item.id, -1),
                                      child: const Icon(LucideIcons.minus, size: 14, color: Colors.grey),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 12),
                                      child: Text("${item.quantity}", style: const TextStyle(fontWeight: FontWeight.bold)),
                                    ),
                                    GestureDetector(
                                      onTap: () => cart.addItem(item.id, 1),
                                      child: const Icon(LucideIcons.plus, size: 14, color: Colors.deepOrange),
                                    ),
                                  ],
                                ),
                              )
                            ],
                          ),
                        )),

                    const Divider(height: 32),
                    
                    // Bill
                    const Text(
                      "BILL DETAILS",
                      style: TextStyle( color: Colors.grey, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.2),
                    ),
                    const SizedBox(height: 12),
                    _buildRow("Item Total", "₹${subtotal.toStringAsFixed(2)}"),
                    _buildRow("CGST (2.5%)", "₹${cgst.toStringAsFixed(2)}", isSmall: true),
                    _buildRow("SGST (2.5%)", "₹${sgst.toStringAsFixed(2)}", isSmall: true),
                    _buildRow(
                      deliveryMethod == DeliveryMethod.pickup ? 'Store Pickup Fee' : 'Delivery Fee',
                      deliveryFee == 0 ? 'Free' : "₹${deliveryFee.toStringAsFixed(2)}",
                      valueColor: deliveryFee == 0 ? Colors.green : null,
                    ),
                    const Divider(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                             Text("Total to Pay", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                             Text("Incl. all taxes", style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        Text("₹${total.toStringAsFixed(2)}", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 24, color: Colors.deepOrange)),
                      ],
                    ),
                    const SizedBox(height: 32),
                    const Center(child: Text("HAND-PACKED WITH HERITAGE STANDARDS", style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 2))),
                    const SizedBox(height: 100), // Spacing for bottom button
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  border: Border(top: BorderSide(color: Colors.black12)),
                ),
                child: SizedBox(
                   width: double.infinity,
                   child: ElevatedButton(
                     onPressed: () async {
                       final success = await cart.placeOrder(
                         "Flutter Customer", 
                         location.address ?? "Store Pickup",
                         deliveryMethod == DeliveryMethod.pickup ? "PICKUP" : "HOME_DELIVERY"
                       );
                       if (success && context.mounted) {
                         Navigator.pop(context);
                         ScaffoldMessenger.of(context).showSnackBar(
                           const SnackBar(content: Text("Order Placed Successfully!")),
                         );
                       }
                     },
                     style: ElevatedButton.styleFrom(
                       backgroundColor: Colors.deepOrange,
                       foregroundColor: Colors.white,
                       padding: const EdgeInsets.symmetric(vertical: 20),
                       shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                       elevation: 10,
                       shadowColor: Colors.orange.withOpacity(0.4),
                     ),
                     child: Row(
                       mainAxisAlignment: MainAxisAlignment.center,
                       children: [
                         Text(
                            deliveryMethod == DeliveryMethod.pickup ? 'PAY & COLLECT' : 'CONFIRM & PAY',
                            style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14),
                         ),
                         const SizedBox(width: 8),
                         Text(
                           "₹${total.toStringAsFixed(2)}",
                           style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18),
                         ),
                       ],
                     ),
                   ),
                ),
              )
            ],
          ),
        );
      },
    );
  }

  Widget _buildRow(String label, String value, {bool isSmall = false, Color? valueColor}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: isSmall ? Colors.grey : Colors.black87, fontSize: isSmall ? 12 : 14)),
          Text(value, style: TextStyle(fontWeight: FontWeight.bold, color: valueColor ?? Colors.black87, fontSize: isSmall ? 12 : 14)),
        ],
      ),
    );
  }
}
