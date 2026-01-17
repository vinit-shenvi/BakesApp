
import 'dart:math';
import 'package:flutter/material.dart';

class FloatingKitesBackground extends StatefulWidget {
  const FloatingKitesBackground({super.key});

  @override
  State<FloatingKitesBackground> createState() => _FloatingKitesBackgroundState();
}

class _FloatingKitesBackgroundState extends State<FloatingKitesBackground> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final List<Kite> _kites = [];
  final Random _random = Random();

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 10))..repeat();
    
    // Generate random kites
    for (int i = 0; i < 8; i++) {
      _kites.add(_generateKite());
    }
  }

  Kite _generateKite() {
    return Kite(
      x: _random.nextDouble() * 400, // Random start X
      y: _random.nextDouble() * 800 + 800, // Start below screen roughly
      size: _random.nextDouble() * 40 + 20,
      color: Colors.primaries[_random.nextInt(Colors.primaries.length)].withOpacity(0.3),
      speed: _random.nextDouble() * 2 + 1,
      angle: _random.nextDouble() * 0.5 - 0.25,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(
          painter: KitesPainter(_kites, _controller.value),
          size: Size.infinite,
        );
      },
    );
  }
}

class Kite {
  double x;
  double y;
  double size;
  Color color;
  double speed;
  double angle;

  Kite({required this.x, required this.y, required this.size, required this.color, required this.speed, required this.angle});
}

class KitesPainter extends CustomPainter {
  final List<Kite> kites;
  final double progress;

  KitesPainter(this.kites, this.progress);

  @override
  void paint(Canvas canvas, Size size) {
    for (var kite in kites) {
      // Update position
      kite.y -= kite.speed;
      kite.x += sin(kite.y * 0.01) * 0.5; // Slight sway

      // Reset if off top
      if (kite.y < -100) {
        kite.y = size.height + 100;
        kite.x = Random().nextDouble() * size.width;
      }

      final paint = Paint()..color = kite.color;
      final path = Path();
      
      // Draw Diamond Kite Shape
      canvas.save();
      canvas.translate(kite.x, kite.y);
      canvas.rotate(kite.angle);

      path.moveTo(0, -kite.size); // Top tip
      path.lineTo(kite.size * 0.6, 0); // Right tip
      path.lineTo(0, kite.size); // Bottom tip
      path.lineTo(-kite.size * 0.6, 0); // Left tip
      path.close();

      canvas.drawPath(path, paint);

      // String
      final stringPaint = Paint()
        ..color = Colors.grey.withOpacity(0.1)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1;
      
      final stringPath = Path();
      stringPath.moveTo(0, kite.size);
      stringPath.quadraticBezierTo(10, kite.size + 20, -5, kite.size + 50);
      canvas.drawPath(stringPath, stringPaint);

      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
