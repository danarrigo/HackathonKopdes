class Mission {
  final String id;
  final String title;
  final int points;
  bool completed;
  final bool isDaily;

  Mission({
    required this.id,
    required this.title,
    required this.points,
    required this.completed,
    required this.isDaily,
  });
}
