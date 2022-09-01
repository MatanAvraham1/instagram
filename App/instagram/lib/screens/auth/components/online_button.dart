import 'package:flutter/material.dart';



class OnlineButton extends StatefulWidget {
  final Color? textColor;
  final Color? backgroundColor;
  final Color? disabledBackgroundColor;
  final double strokeHeight;
  final double borderRadius;
  final bool isOutlined;
  final String text;
  final Future Function() onPressed;
  final Function enableWhen;
  final bool expanded;

  const OnlineButton(
      {Key? key,
      required this.onPressed,
      required this.enableWhen,
      required this.text,
      this.expanded = false,
      this.borderRadius = 4,
      this.isOutlined = false,
      this.strokeHeight = 25,
      this.backgroundColor = Colors.blue,
      this.disabledBackgroundColor =
          const Color(0xFF0D47A1), // Colors.blue[900]
      this.textColor})
      : super(key: key);

  @override
  State<OnlineButton> createState() => _OnlineButtonState();
}

class _OnlineButtonState extends State<OnlineButton> {
  bool isLoading = false;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(widget.borderRadius),
      child: SizedBox(
        height: widget.expanded ? null : 50,
        width: widget.expanded ? null : 330,
        child: MaterialButton(
          color: widget.isOutlined ? null : widget.backgroundColor,
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
          disabledColor: widget.disabledBackgroundColor,
        ),
      ),
    );
  }
}
