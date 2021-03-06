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
import 'package:uuid/uuid.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';

class _AnomalyImage extends StatelessWidget {
  final File file;
  String id;
  StorageUploadTask uploadTask;

  _AnomalyImage({this.file, this.id, storageReference}) {
    this.uploadTask = storageReference.child(this.id).putFile(this.file);
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<StorageTaskEvent>(
      stream: this.uploadTask.events,
      builder: (context, snapshot) {
        var children = [
          Container(
            color: Colors.grey[200],
            width: 75.0,
            height: 100.0,
          ),
          Image.file(
            this.file,
            width: 75.0,
            height: 100.0,
            fit: BoxFit.cover,
          ),
        ];

        if (!snapshot.hasData || this.uploadTask.isInProgress) {
          children.add(Container(
            width: 75.0,
            height: 100.0,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.black.withAlpha(0),
                  Colors.black38,
                  Colors.black54
                ],
              ),
            ),
            child: Center(
              child: Theme(
                data: Theme.of(context).copyWith(accentColor: Colors.white),
                child: CircularProgressIndicator(
                  backgroundColor: Colors.black12,
                  value: snapshot.hasData
                      ? snapshot.data.snapshot.bytesTransferred /
                          snapshot.data.snapshot.totalByteCount
                      : null,
                ),
              ),
            ),
          ));
        }

        return ClipRRect(
          borderRadius: BorderRadius.circular(10.0),
          child: Stack(
            children: children,
          ),
        );
      },
    );
  }
}

class CreateAnomaly extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final scaffoldKey = useMemoized(() => GlobalKey<ScaffoldState>());
    final formKey = useMemoized(() => GlobalKey<FormState>());
    final picker = useMemoized(() => ImagePicker());
    final uuid = useMemoized(() => Uuid());

    final anomaliesCollection =
        useMemoized(() => FirebaseFirestore.instance.collection('anomalies'));
    final anomalyTypes = useProvider(Providers.anomalyTypesStream);

    final firebaseStorage = useMemoized(() => FirebaseStorage.instance);
    final imagesUploadFolder = useMemoized(() => uuid.v4());

    final anomalyAddress = useState<String>('');
    final anomalyTypeId = useState<String>(null);
    final anomalyImages = useState(List<_AnomalyImage>());
    final anomalyDescription = useState('');

    final anomalyAddressController = useTextEditingController();

    final placemarkFuture = useMemoized(
      () => () async {
        final position = await getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high,
        );
        return await placemarkFromCoordinates(
          position.latitude,
          position.longitude,
          localeIdentifier: 'fr_FR',
        );
      }(),
    );
    final placemark = useFuture(placemarkFuture);
    final theme = Theme.of(context);

    useEffect(() {
      if (placemark.hasData) {
        final address = placemark.data[0].street;
        anomalyAddressController.text = address;
        anomalyAddress.value = address;
      } else if (placemark.hasError) {
        scaffoldKey.currentState.showSnackBar(
          SnackBar(
            backgroundColor: theme.errorColor,
            content: Row(
              children: [
                Icon(
                  Icons.error,
                  color: Colors.white,
                ),
                SizedBox(width: 10.0),
                Text('Nous n\'arrivons pas à lire votre position.'),
              ],
            ),
          ),
        );

        return null;
      }
    }, [placemark]);

    Future getImage() async {
      final pickedFile = await picker.getImage(source: ImageSource.camera);
      if (pickedFile == null) {
        return;
      }

      final userId = context.read(Providers.userStream).data?.value.id;

      anomalyImages.value = List.from(anomalyImages.value)
        ..add(
          _AnomalyImage(
            file: File(pickedFile.path),
            id: uuid.v4(),
            storageReference: firebaseStorage
                .ref()
                .child('tmp')
                .child(userId)
                .child(imagesUploadFolder),
          ),
        );
    }

    Future<void> submit(BuildContext context) async {
      final dataService = context.read(Providers.dataService);

      final AnomalyType anomalyType = anomalyTypes.data?.value
          .firstWhere((anomalyType) => anomalyType.id == anomalyTypeId.value);

      await dataService.createAnomaly(
        address: anomalyAddress.value,
        anomalyType: anomalyType,
        description: anomalyDescription.value,
        imagesUploadFolder: imagesUploadFolder,
      );

      Navigator.of(context).pop({
        'message': 'L\'anomalie a bien été signalée.',
      });
    }

    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(
        title: Text('Nouvelle anomalie'),
      ),
      body: Form(
        key: formKey,
        child: ListView(
          padding: EdgeInsets.symmetric(horizontal: 10.0),
          children: [
            SizedBox(height: 20.0),
            if (placemark.hasData || placemark.hasError)
              TextFormField(
                controller: anomalyAddressController,
                decoration: InputDecoration(
                  labelText: 'Adresse',
                  border: const OutlineInputBorder(),
                ),
                onChanged: (value) {
                  anomalyAddress.value = value;
                },
              )
            else
              TextFormField(
                enabled: false,
                decoration: InputDecoration(
                  labelText: 'Adresse',
                  border: const OutlineInputBorder(),
                  suffixIcon: SizedBox(
                    height: 48.0,
                    width: 48.0,
                    child: Center(
                      child: SizedBox(
                        height: 24.0,
                        width: 24.0,
                        child: CircularProgressIndicator(
                          strokeWidth: 3.0,
                          valueColor:
                              AlwaysStoppedAnimation<Color>(Colors.black38),
                          value: null,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
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
                ...?anomalyImages.value,
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
