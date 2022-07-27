import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:instagram/screens/auth/components/online_button.dart';

class ServerDownScreen extends StatelessWidget {
  final Future Function() onTap;
  const ServerDownScreen({Key? key, required this.onTap}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        color: Colors.white,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CachedNetworkImage(
                imageUrl:
                    "https://thumbs.dreamstime.com/b/crying-server-data-cartoon-shape-vector-ilustration-143211031.jpg",
                height: 350,
              ),
              const Text(
                "Our Server is Feelling a Little Down",
                style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey),
              ),
              const SizedBox(
                height: 4,
              ),
              const Text(
                "Please try again in a few moments.",
                style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.black26),
              ),
              const SizedBox(
                height: 20,
              ),
              // TODO: make this elevened button
              SizedBox(
                height: 50,
                width: 200,
                child: OnlineButton(
                  backgroundColor: Colors.red,
                  disabledBackgroundColor: Colors.red[900],
                  onPressed: () async {
                    await onTap();
                  },
                  enableWhen: () {
                    return true;
                  },
                  text: "Try Again",
                  isOutlined: false,
                  textColor: Colors.white,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
