import 'package:flutter/material.dart';

class CustomFormField extends StatefulWidget {
  final String? hintText;
  final void Function(String)? onChanged;
  final bool isPasswordField;

  const CustomFormField(
      {Key? key, this.hintText, this.onChanged, this.isPasswordField = false})
      : super(key: key);

  @override
  State<CustomFormField> createState() => _CustomFormFieldState();
}

class _CustomFormFieldState extends State<CustomFormField> {
  bool hidePassword = true;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: SizedBox(
        width: 330,
        child: TextField(
          obscureText: widget.isPasswordField ? hidePassword : false,
          onChanged: widget.onChanged,
          style: const TextStyle(color: Colors.white, fontSize: 13),
          decoration: InputDecoration(
            contentPadding: const EdgeInsets.fromLTRB(12, 17, 12, 17),
            filled: true,
            fillColor: Colors.grey[900],
            hintText: widget.hintText,
            hintStyle: const TextStyle(color: Colors.grey, fontSize: 13),
            border: const OutlineInputBorder(borderSide: BorderSide.none),
            suffixIcon: !widget.isPasswordField
                ? null
                : GestureDetector(
                    onTap: () {
                      setState(() {
                        hidePassword = !hidePassword;
                      });
                    },
                    child: Icon(hidePassword
                        ? Icons.visibility_off
                        : Icons.visibility)),
          ),
        ),
      ),
    );
  }
}
