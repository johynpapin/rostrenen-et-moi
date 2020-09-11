import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:image_picker/image_picker.dart';
import 'package:rostrenen_et_moi/providers.dart';
import 'package:rostrenen_et_moi/models/anomaly_type.dart';
import 'dart:io';

class CreateAnomaly extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final formKey = useMemoized(() => GlobalKey<FormState>());
    final picker = useMemoized(() => ImagePicker());
    final anomaliesCollection =
        useMemoized(() => FirebaseFirestore.instance.collection('anomalies'));
    final anomalyTypes = useProvider(Providers.anomalyTypesStream);
    final firebaseStorage = useMemoized(() => FirebaseStorage.instance);

    final anomalyTypeId = useState<String>(null);
    final anomalyImages = useState(List<File>());
    final anomalyDescription = useState('');

    Future getImage() async {
      final pickedFile = await picker.getImage(source: ImageSource.camera);
      if (pickedFile == null) {
        return;
      }

      anomalyImages.value = List.from(anomalyImages.value)
        ..add(File(pickedFile.path));
    }

    Future<void> submit(BuildContext context) async {
      final authService = context.read(Providers.authService);

      await anomaliesCollection.add({
        'userId': authService.currentUser.userId,
        'createdAt': FieldValue.serverTimestamp(),
        'anomalyType': {
          'id': anomalyTypeId.value,
          'name': anomalyTypes.data?.value
              .firstWhere(
                  (anomalyType) => anomalyType.id == anomalyTypeId.value)
              .name,
        },
        'description': anomalyDescription.value,
      });

      Navigator.of(context).pop({
        'message': 'L\'anomalie a bien été signalée.',
      });
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Nouvelle anomalie'),
      ),
      body: Form(
        key: formKey,
        child: ListView(
          padding: EdgeInsets.symmetric(horizontal: 10.0),
          children: <Widget>[
            SizedBox(height: 20.0),
            DropdownButtonFormField(
              onChanged: (value) {
                anomalyTypeId.value = value;
              },
              decoration: InputDecoration(
                labelText: 'Type de signalement',
                border: const OutlineInputBorder(),
              ),
              items: (anomalyTypes.data?.value ?? []).map((anomalyType) {
                return DropdownMenuItem(
                  value: anomalyType.id,
                  child: Text(anomalyType.name),
                );
              }).toList(),
              isExpanded: true,
              value: anomalyTypeId.value,
            ),
            SizedBox(height: 20.0),
            Text('Photo'),
            SizedBox(height: 10.0),
            Wrap(
              spacing: 8.0,
              runSpacing: 8.0,
              direction: Axis.horizontal,
              runAlignment: WrapAlignment.start,
              children: <Widget>[
                ...?anomalyImages.value?.map((image) {
                  return ClipRRect(
                    borderRadius: BorderRadius.circular(10.0),
                    child: Image.file(
                      image,
                      height: 100.0,
                      fit: BoxFit.fitHeight,
                    ),
                  );
                }).toList(),
                ButtonTheme(
                  minWidth: 75.0,
                  height: 100.0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10.0),
                  ),
                  child: FlatButton(
                    color: Colors.grey[200],
                    child: Column(
                      children: <Widget>[
                        Icon(Icons.add_a_photo),
                        SizedBox(height: 5.0),
                        Text('Ajouter'),
                      ],
                    ),
                    onPressed: getImage,
                  ),
                ),
              ],
            ),
            SizedBox(height: 20.0),
            TextFormField(
              maxLines: null,
              keyboardType: TextInputType.multiline,
              textInputAction: TextInputAction.newline,
              decoration: InputDecoration(
                labelText: 'Description',
                border: const OutlineInputBorder(),
              ),
              onChanged: (value) {
                anomalyDescription.value = value;
              },
            ),
            SizedBox(height: 20.0),
            RaisedButton(
              color: Theme.of(context).primaryColor,
              textColor: Colors.white,
              child: Text('Signaler'),
              onPressed: () {
                submit(context);
              },
            ),
          ],
        ),
      ),
    );
  }
}
