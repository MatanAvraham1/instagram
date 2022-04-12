import 'package:flutter/material.dart';

class CustomButton extends StatefulWidget {
  final Color? textColor;
  final double strokeHeight;
  final double borderRadius;
  final bool isOutlined;
  final String text;
  final Future Function() onPressed;
  final Function enableWhen;
  final bool expanded;

  const CustomButton(
      {Key? key,
      required this.onPressed,
      required this.enableWhen,
      required this.text,
      this.expanded = false,
      this.borderRadius = 4,
      this.isOutlined = false,
      this.strokeHeight = 25,
      this.textColor})
      : super(key: key);

  @override
  _CustomButtonState createState() => _CustomButtonState();
}

class _CustomButtonState extends State<CustomButton> {
  bool isLoading = false;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(widget.borderRadius),
      child: SizedBox(
        height: widget.expanded ? null : 50,
        width: widget.expanded ? null : 330,
        child: MaterialButton(
          color: widget.isOutlined ? null : Colors.blue,
          shape: widget.isOutlined
              ? Border.all(
                  color: Theme.of(context).iconTheme.color!, width: 0.3)
              : null,
          onPressed: isLoading
              ? null
              : widget.enableWhen()
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
              ? SizedBox(
                  height: widget.strokeHeight,
                  width: widget.strokeHeight,
                  child: const CircularProgressIndicator(
                    strokeWidth: 2,
                    color: Colors.white,
                  ))
              : Text(
                  widget.text,
                  style: TextStyle(color: widget.textColor),
                ),
          disabledColor: Colors.blue[900],
        ),
      ),
    );
  }
}
