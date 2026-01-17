
import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:math' as math;

void main() {
  runApp(const DeliveryPartnerApp());
}

// --- Models ---
enum OrderStatus { newRequest, accepted, arrivedAtStore, pickedUp, delivered }

class Order {
  final String id;
  final String customerName;
  final String storeName;
  final String storeAddress;
  final String customerAddress;
  final double amount;
  final double distanceKm;
  final List<String> items;
  OrderStatus status;

  Order({
    required this.id,
    required this.customerName,
    required this.storeName,
    required this.storeAddress,
    required this.customerAddress,
    required this.amount,
    required this.distanceKm,
    required this.items,
    this.status = OrderStatus.newRequest,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      customerName: json['customerName'] ?? 'Unknown',
      storeName: json['storeName'] ?? 'Kanti Bakes',
      storeAddress: json['storeAddress'] ?? 'Sector 7, HSR Layout',
      customerAddress: json['customerAddress'] ?? 'Pickup',
      amount: (json['amount'] ?? 0).toDouble(),
      distanceKm: (json['distanceKm'] ?? 2.0).toDouble(),
      items: List<String>.from(json['items'] ?? []),
      status: _parseStatus(json['status']),
    );
  }

  static OrderStatus _parseStatus(String? status) {
    switch (status) {
      case 'accepted': return OrderStatus.accepted;
      case 'arrivedAtStore': return OrderStatus.arrivedAtStore;
      case 'pickedUp': return OrderStatus.pickedUp;
      case 'delivered': return OrderStatus.delivered;
      default: return OrderStatus.newRequest;
    }
  }

  String get statusString => status.toString().split('.').last;
}

// --- Main App ---
class DeliveryPartnerApp extends StatelessWidget {
  const DeliveryPartnerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Kanti Delivery',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        primarySwatch: Colors.teal,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF059669), // Emerald-600
          secondary: const Color(0xFF10B981), // Emerald-500
          surface: const Color(0xFFF0FDF4),
        ),
        fontFamily: 'Roboto',
      ),
      home: const DeliveryMainScreen(),
    );
  }
}

class DeliveryMainScreen extends StatefulWidget {
  const DeliveryMainScreen({super.key});

  @override
  State<DeliveryMainScreen> createState() => _DeliveryMainScreenState();
}

class _DeliveryMainScreenState extends State<DeliveryMainScreen> {
  int _selectedIndex = 0;
  bool _isOnline = true;
  double _totalEarnings = 4250.50;
  List<Order> _orders = [];
  Order? _activeOrder;
  Timer? _pollingTimer;

  @override
  void initState() {
    super.initState();
    _fetchOrders();
    _pollingTimer = Timer.periodic(const Duration(seconds: 3), (timer) => _fetchOrders());
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    super.dispose();
  }

  Future<void> _fetchOrders() async {
    if (!_isOnline) return;
    try {
      final response = await http.get(Uri.parse('http://localhost:5000/api/orders'));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        final allOrders = data.map((json) => Order.fromJson(json)).toList();
        
        setState(() {
          // Filter for active task
          final myActive = allOrders.firstWhere(
            (o) => o.status != OrderStatus.newRequest && o.status != OrderStatus.delivered, 
            orElse: () => Order(id: '', customerName: '', storeName: '', storeAddress: '', customerAddress: '', amount: 0, distanceKm: 0, items: [], status: OrderStatus.delivered) // dummy
          );
          
          if (myActive.id.isNotEmpty) {
            _activeOrder = myActive;
          } else if (_activeOrder != null && _activeOrder!.status == OrderStatus.delivered) {
             _activeOrder = null; // Clear if it was delivered
          }

          // Available orders
          _orders = allOrders.where((o) => o.status == OrderStatus.newRequest).toList();
        });
      }
    } catch (e) {
      print("Error fetching orders: $e");
    }
  }

  Future<void> _updateOrderStatus(Order order, OrderStatus newStatus) async {
    // Optimistic update
    setState(() {
      order.status = newStatus;
      if (newStatus == OrderStatus.delivered) {
        _totalEarnings += order.amount;
        _activeOrder = null;
      } else {
        _activeOrder = order;
      }
    });

    try {
      await http.patch(
        Uri.parse('http://localhost:5000/api/orders/${order.id}/status'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'status': order.statusString}),
      );
      _fetchOrders(); // Refresh to be sure
    } catch (e) {
      print("Error updating status: $e");
    }
  }

  void _acceptOrder(Order order) {
    _updateOrderStatus(order, OrderStatus.accepted);
  }

  @override
  Widget build(BuildContext context) {
    final tabs = [
      HomeTab(
        isOnline: _isOnline,
        availableOrders: _orders,
        activeOrder: _activeOrder,
        onAccept: _acceptOrder,
        onUpdateStatus: (status) {
          if (_activeOrder != null) _updateOrderStatus(_activeOrder!, status);
        },
      ),
      EarningsTab(totalEarnings: _totalEarnings),
      const Center(child: Text("Profile (Implemented in previous step)")),
    ];

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('Kanti Delivery', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: ActionChip(
              avatar: Icon(_isOnline ? Icons.power_settings_new : Icons.power_off, size: 16, color: _isOnline ? Colors.white : Colors.grey),
              label: Text(_isOnline ? "Online" : "Offline"),
              backgroundColor: _isOnline ? const Color(0xFF059669) : Colors.grey[200],
              labelStyle: TextStyle(color: _isOnline ? Colors.white : Colors.grey[600], fontWeight: FontWeight.bold),
              onPressed: () => setState(() => _isOnline = !_isOnline),
            ),
          )
        ],
      ),
      body: tabs[_selectedIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (idx) => setState(() => _selectedIndex = idx),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home_filled), label: 'Tasks'),
          NavigationDestination(icon: Icon(Icons.wallet_outlined), selectedIcon: Icon(Icons.wallet), label: 'Earnings'),
          NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}

