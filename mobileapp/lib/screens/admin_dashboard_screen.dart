
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  int _selectedIndex = 0;
  String _orderType = 'On Demand'; // 'On Demand', 'Out Station'

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leadingWidth: 200,
        leading: Padding(
          padding: const EdgeInsets.only(left: 24),
          child: Row(
            children: [
              const Text("Kanti Sweets", style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: Colors.black)),
              const SizedBox(width: 12),
              Container(padding: const EdgeInsets.all(4), decoration: BoxDecoration(border: Border.all(color: Colors.grey.shade300), borderRadius: BorderRadius.circular(4)), child: const Icon(LucideIcons.panelLeft, size: 16, color: Colors.black54)),
            ],
          ),
        ),
        actions: [
          const Text("Vinit", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black)),
          const SizedBox(width: 8),
          const CircleAvatar(backgroundColor: Colors.black, radius: 16, child: Text("V", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12))),
          const SizedBox(width: 24),
        ],
      ),
      body: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Sidebar
          Container(
            width: 240,
            decoration: const BoxDecoration(
              color: Colors.white,
              border: Border(right: BorderSide(color: Colors.black12)),
            ),
            child: ListView(
              padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
              children: [
                _buildSidebarItem(0, "Dashboard", LucideIcons.layoutDashboard),
                const SizedBox(height: 16),
                _buildSidebarItem(1, "Category", LucideIcons.list),
                _buildSidebarItem(2, "Allergen", LucideIcons.alertTriangle),
                _buildSidebarItem(3, "Product", LucideIcons.package),
                _buildSidebarItem(4, "Orders", LucideIcons.shoppingBag),
                _buildSidebarItem(5, "Out Station Orders", LucideIcons.truck),
                const SizedBox(height: 16),
                _buildSidebarItem(6, "Brand", LucideIcons.star),
                _buildSidebarItem(7, "Store", LucideIcons.store),
                const SizedBox(height: 16),
                _buildSidebarItem(8, "Enquiry", LucideIcons.helpCircle),
                _buildSidebarItem(9, "Reports", LucideIcons.fileText),
                _buildSidebarItem(10, "Settings", LucideIcons.settings),
              ],
            ),
          ),
          
          // Main Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                   const Text("Welcome to Kanti Sweets", style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900)),
                   const SizedBox(height: 24),
                   
                   // Filter Toggle
                   Container(
                     decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(8)),
                     padding: const EdgeInsets.all(4),
                     child: Row(
                       mainAxisSize: MainAxisSize.min,
                       children: [
                         _buildToggleItem('On Demand'),
                         _buildToggleItem('Out Station'),
                       ],
                     ),
                   ),
                   const SizedBox(height: 32),
                   
                   // Stats Grid
                   LayoutBuilder(
                     builder: (context, constraints) {
                       int crossAxisCount = constraints.maxWidth > 1100 ? 4 : (constraints.maxWidth > 800 ? 3 : 2);
                       return GridView.count(
                         crossAxisCount: crossAxisCount,
                         crossAxisSpacing: 24,
                         mainAxisSpacing: 24,
                         childAspectRatio: 1.8,
                         shrinkWrap: true,
                         physics: const NeverScrollableScrollPhysics(),
                         children: [
                            _buildStatCard("Total Orders", "2,368", LucideIcons.layers, Colors.black87),
                            _buildStatCard("Completed", "986", LucideIcons.checkCircle, Colors.green),
                            _buildStatCard("In Progress", "39", LucideIcons.loader, Colors.orange),
                            _buildStatCard("Mobile App Orders", "1,318", LucideIcons.smartphone, Colors.blue),
                            
                            _buildStatCard("Web App Orders", "1,050", LucideIcons.monitor, Colors.indigo),
                            _buildStatCard("Pending Approval", "0", LucideIcons.hourglass, Colors.deepOrange),
                            _buildStatCard("Pending Payment", "1,334", LucideIcons.indianRupee, Colors.amber.shade700),
                            _buildStatCard("Rejected", "9", LucideIcons.ban, Colors.red),
                         ],
                       );
                     }
                   ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildToggleItem(String title) {
    bool isSelected = _orderType == title;
    return GestureDetector(
      onTap: () => setState(() => _orderType = title),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(6),
          boxShadow: isSelected ? [const BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 1))] : [],
        ),
        child: Text(title, style: TextStyle(
          fontWeight: FontWeight.bold, 
          fontSize: 13,
          color: isSelected ? Colors.black : Colors.grey.shade600
        )),
      ),
    );
  }

  Widget _buildSidebarItem(int index, String label, IconData icon) {
    bool isSelected = _selectedIndex == index;
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => setState(() => _selectedIndex = index),
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? Colors.grey.shade200 : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            children: [
              Icon(icon, size: 18, color: isSelected ? Colors.black : Colors.grey.shade600),
              const SizedBox(width: 12),
              Text(label, style: TextStyle(
                fontWeight: isSelected ? FontWeight.w900 : FontWeight.w500,
                color: isSelected ? Colors.black : Colors.grey.shade700,
                fontSize: 13
              )),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
           BoxShadow(color: Colors.grey.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4))
        ]
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
           Row(
             children: [
               Icon(icon, size: 20, color: color),
               const SizedBox(width: 12),
               Text(title, style: TextStyle(color: Colors.grey.shade600, fontWeight: FontWeight.w600, fontSize: 13)),
             ],
           ),
           Text(value, style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w900, letterSpacing: -1)),
        ],
      ),
    );
  }
}
