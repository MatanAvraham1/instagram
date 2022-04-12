import 'package:flutter/material.dart';

class ReelTile extends StatelessWidget {
  const ReelTile({
    Key? key,
    required this.index,
  }) : super(key: key);

  final int index;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.accents[index],
      child: Center(
        child: Text(
          '$index',
          style: const TextStyle(fontSize: 48, color: Colors.white),
        ),
      ),
    );
  }
}
