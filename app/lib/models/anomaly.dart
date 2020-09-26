import 'package:cloud_firestore/cloud_firestore.dart';
import './anomaly_type.dart';

class AnomalyImage {
  final String id;

  AnomalyImage({this.id});
}

class Anomaly {
  final String id;
  final AnomalyType anomalyType;
  final String description;
  final List<AnomalyImage> images;

  Anomaly({this.id, this.anomalyType, this.description, this.images});

  factory Anomaly.fromFirestore(DocumentSnapshot documentSnapshot) {
    final data = documentSnapshot.data();

    return Anomaly(
      id: documentSnapshot.id,
      anomalyType: AnomalyType(
        id: data['anomalyType']['id'],
        name: data['anomalyType']['name'],
      ),
      description: data['description'],
      images: data['images'] != null
          ? data['images']
              .map<AnomalyImage>((image) => AnomalyImage(id: image['id']))
              .toList()
          : [],
    );
  }
}
