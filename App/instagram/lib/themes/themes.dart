import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:flutter/material.dart';

bool isLightMode(BuildContext context) {
  return AdaptiveTheme.of(context).brightness == Brightness.light;
}
