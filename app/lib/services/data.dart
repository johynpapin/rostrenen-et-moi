import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:rostrenen_et_moi/models/anomaly_type.dart';
import 'package:rostrenen_et_moi/models/anomaly.dart';
import 'package:rostrenen_et_moi/services/auth.dart';

class DataService {
  final String _userId;
  final FirebaseFirestore _firebaseFirestore = FirebaseFirestore.instance;

  final CollectionReference _anomalyTypesCollection =
      FirebaseFirestore.instance.collection('anomalyTypes');
  final CollectionReference _anomaliesCollection =
      FirebaseFirestore.instance.collection('anomalies');

  DataService({userId}) : _userId = userId;

  List<AnomalyType> _anomalyTypeListFromSnapshot(QuerySnapshot snapshot) {
    return snapshot.documents
        .map((documentSnapshot) => AnomalyType.fromFirestore(documentSnapshot))
        .toList();
  }

  List<Anomaly> _anomalyListFromSnapshot(QuerySnapshot snapshot) {
    return snapshot.documents
        .map((documentSnapshot) => Anomaly.fromFirestore(documentSnapshot))
        .toList();
  }

  Stream<List<AnomalyType>> get anomalyTypesStream {
    return _anomalyTypesCollection
        .snapshots()
        .map(_anomalyTypeListFromSnapshot);
  }

  Stream<List<Anomaly>> get anomaliesStream {
    return _anomaliesCollection
        .where('userId', isEqualTo: _userId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map(_anomalyListFromSnapshot);
  }

  Future<void> createAnomaly({
    String address,
    AnomalyType anomalyType,
    String description,
    String imagesUploadFolder,
  }) async {
    await _anomaliesCollection.add({
      'userId': this._userId,
      'createdAt': FieldValue.serverTimestamp(),
      'address': address,
      'anomalyType': {
        'id': anomalyType.id,
        'name': anomalyType.name,
      },
      'description': description,
      'imagesUploadFolder': imagesUploadFolder,
    });
  }
}
