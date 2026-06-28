import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/shop_item.dart';
import '../../providers/koperasi_provider.dart';

/// Reusable card widget for in-app power-up shop items.
/// Shows the item icon, title, description, cost (in points), and a
/// "Beli" / "Poin Kurang" action button with confirmation dialog.
class ShopItemCard extends StatelessWidget {
  final ShopItem item;
  const ShopItemCard({super.key, required this.item});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<KoperasiProvider>();
    final canAfford = provider.points >= item.cost;

    void showSnackBar(String message) {
      ScaffoldMessenger.of(context).clearSnackBars();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(message,
              style: const TextStyle(fontWeight: FontWeight.bold)),
          behavior: SnackBarBehavior.floating,
          duration: const Duration(seconds: 2),
        ),
      );
    }

    Future<void> handleBuy() async {
      if (!canAfford) {
        showSnackBar(
            'Poin tidak mencukupi. Butuh ${item.cost} poin untuk ${item.title}.');
        return;
      }
      final confirmed = await showDialog<bool>(
        context: context,
        builder: (dialogContext) => AlertDialog(
          title: Text('Beli ${item.title}?'),
          content: Text(
              'Harga: ${item.cost} poin.\nSaldo Anda: ${provider.points} poin.\n\nSaldo setelah pembelian: ${provider.points - item.cost} poin.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext, false),
              child: const Text('Batal'),
            ),
            TextButton(
              onPressed: () => Navigator.pop(dialogContext, true),
              child: const Text('Beli',
                  style: TextStyle(
                      color: Color(0xFFFACC15),
                      fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      );
      if (confirmed != true) return;
      final msg = await provider.buyShopItem(item);
      if (context.mounted) showSnackBar(msg);
    }

    return Card(
      color: const Color(0xFF718096),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          boxShadow: [BoxShadow(color: item.bgGlow, blurRadius: 15)],
        ),
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 8),
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                  color: Colors.white, borderRadius: BorderRadius.circular(12)),
              child: Icon(item.icon, color: item.iconColor, size: 24),
            ),
            const SizedBox(height: 8),
            Text(item.title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Expanded(
              child: Text(item.description,
                  textAlign: TextAlign.center,
                  maxLines: 3,
                  style:
                      const TextStyle(color: Colors.white70, fontSize: 8.5))),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text('⭐', style: TextStyle(fontSize: 10)),
                const SizedBox(width: 2),
                Text('${item.cost} poin',
                    style: TextStyle(
                        color: canAfford
                            ? const Color(0xFFFCD34D)
                            : Colors.white38,
                        fontSize: 11,
                        fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 8),
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: canAfford ? handleBuy : null,
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  decoration: BoxDecoration(
                    color: canAfford
                        ? Colors.white.withOpacity(0.2)
                        : Colors.black.withOpacity(0.25),
                    border: Border.all(
                        color:
                            canAfford ? Colors.white38 : Colors.white12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  alignment: Alignment.center,
                  child: Text(
                    canAfford ? 'Beli' : 'Poin Kurang',
                    style: TextStyle(
                        color:
                            canAfford ? Colors.white : Colors.white38,
                        fontSize: 10,
                        fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
