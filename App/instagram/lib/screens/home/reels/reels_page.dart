import 'package:flutter/material.dart';
import 'package:instagram/screens/home/components/reel_tile.dart';
import 'package:tiktoklikescroller/tiktoklikescroller.dart';

class ReelsPage extends StatefulWidget {
  const ReelsPage({Key? key}) : super(key: key);

  @override
  State<ReelsPage> createState() => _ReelsPageState();
}

class _ReelsPageState extends State<ReelsPage>
    with AutomaticKeepAliveClientMixin {
  @override
  Widget build(BuildContext context) {
    super.build(context);

    return MaterialApp(
      home: Scaffold(
        body: Stack(
          children: [
            TikTokStyleFullPageScroller(
              contentSize: Colors.accents.length,
              builder: (BuildContext context, int index) {
                return ReelTile(
                  index: index,
                );
              },
            ),
            SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: const [
                    Text(
                      "Reels",
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold),
                    ),
                    Icon(
                      Icons.camera,
                      color: Colors.white,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  bool get wantKeepAlive => true;
}
