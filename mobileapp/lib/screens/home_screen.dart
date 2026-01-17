
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';

import '../data/mock_data.dart';
import '../models/types.dart';
import '../providers/cart_provider.dart';
import '../widgets/product_card.dart';
import '../widgets/checkout_modal.dart';
import '../widgets/location_modal.dart';
import '../widgets/profile_view.dart';
import '../widgets/floating_kites_bg.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with SingleTickerProviderStateMixin {
  String _activeTab = 'home'; // home, gifts, account
  String? _selectedCategory;
  bool _isSearchMode = false;
  String _searchQuery = '';
  
  DeliveryMethod _deliveryMethod = DeliveryMethod.delivery;
  Location _selectedLocation = Location(id: '1', name: 'Kanti HSR Kitchen', address: 'Sector 7, HSR, Bangalore', distance: '1.2 km', status: 'Open Now');
  
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _clearFilter() {
    setState(() {
      _selectedCategory = null;
      _activeTab = 'home';
      _isSearchMode = false;
      _searchQuery = '';
      _searchController.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFDFCF8), // Creamy background
      body: Stack(
        children: [
          // Dynamic Background
          const Positioned.fill(child: FloatingKitesBackground()),
          
          // Main Body
          _buildBody(),
          
          // Header (Sticky)
          Positioned(
            top: 0, left: 0, right: 0,
            child: _buildHeader(),
          ),

          // Floating Cart Bar
          Positioned(
            bottom: 100, // Above nav bar
            left: 16, right: 16,
            child: Consumer<CartProvider>(
              builder: (context, cart, _) {
                if (cart.itemCount == 0) return const SizedBox.shrink();
                return GestureDetector(
                  onTap: () => _showCheckoutModal(context),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.95),
                      borderRadius: BorderRadius.circular(32),
                      boxShadow: [
                         BoxShadow(color: Colors.orange.withOpacity(0.2), blurRadius: 20, offset: const Offset(0, 10))
                      ],
                      border: Border.all(color: Colors.white, width: 2),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(colors: [Colors.orange, Colors.deepOrange]),
                                borderRadius: BorderRadius.circular(16),
                                boxShadow: const [BoxShadow(color: Colors.orangeAccent, blurRadius: 10)],
                              ),
                              child: const Icon(LucideIcons.shoppingBag, color: Colors.white, size: 24),
                            ),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text("KANTI BASKET", style: TextStyle(color: Colors.deepOrange, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.2)),
                                Text("₹${cart.totalAmount.toStringAsFixed(2)}", style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
                              ],
                            )
                          ],
                        ),
                        Container(
                           padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                           decoration: BoxDecoration(color: Colors.deepOrange, borderRadius: BorderRadius.circular(16)),
                           child: const Text("CHECKOUT", style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 12, letterSpacing: 1.2)),
                        )
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // Bottom Nav
          Positioned(
            bottom: 0, left: 0, right: 0,
            child: _buildBottomNav(),
          ),
        ],
      ),
    );
  }

  Widget _buildBody() {
    // Add top padding for header
    final padding = EdgeInsets.only(top: 80, bottom: 180, left: 16, right: 16); 

    if (_activeTab == 'account') {
      return Padding(
        padding: const EdgeInsets.only(top: 80),
        child: ProfileView(
           // params can be passed down if needed
        ),
      );
    }

    if (_isSearchMode) {
      final results = _searchQuery.isEmpty ? <Product>[] : PRODUCTS.where((p) => p.name.toLowerCase().contains(_searchQuery.toLowerCase())).toList();
      return ListView(
        padding: padding,
        children: [
          if (_searchQuery.isNotEmpty) ...[
            Text("SEARCH RESULTS", style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
            Text("Found ${results.length} matches", style: const TextStyle(color: Colors.orange, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
            const SizedBox(height: 16),
            if (results.isEmpty)
               const Padding(
                 padding: EdgeInsets.all(32.0),
                 child: Center(child: Text("No matches found")),
               )
            else
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.65,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                ),
                itemCount: results.length,
                itemBuilder: (context, index) => ProductCard(product: results[index], isGridView: true),
              ),
          ] else ...[
             const Padding(
               padding: EdgeInsets.symmetric(vertical: 32.0),
               child: Text("TRENDING FESTIVE SEARCHES", style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.2)),
             ),
             Wrap(
               spacing: 8, runSpacing: 8,
               children: ['Til Gul', 'Peanut Chikki', 'Sesame Cookies'].map((tag) => ActionChip(
                 label: Text(tag),
                 onPressed: () {
                   setState(() {
                     _searchQuery = tag;
                     _searchController.text = tag;
                   });
                 },
                 backgroundColor: Colors.white,
                 side: const BorderSide(color: Colors.orangeAccent),
               )).toList(),
             )
          ]
        ],
      );
    }

    // Default Home View
    return ListView(
      padding: EdgeInsets.zero, // We handle padding inside elements or use slivers, but let's stick to simple listview
      children: [
        const SizedBox(height: 100), // Header space
        
        if (_selectedCategory == null) ...[
          // Brand Logo
          Center(
            child: Column(
              children: [
                 Text("Kanti", style: GoogleFonts.dancingScript(fontSize: 40, color: Colors.deepOrange, fontWeight: FontWeight.bold)),
                 RichText(
                   text: const TextSpan(
                     children: [
                       TextSpan(text: "BAKES", style: TextStyle(color: Colors.black, fontSize: 48, fontWeight: FontWeight.w900, fontFamily: 'Times New Roman')), // Using system font fallback
                       TextSpan(text: "\n& FLAKES", style: TextStyle(color: Colors.black, fontSize: 24, fontWeight: FontWeight.w900, height: 0.5)),
                     ]
                   ),
                   textAlign: TextAlign.center,
                 ),
                 const SizedBox(height: 8),
                 Container(
                   padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                   color: Colors.orange,
                   child: const Text("Makar Sankranti Specials", style: TextStyle(color: Colors.white, fontFamily: 'serif')),
                 ),
                 const SizedBox(height: 32),
              ],
            ),
          ),

          // Sankranti Banner
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Container(
              height: 280,
              decoration: BoxDecoration(
                color: Colors.lightBlue,
                borderRadius: BorderRadius.circular(48),
                border: Border.all(color: Colors.white, width: 4),
                boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 20, offset: Offset(0, 10))],
              ),
              child: Stack(
                children: [
                   const Positioned(right: -20, top: -20, child: Icon(LucideIcons.wind, size: 200, color: Colors.white24)),
                   Padding(
                     padding: const EdgeInsets.all(32.0),
                     child: Column(
                       crossAxisAlignment: CrossAxisAlignment.start,
                       mainAxisAlignment: MainAxisAlignment.end,
                       children: [
                         const Text("KAI PO CHE 2025", style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 3)),
                         const SizedBox(height: 8),
                         RichText(
                           text: const TextSpan(
                             style: TextStyle(fontSize: 36, height: 1.1, fontWeight: FontWeight.bold, color: Colors.white),
                             children: [
                               TextSpan(text: "Festive\n"),
                               TextSpan(text: "Til-Gul", style: TextStyle(color: Colors.yellowAccent)),
                               TextSpan(text: " Magic"),
                             ]
                           ),
                         ),
                         const SizedBox(height: 24),
                         ElevatedButton(
                           onPressed: () => setState(() => _selectedCategory = 'Sankranti Specials'),
                           style: ElevatedButton.styleFrom(
                             backgroundColor: Colors.white,
                             foregroundColor: Colors.lightBlue,
                             shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                             padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                           ),
                           child: const Text("EXPLORE SPECIALS", style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12)),
                         )
                       ],
                     ),
                   )
                ],
              ),
            ),
          ),
          const SizedBox(height: 32),
        ],

        // Category Filter Header
        if (_selectedCategory != null)
           Padding(
             padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
             child: Row(
               mainAxisAlignment: MainAxisAlignment.spaceBetween,
               children: [
                 Row(
                   children: [
                     IconButton(icon: const Icon(LucideIcons.arrowLeft), onPressed: _clearFilter),
                     Text(_selectedCategory!.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
                   ],
                 ),
                 TextButton(onPressed: _clearFilter, child: const Text("CLEAR", style: TextStyle(color: Colors.deepOrange, fontWeight: FontWeight.bold)))
               ],
             ),
           ),

        // Product Lists
        ..._buildProductSections(),

        const SizedBox(height: 180), // Footer spacer
      ],
    );
  }
  
  List<Widget> _buildProductSections() {
    final categories = _selectedCategory != null ? [_selectedCategory!] : CATEGORIES;
    
    return categories.map((cat) {
      final products = PRODUCTS.where((p) => p.category == cat).toList();
      if (products.isEmpty) return const SizedBox.shrink();

      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (_selectedCategory == null)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 24, 16, 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(cat.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 20)),
                      Row(
                        children: [
                          Container(width: 24, height: 4, decoration: BoxDecoration(color: Colors.deepOrange, borderRadius: BorderRadius.circular(2))),
                          const SizedBox(width: 8),
                          const Text("PREMIUM SELECTION", style: TextStyle(color: Colors.orange, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.2)),
                        ],
                      )
                    ],
                  ),
                  IconButton(
                    onPressed: () => setState(() => _selectedCategory = cat),
                    icon: const Icon(LucideIcons.chevronRight, color: Colors.deepOrange),
                    style: IconButton.styleFrom(backgroundColor: Colors.white, side: const BorderSide(color: Colors.black12)),
                  )
                ],
              ),
            ),
          
          if (_selectedCategory != null)
            GridView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.65,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
              ),
              itemCount: products.length,
              itemBuilder: (context, index) => ProductCard(product: products[index], isGridView: true),
            )
          else
            SizedBox(
              height: 320,
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                scrollDirection: Axis.horizontal,
                itemCount: products.length,
                separatorBuilder: (_, __) => const SizedBox(width: 16),
                itemBuilder: (context, index) => ProductCard(product: products[index]),
              ),
            ),
        ],
      );
    }).toList();
  }

  Widget _buildHeader() {
    // Backdrop blur simplistic simulation using solid color with opacity
    return Container(
      color: Colors.white.withOpacity(0.95),
      padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top + 8, bottom: 12, left: 16, right: 16),
      child: _isSearchMode 
        ? Row(
            children: [
              IconButton(onPressed: () => setState(() => _isSearchMode = false), icon: const Icon(LucideIcons.arrowLeft, color: Colors.deepOrange)),
              Expanded(
                child: TextField(
                  controller: _searchController,
                  autofocus: true,
                  decoration: const InputDecoration(
                    hintText: "Search sweets...",
                    border: InputBorder.none,
                    hintStyle: TextStyle(fontWeight: FontWeight.bold, color: Colors.black26),
                  ),
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.deepOrange),
                  onChanged: (val) => setState(() => _searchQuery = val),
                ),
              ),
              if(_searchQuery.isNotEmpty)
                IconButton(onPressed: () { _searchController.clear(); setState(() => _searchQuery = ''); }, icon: const Icon(LucideIcons.x, color: Colors.orangeAccent)),
            ],
          )
        : Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                     Row(
                       children: [
                         Icon(_deliveryMethod == DeliveryMethod.delivery ? LucideIcons.truck : LucideIcons.store, size: 12, color: Colors.deepOrange),
                         const SizedBox(width: 4),
                         Text(_deliveryMethod == DeliveryMethod.delivery ? "KANTI EXPRESS" : "STORE PICKUP", style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.deepOrange, letterSpacing: 1)),
                         const SizedBox(width: 4),
                         const Text("• 20MINS", style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.deepOrange, letterSpacing: 1)),
                       ],
                     ),
                     GestureDetector(
                       onTap: () => _showLocationModal(context),
                       child: Row(
                         children: [
                           Text(_deliveryMethod == DeliveryMethod.delivery ? "Home - HSR Layout" : _selectedLocation.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                           const Icon(LucideIcons.chevronDown, size: 16, color: Colors.deepOrange),
                         ],
                       ),
                     ),
                  ],
                ),
              ),
              IconButton(
                onPressed: () => setState(() => _isSearchMode = true),
                icon: const Icon(LucideIcons.search, color: Colors.deepOrange),
                style: IconButton.styleFrom(backgroundColor: Colors.orange.shade50),
              ),
              const SizedBox(width: 8),
              if (_activeTab != 'account')
                GestureDetector(
                   onTap: () => setState(() { _activeTab = 'account'; _selectedCategory = null; }),
                   child: Container(
                     width: 40, height: 40,
                     decoration: BoxDecoration(
                       shape: BoxShape.circle,
                       border: Border.all(color: Colors.white, width: 2),
                       image: const DecorationImage(image: NetworkImage("https://picsum.photos/seed/kantiuser/100/100")),
                       boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4)],
                     ),
                   ),
                ),
            ],
          ),
    );
  }

  Widget _buildBottomNav() {
    return Container(
      color: Colors.white.withOpacity(0.9),
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).padding.bottom + 8, top: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _navItem(LucideIcons.home, "HOME", 'home', () { 
             setState(() { _activeTab = 'home'; _selectedCategory = null; _isSearchMode = false; });
          }),
          _navItem(LucideIcons.partyPopper, "FESTIVE", 'gifts', () {
             setState(() { _activeTab = 'gifts'; _selectedCategory = 'Sankranti Specials'; _isSearchMode = false; });
          }),
          _navItem(LucideIcons.user, "ACCOUNT", 'account', () {
             setState(() { _activeTab = 'account'; _selectedCategory = null; _isSearchMode = false; });
          }),
        ],
      ),
    );
  }

  Widget _navItem(IconData icon, String label, String id, VoidCallback onTap) {
    bool isActive = _activeTab == id;
    if (id == 'gifts' && _selectedCategory == 'Sankranti Specials') isActive = true;
    
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: isActive ? (id == 'gifts' ? Colors.lightBlue.shade50 : Colors.orange.shade50) : Colors.transparent,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: isActive ? (id == 'gifts' ? Colors.lightBlue : Colors.deepOrange) : Colors.grey.shade300, size: 24),
          ),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(fontSize: 8, fontWeight: FontWeight.w900, letterSpacing: 1.2, color: Colors.grey)),
        ],
      ),
    );
  }

  void _showCheckoutModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => CheckoutModal(deliveryMethod: _deliveryMethod, location: _selectedLocation),
    );
  }

  void _showLocationModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => LocationModal(
        method: _deliveryMethod,
        onMethodChanged: (m) => setState(() => _deliveryMethod = m),
        selectedLocation: _selectedLocation,
        onLocationSelected: (l) => setState(() => _selectedLocation = l),
      ),
    );
  }
}
