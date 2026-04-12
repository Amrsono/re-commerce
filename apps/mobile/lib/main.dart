import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'features/product_submission/presentation/product_submission_wizard.dart';
import 'core/theme/theme.dart';

void main() {
  runApp(
    const ProviderScope(
      child: MakeUseApp(),
    ),
  );
}

class MakeUseApp extends StatelessWidget {
  const MakeUseApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Make Use',
      theme: MakeUseTheme.lightTheme,
      darkTheme: MakeUseTheme.darkTheme,
      themeMode: ThemeMode.system,
      home: const ProductSubmissionWizard(),
    );
  }
}
