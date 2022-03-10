import 'package:flutter/material.dart';

class CustomAlertDialog extends StatefulWidget {
  const CustomAlertDialog(
      {Key? key,
      required this.title,
      required this.description,
      this.okButton,
      this.continueButton})
      : super(key: key);

  final String title, description;
  final String? continueButton, okButton;

  @override
  _CustomAlertDialogState createState() => _CustomAlertDialogState();
}

class _CustomAlertDialogState extends State<CustomAlertDialog> {
  @override
  Widget build(BuildContext context) {
    return Dialog(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15.0),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: 15),
          Text(
            widget.title,
            style: const TextStyle(
              fontSize: 18.0,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 15),
          Text(widget.description),
          const SizedBox(height: 20),
          if (widget.continueButton != null)
            Column(
              children: [
                const Divider(
                  height: 1,
                ),
                SizedBox(
                  width: MediaQuery.of(context).size.width,
                  height: 50,
                  child: InkWell(
                    highlightColor: Colors.grey[200],
                    onTap: () {
                      Navigator.of(context).pop();
                    },
                    child: Center(
                      child: Text(
                        widget.continueButton!,
                        style: const TextStyle(
                          fontSize: 18.0,
                          color: Colors.blue,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          if (widget.okButton != null)
            Column(
              children: [
                const Divider(
                  height: 1,
                ),
                SizedBox(
                  width: MediaQuery.of(context).size.width,
                  height: 50,
                  child: InkWell(
                    borderRadius: const BorderRadius.only(
                      bottomLeft: Radius.circular(15.0),
                      bottomRight: Radius.circular(15.0),
                    ),
                    highlightColor: Colors.grey[200],
                    onTap: () {
                      Navigator.of(context).pop();
                    },
                    child: Center(
                      child: Text(
                        widget.okButton!,
                        style: const TextStyle(
                          fontSize: 16.0,
                          fontWeight: FontWeight.normal,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            )
        ],
      ),
    );
  }
}
