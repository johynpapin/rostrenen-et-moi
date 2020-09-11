import 'package:cloud_firestore/cloud_firestore.dart';

class AnomalyType {
  final String id;
  final String name;

  AnomalyType({this.id, this.name});

  factory AnomalyType.fromFirestore(DocumentSnapshot documentSnapshot) {
    final data = documentSnapshot.data();

    return AnomalyType(
      id: documentSnapshot.id,
      name: data['name'],
    );
  }
}
