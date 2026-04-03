import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'features/product_submission/presentation/product_submission_wizard.dart';
import 'core/theme/theme.dart';

void main() {
  runApp(
    const ProviderScope(
      child: RecommerceApp(),
    ),
  );
}

class RecommerceApp extends StatelessWidget {
  const RecommerceApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AI Recommerce',
      theme: RecommerceTheme.lightTheme,
      darkTheme: RecommerceTheme.darkTheme,
      themeMode: ThemeMode.system,
      home: const ProductSubmissionWizard(),
    );
  }
}
