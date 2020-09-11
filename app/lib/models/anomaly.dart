import 'package:cloud_firestore/cloud_firestore.dart';
import './anomaly_type.dart';

class Anomaly {
  final String id;
  final AnomalyType anomalyType;
  final String description;

  Anomaly({this.id, this.anomalyType, this.description});

  factory Anomaly.fromFirestore(DocumentSnapshot documentSnapshot) {
    final data = documentSnapshot.data();

    return Anomaly(
      id: documentSnapshot.id,
      anomalyType: AnomalyType(
        id: data['anomalyType']['id'],
        name: data['anomalyType']['name'],
      ),
      description: data['description'],
    );
  }
}
