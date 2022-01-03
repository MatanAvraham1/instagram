import 'package:flutter/material.dart';

class CustomButton extends StatefulWidget {
  final String text;
  final Future Function() onPressed;
  final Function disableWhen;
  const CustomButton(
      {Key? key,
      required this.onPressed,
      required this.disableWhen,
      required this.text})
      : super(key: key);

  @override
  _CustomButtonState createState() => _CustomButtonState();
}

class _CustomButtonState extends State<CustomButton> {
  bool isLoading = false;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(4),
      child: SizedBox(
        height: 50,
        width: MediaQuery.of(context).size.width - 40,
        child: MaterialButton(
          onPressed: isLoading
              ? null
              : widget.disableWhen()
                  ? () async {
                      setState(() {
                        isLoading = true;
                      });
                      await widget.onPressed();
                      setState(() {
                        isLoading = false;
                      });
                    }
                  : null,
          child: isLoading
              ? const SizedBox(
                  height: 25,
                  width: 25,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: Colors.white,
                  ))
              : Text(widget.text),
          color: Colors.blue,
          disabledColor: Colors.blue[900],
        ),
      ),
    );
  }
}