// --- Tabs ---

class HomeTab extends StatelessWidget {
  final bool isOnline;
  final List<Order> availableOrders;
  final Order? activeOrder;
  final Function(Order) onAccept;
  final Function(OrderStatus) onUpdateStatus;

  const HomeTab({
    super.key,
    required this.isOnline,
    required this.availableOrders,
    this.activeOrder,
    required this.onAccept,
    required this.onUpdateStatus,
  });

  @override
  Widget build(BuildContext context) {
    if (!isOnline) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.cloud_off, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text("You are Offline", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.grey)),
            Text("Go online to receive orders", style: TextStyle(color: Colors.grey)),
          ],
        ),
      );
    }

    if (activeOrder != null) {
      return ActiveOrderView(order: activeOrder!, onUpdateStatus: onUpdateStatus);
    }

    if (availableOrders.isEmpty) {
      return const Center(child: Text("Searching for orders...", style: TextStyle(color: Colors.grey)));
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text("New Requests", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        ...availableOrders.map((order) => OrderCard(order: order, onAccept: () => onAccept(order))),
      ],
    );
  }
}

class EarningsTab extends StatelessWidget {
  final double totalEarnings;
  const EarningsTab({super.key, required this.totalEarnings});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text("Total Earnings", style: TextStyle(fontSize: 14, color: Colors.grey, fontWeight: FontWeight.bold)),
          Text("₹${totalEarnings.toStringAsFixed(2)}", style: const TextStyle(fontSize: 48, fontWeight: FontWeight.w900, color: Color(0xFF059669))),
          const SizedBox(height: 16),
          Container(
             padding: const EdgeInsets.all(12),
             decoration: BoxDecoration(color: Colors.green[50], borderRadius: BorderRadius.circular(8)),
             child: const Text("Keep it up! Top earner in HSR Layout.", style: TextStyle(color: Color(0xFF059669), fontWeight: FontWeight.bold)),
          )
        ],
      ),
    );
  }
}

// --- Widgets ---

class OrderCard extends StatelessWidget {
  final Order order;
  final VoidCallback onAccept;

  const OrderCard({super.key, required this.order, required this.onAccept});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(order.storeName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    Text(order.storeAddress, style: const TextStyle(color: Colors.grey, fontSize: 12)),
                  ],
                ),
                Text("₹${order.amount}", style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: Color(0xFF059669))),
              ],
            ),
            const Divider(height: 32),
            Row(
              children: [
                const Icon(Icons.location_on, color: Colors.teal, size: 20),
                const SizedBox(width: 8),
                Expanded(child: Text("Drop: ${order.customerAddress}", style: const TextStyle(fontWeight: FontWeight.bold))),
                Text("${order.distanceKm} km", style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
              ],
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: onAccept,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF059669),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Text("ACCEPT DELIVERY"),
              ),
            )
          ],
        ),
      ),
    );
  }
}

