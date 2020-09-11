import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';

class Loading extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SpinKitRipple(
          color: Theme.of(context).primaryColor,
          size: 100.0,
        ),
      ),
    );
  }
}
