import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:rostrenen_et_moi/services/auth.dart';
import 'package:rostrenen_et_moi/services/data.dart';
import 'package:rostrenen_et_moi/models/user.dart';
import 'package:rostrenen_et_moi/models/anomaly.dart';
import 'package:rostrenen_et_moi/models/anomaly_type.dart';

class Providers {
  static final authService = Provider<AuthService>((_) => AuthService());

  static final userStream = StreamProvider<User>((ref) {
    final _authService = ref.watch(authService);

    return _authService.userStream;
  });

  static final dataService = Provider<DataService>((ref) {
    final user = ref.watch(userStream).data?.value;

    return DataService(userId: user?.id);
  });

  static final anomaliesStream =
      StreamProvider.autoDispose<List<Anomaly>>((ref) {
    final _dataService = ref.watch(dataService);

    return _dataService.anomaliesStream;
  });

  static final anomalyTypesStream =
      StreamProvider.autoDispose<List<AnomalyType>>((ref) {
    final _dataService = ref.watch(dataService);

    return _dataService.anomalyTypesStream;
  });
}
