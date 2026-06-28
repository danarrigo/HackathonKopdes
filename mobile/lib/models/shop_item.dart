import 'package:flutter/material.dart';

class ShopItem {
  final String id;
  final String title;
  final String description;
  final int cost;
  int ownedCount;
  final IconData icon;
  final Color iconColor;
  final Color bgGlow;

  ShopItem({
    required this.id,
    required this.title,
    required this.description,
    required this.cost,
    required this.ownedCount,
    required this.icon,
    required this.iconColor,
    required this.bgGlow,
  });
}
