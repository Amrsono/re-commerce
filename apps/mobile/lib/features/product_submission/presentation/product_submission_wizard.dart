import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// State definition for the Wizard
class SubmissionState {
  final int currentStep;
  final String? brand;
  final String? model;
  final String? condition;
  final bool isAnalyzing;
  final double? estimatedValue;

  SubmissionState({
    this.currentStep = 0,
    this.brand,
    this.model,
    this.condition,
    this.isAnalyzing = false,
    this.estimatedValue,
  });

  SubmissionState copyWith({
    int? currentStep,
    String? brand,
    String? model,
    String? condition,
    bool? isAnalyzing,
    double? estimatedValue,
  }) {
    return SubmissionState(
      currentStep: currentStep ?? this.currentStep,
      brand: brand ?? this.brand,
      model: model ?? this.model,
      condition: condition ?? this.condition,
      isAnalyzing: isAnalyzing ?? this.isAnalyzing,
      estimatedValue: estimatedValue ?? this.estimatedValue,
    );
  }
}

class SubmissionNotifier extends StateNotifier<SubmissionState> {
  SubmissionNotifier() : super(SubmissionState());

  void nextStep() {
    if (state.currentStep < 3) {
      state = state.copyWith(currentStep: state.currentStep + 1);
    } else {
      _submitToAI();
    }
  }

  void previousStep() {
    if (state.currentStep > 0) {
      state = state.copyWith(currentStep: state.currentStep - 1);
    }
  }

  void updateDetails(String brand, String model) {
    state = state.copyWith(brand: brand, model: model);
  }

  void updateCondition(String condition) {
    state = state.copyWith(condition: condition);
  }

  Future<void> _submitToAI() async {
    state = state.copyWith(isAnalyzing: true);
    // Simulate AI API call
    await Future.delayed(const Duration(seconds: 2));
    
    // Abstract logic: if poor/complex -> lower price and flag
    double estVal = 500.0;
    if (state.condition == 'Poor' || state.condition == 'Complex') {
      estVal = 200.0;
    }
    
    state = state.copyWith(
      isAnalyzing: false,
      estimatedValue: estVal,
      currentStep: 4, // Final Step
    );
  }
}

final submissionProvider = StateNotifierProvider<SubmissionNotifier, SubmissionState>((ref) {
  return SubmissionNotifier();
});

class ProductSubmissionWizard extends ConsumerWidget {
  const ProductSubmissionWizard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(submissionProvider);
    final notifier = ref.read(submissionProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Sell Your Device'),
      ),
      body: Stepper(
        type: StepperType.horizontal,
        currentStep: state.currentStep > 3 ? 3 : state.currentStep,
        onStepContinue: notifier.nextStep,
        onStepCancel: notifier.previousStep,
        controlsBuilder: (context, details) {
          if (state.currentStep == 4) return const SizedBox.shrink(); // Hide controls on result
          if (state.isAnalyzing) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(16.0),
                child: CircularProgressIndicator(),
              ),
            );
          }
          return Row(
            children: <Widget>[
              ElevatedButton(
                onPressed: details.onStepContinue,
                child: Text(state.currentStep == 3 ? 'Get AI Estimate' : 'Next'),
              ),
              const SizedBox(width: 8),
              if (state.currentStep > 0)
                TextButton(
                  onPressed: details.onStepCancel,
                  child: const Text('Back'),
                ),
            ],
          );
        },
        steps: [
          Step(
            title: const Text('Device'),
            content: Column(
              children: [
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Brand (e.g. Apple)'),
                  onChanged: (val) => notifier.updateDetails(val, state.model ?? ''),
                ),
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Model (e.g. iPhone 15 Pro)'),
                  onChanged: (val) => notifier.updateDetails(state.brand ?? '', val),
                ),
              ],
            ),
            isActive: state.currentStep >= 0,
          ),
          Step(
            title: const Text('Specs'),
            content: const Text('Select Storage & Memory Configuration'),
            isActive: state.currentStep >= 1,
          ),
          Step(
            title: const Text('Condition'),
            content: DropdownButtonFormField<String>(
              decoration: const InputDecoration(labelText: 'Device Condition'),
              items: ['Mint', 'Good', 'Poor', 'Complex'].map((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
              onChanged: (val) {
                if (val != null) notifier.updateCondition(val);
              },
            ),
            isActive: state.currentStep >= 2,
          ),
          Step(
            title: const Text('Camera'),
            content: const Text('Launch Camera for visual diagnostic scan...'),
            isActive: state.currentStep >= 3,
          ),
        ],
      ),
      bottomSheet: state.currentStep == 4
          ? Container(
              padding: const EdgeInsets.all(32),
              width: double.infinity,
              color: Theme.of(context).colorScheme.surfaceContainerHighest,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('AI Estimated Value', style: TextStyle(fontSize: 20)),
                  const SizedBox(height: 16),
                  Text(
                    '\$${state.estimatedValue?.toStringAsFixed(2)}',
                    style: TextStyle(
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),
                  const SizedBox(height: 16),
                  if (state.condition == 'Poor' || state.condition == 'Complex')
                    const Card(
                      color: Colors.amber,
                      child: Padding(
                        padding: EdgeInsets.all(8.0),
                        child: Text('Condition requires a mandatory Engineer Visit.'),
                      ),
                    ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {
                      // Restart or go to dashboard
                    },
                    child: const Text('Accept & Schedule'),
                  )
                ],
              ),
            )
          : null,
    );
  }
}
