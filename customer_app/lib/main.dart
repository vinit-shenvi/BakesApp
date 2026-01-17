
import 'package:flutter/material.dart';

void main() {
  runApp(const BakesAndFlakesApp());
}

class BakesAndFlakesApp extends StatelessWidget {
  const BakesAndFlakesApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Bakes & Flakes',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        primarySwatch: Colors.orange,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFEA580C), // Orange-600
          secondary: const Color(0xFFD97706), // Amber-600
          surface: const Color(0xFFFFFAF5), // Warm white
        ),
        fontFamily: 'Roboto',
      ),
      home: const CustomerHomePage(),
    );
  }
}

class CustomerHomePage extends StatefulWidget {
  const CustomerHomePage({super.key});

  @override
  State<CustomerHomePage> createState() => _CustomerHomePageState();
}

class _CustomerHomePageState extends State<CustomerHomePage> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      body: [
        const HomeTab(),
        const Center(child: Text("Festive Specials (Coming Soon)")),
        const Center(child: Text("Account (Coming Soon)")),
      ][_selectedIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (idx) => setState(() => _selectedIndex = idx),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home_filled), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.celebration_outlined), selectedIcon: Icon(Icons.celebration), label: 'Festive'),
          NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Account'),
        ],
      ),
    );
  }
}

class HomeTab extends StatelessWidget {
  const HomeTab({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar.large(
          title: RichText(
            text: TextSpan(
              style: const TextStyle(color: Colors.black87, fontSize: 24, fontWeight: FontWeight.bold),
              children: [
                const TextSpan(text: "Bakes\n"),
                TextSpan(text: "& Flakes", style: TextStyle(color: Theme.of(context).colorScheme.primary)),
              ],
            ),
          ),
          actions: [
            IconButton(onPressed: () {}, icon: const Icon(Icons.search)),
            IconButton(onPressed: () {}, icon: const Icon(Icons.shopping_bag_outlined)),
          ],
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Container(
              height: 180,
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFFEA580C), Color(0xFFD97706)]),
                borderRadius: BorderRadius.circular(24),
              ),
              child: Stack(
                children: [
                  Positioned(
                    right: -20,
                    top: -20,
                    child: Icon(Icons.cookie, size: 150, color: Colors.white.withOpacity(0.2)),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(8)),
                          child: const Text("SANKRANTI SPECIAL", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFEA580C))),
                        ),
                        const SizedBox(height: 8),
                        const Text("Til-Gul Magic", style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold)),
                        const Text("Traditional Sweets", style: TextStyle(color: Colors.white70, fontSize: 14)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        SliverPadding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          sliver: SliverGrid(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              childAspectRatio: 0.75,
            ),
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                final products = [
                  {'name': 'Almond Brownie', 'price': '₹450', 'img': 'https://picsum.photos/200'},
                  {'name': 'Kaju Katli', 'price': '₹850', 'img': 'https://picsum.photos/201'},
                  {'name': 'Mysore Pak', 'price': '₹550', 'img': 'https://picsum.photos/202'},
                  {'name': 'Motichoor', 'price': '₹350', 'img': 'https://picsum.photos/203'},
                ];
                final p = products[index % products.length];
                return ProductCard(name: p['name']!, price: p['price']!, img: p['img']!);
              },
              childCount: 4,
            ),
          ),
        ),
        const SliverToBoxAdapter(child: SizedBox(height: 100)),
      ],
    );
  }
}

class ProductCard extends StatelessWidget {
  final String name;
  final String price;
  final String img;

  const ProductCard({super.key, required this.name, required this.price, required this.img});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Container(
              color: Colors.grey[200],
              child: Image.network(img, width: double.infinity, fit: BoxFit.cover),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(price, style: TextStyle(color: Theme.of(context).colorScheme.primary, fontWeight: FontWeight.w900, fontSize: 16)),
                    const CircleAvatar(
                      radius: 12,
                      backgroundColor: Colors.black,
                      child: Icon(Icons.add, size: 16, color: Colors.white),
                    )
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
