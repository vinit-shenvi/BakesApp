
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../models/types.dart';

// Mock Stores
final List<Location> LOCATIONS = [
  Location(id: '1', name: 'HSR Layout Kitchen', address: 'Sector 7, HSR, Bangalore', distance: '1.2 km', status: 'Open Now'),
  Location(id: '2', name: 'Indiranagar Boutique', address: '100ft Road, Indiranagar', distance: '4.5 km', status: 'Open Now'),
  Location(id: '3', name: 'Koramangala Studio', address: '80ft Road, 4th Block', distance: '3.1 km', status: 'Open Now'),
];

class LocationModal extends StatelessWidget {
  final DeliveryMethod method;
  final ValueChanged<DeliveryMethod> onMethodChanged;
  final Location selectedLocation;
  final ValueChanged<Location> onLocationSelected;

  const LocationModal({
    super.key,
    required this.method,
    required this.onMethodChanged,
    required this.selectedLocation,
    required this.onLocationSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("Select Location", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
              IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(LucideIcons.x)),
            ],
          ),
          const SizedBox(height: 16),
          // Toggle
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(16)),
            child: Row(
              children: [
                Expanded(child: _buildToggleBtn(DeliveryMethod.delivery, "DELIVERY")),
                Expanded(child: _buildToggleBtn(DeliveryMethod.pickup, "SELF PICKUP")),
              ],
            ),
          ),
          const SizedBox(height: 24),

          if (method == DeliveryMethod.delivery) ...[
             TextField(
               decoration: InputDecoration(
                 hintText: "Search for your area...",
                 prefixIcon: const Icon(LucideIcons.search, size: 18),
                 filled: true,
                 fillColor: Colors.grey.shade50,
                 border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
               ),
             ),
             const SizedBox(height: 16),
             ListTile(
               contentPadding: EdgeInsets.zero,
               leading: Container(
                 padding: const EdgeInsets.all(8),
                 decoration: BoxDecoration(color: Colors.orange.shade50, shape: BoxShape.circle),
                 child: const Icon(LucideIcons.navigation, color: Colors.deepOrange, size: 18),
               ),
               title: const Text("Use current location", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.deepOrange)),
             ),
             const Padding(
               padding: EdgeInsets.symmetric(vertical: 12.0),
               child: Divider(),
             ),
             const Text("SAVED ADDRESSES", style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.2)),
             const SizedBox(height: 12),
             const ListTile(
               leading: Icon(LucideIcons.mapPin),
               title: Text("Home", style: TextStyle(fontWeight: FontWeight.bold)),
               subtitle: Text("Sector 7, HSR Layout, Bangalore"),
             ),
          ] else ...[
             const Text("SELECT STORE TO PICKUP FROM", style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.2)),
             const SizedBox(height: 12),
             ...LOCATIONS.map((loc) => GestureDetector(
               onTap: () {
                 onLocationSelected(loc);
                 Navigator.pop(context);
               },
               child: Container(
                 margin: const EdgeInsets.only(bottom: 12),
                 padding: const EdgeInsets.all(16),
                 decoration: BoxDecoration(
                   border: Border.all(color: selectedLocation.id == loc.id ? Colors.deepOrange : Colors.grey.shade200, width: 2),
                   borderRadius: BorderRadius.circular(16),
                   color: selectedLocation.id == loc.id ? Colors.orange.shade50.withOpacity(0.3) : Colors.transparent,
                 ),
                 child: Column(
                   crossAxisAlignment: CrossAxisAlignment.start,
                   children: [
                     Row(
                       mainAxisAlignment: MainAxisAlignment.spaceBetween,
                       children: [
                         Text(loc.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                         Text(loc.status ?? '', style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 10)),
                       ],
                     ),
                     const SizedBox(height: 4),
                     Text(loc.address, style: const TextStyle(color: Colors.grey, fontSize: 12)),
                     const SizedBox(height: 8),
                     Row(
                       children: [
                         const Icon(LucideIcons.mapPin, size: 12, color: Colors.deepOrange),
                         const SizedBox(width: 4),
                         Text("${loc.distance} away", style: const TextStyle(color: Colors.deepOrange, fontWeight: FontWeight.bold, fontSize: 10)),
                       ],
                     )
                   ],
                 ),
               ),
             )),
          ]
        ],
      ),
    );
  }

  Widget _buildToggleBtn(DeliveryMethod target, String label) {
    final isSelected = method == target;
    return GestureDetector(
      onTap: () => onMethodChanged(target),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          boxShadow: isSelected ? [const BoxShadow(color: Colors.black12, blurRadius: 4)] : [],
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 12,
              color: isSelected ? Colors.deepOrange : Colors.grey,
              letterSpacing: 1.2,
            ),
          ),
        ),
      ),
    );
  }
}
