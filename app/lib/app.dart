import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:rostrenen_et_moi/providers.dart';
import 'package:rostrenen_et_moi/screens/loading/loading.dart';
import 'package:rostrenen_et_moi/screens/home/home.dart';
import 'package:rostrenen_et_moi/screens/create_anomaly/create_anomaly.dart';
import 'package:rostrenen_et_moi/screens/authenticate/sign_in.dart';
import 'package:rostrenen_et_moi/screens/authenticate/sign_up.dart';

class MyApp extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final navigatorKey = useMemoized(() => GlobalKey<NavigatorState>());
    final user = useProvider(Providers.userStream);

    useValueChanged(user, (_, __) {
      if (user.data?.value != null) {
        navigatorKey.currentState
            .pushNamedAndRemoveUntil('/home', (route) => false);
      } else {
        navigatorKey.currentState
            .pushNamedAndRemoveUntil('/auth/sign-in', (route) => false);
      }
    });

    return MaterialApp(
      navigatorKey: navigatorKey,
      onGenerateRoute: (settings) {
        switch (settings.name) {
          case '/':
            return MaterialPageRoute(builder: (_) => Loading());
          case '/home':
            return MaterialPageRoute(builder: (_) => Home());
          case '/anomaly/create':
            return MaterialPageRoute(builder: (_) => CreateAnomaly());
          case '/auth/sign-in':
            return MaterialPageRoute(builder: (_) => SignIn());
          case '/auth/sign-up':
            return MaterialPageRoute(builder: (_) => SignUp());
        }
      },
    );
  }
}