class ActiveOrderView extends StatelessWidget {
  final Order order;
  final Function(OrderStatus) onUpdateStatus;

  const ActiveOrderView({super.key, required this.order, required this.onUpdateStatus});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Map Area
        Expanded(
          flex: 2,
          child: Stack(
            children: [
              const SimulatedMapView(),
              Positioned(
                bottom: 16, right: 16,
                child: FloatingActionButton(
                  onPressed: () {},
                  backgroundColor: Colors.white,
                  child: const Icon(Icons.my_location, color: Colors.black),
                ),
              ),
              Positioned(
                top: 16, left: 16,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(color: Colors.black87, borderRadius: BorderRadius.circular(20)),
                  child: Text(
                    _getStatusText(order.status),
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ),
              )
            ],
          ),
        ),
        // Action Sheet
        Container(
          padding: const EdgeInsets.all(24),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
            boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 20)],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(order.status == OrderStatus.accepted || order.status == OrderStatus.arrivedAtStore ? "PICKUP FROM" : "DELIVER TO", 
                           style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.grey, letterSpacing: 1.2)),
                      const SizedBox(height: 4),
                      Text(order.status == OrderStatus.accepted || order.status == OrderStatus.arrivedAtStore ? order.storeName : order.customerName, 
                           style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                      Text(order.status == OrderStatus.accepted || order.status == OrderStatus.arrivedAtStore ? order.storeAddress : order.customerAddress, 
                           style: const TextStyle(color: Colors.grey)),
                    ],
                  ),
                  Container(
                    width: 50, height: 50,
                    decoration: BoxDecoration(color: Colors.green[50], borderRadius: BorderRadius.circular(16)),
                    child: const Icon(Icons.phone, color: Color(0xFF059669)),
                  )
                ],
              ),
              const SizedBox(height: 24),
              if (order.status == OrderStatus.accepted)
                _SliderButton(label: "SWIPE TO ARRIVE", onTap: () => onUpdateStatus(OrderStatus.arrivedAtStore)),
              if (order.status == OrderStatus.arrivedAtStore)
                _SliderButton(label: "CONFIRM PICKUP", onTap: () => onUpdateStatus(OrderStatus.pickedUp)),
              if (order.status == OrderStatus.pickedUp)
                _SliderButton(label: "COMPLETE DELIVERY", onTap: () => onUpdateStatus(OrderStatus.delivered), color: const Color(0xFFEA580C)),
            ],
          ),
        ),
      ],
    );
  }

  String _getStatusText(OrderStatus status) {
    switch (status) {
      case OrderStatus.accepted: return 'Navigating to Store';
      case OrderStatus.arrivedAtStore: return 'Arrived at Store';
      case OrderStatus.pickedUp: return 'Navigating to Customer';
      default: return 'Active Task';
    }
  }
}

class _SliderButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  final Color color;

  const _SliderButton({required this.label, required this.onTap, this.color = const Color(0xFF059669)});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 56,
      child: ElevatedButton(
        onPressed: onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          elevation: 0,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const SizedBox(width: 24),
            Text(label, style: const TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.2)),
            const Icon(Icons.arrow_forward_ios, size: 16),
          ],
        ),
      ),
    );
  }
}

class SimulatedMapView extends StatefulWidget {
  const SimulatedMapView({super.key});
  @override
  State<SimulatedMapView> createState() => _SimulatedMapViewState();
}

class _SimulatedMapViewState extends State<SimulatedMapView> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  
  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 4))..repeat(reverse: true);
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFE5E5E5),
      child: Stack(
        children: [
          // Simulated Roads
          CustomPaint(painter: MapPainter(), size: Size.infinite),
          
          // Moving Marker
          AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              return Positioned(
                top: 100 + (_controller.value * 200),
                left: 150 + (_controller.value * 50),
                child: const Icon(Icons.navigation, color: Colors.blue, size: 40),
              );
            },
          ),
        ],
      ),
    );
  }
}

class MapPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = Colors.white..strokeWidth = 20..style = PaintingStyle.stroke;
    final path = Path();
    path.moveTo(150, 0);
    path.lineTo(150, size.height);
    canvas.drawPath(path, paint);
    
    path.reset();
    path.moveTo(0, 300);
    path.lineTo(size.width, 350);
    canvas.drawPath(path, paint);
  }
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
