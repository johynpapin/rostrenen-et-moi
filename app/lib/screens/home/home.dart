import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:image_picker/image_picker.dart';
import 'package:rostrenen_et_moi/providers.dart';
import 'package:rostrenen_et_moi/models/anomaly.dart';
import 'package:rostrenen_et_moi/models/anomaly_type.dart';
import 'dart:io';

class Home extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final firebaseStorage = useMemoized(() => FirebaseStorage.instance);
    final scaffoldKey = useMemoized(() => GlobalKey<ScaffoldState>());
    final anomalies = useProvider(Providers.anomaliesStream);
    final user = useProvider(Providers.userStream).data?.value;
    final userId = user?.id;

    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(
        title: Text('Mes anomalies'),
        actions: [
          Padding(
            padding: EdgeInsets.only(right: 12.0),
            child: PopupMenuButton(
              child: Icon(Icons.person),
              itemBuilder: (context) => [
                PopupMenuItem(
                  value: 1,
                  child: Text('Déconnexion'),
                ),
              ],
              onSelected: (value) async {
                if (value == 1) {
                  await context.read(Providers.authService).signOut();
                }
              },
            ),
          ),
        ],
      ),
      body: anomalies.when(
        loading: () => Container(child: CircularProgressIndicator()),
        error: (err, stack) => Container(child: Text('Error $err, $stack')),
        data: (value) => ListView(
          padding: EdgeInsets.symmetric(vertical: 10.0, horizontal: 10.0),
          children: value.map((anomaly) {
            return Card(
              clipBehavior: Clip.antiAlias,
              child: Stack(
                children: [
                  if (anomaly.images.length > 0)
                    FutureBuilder(
                      future: firebaseStorage
                          .ref()
                          .child('images')
                          .child(userId)
                          .child(anomaly.images[0].id)
                          .getDownloadURL(),
                      builder: (context, snapshot) {
                        if (snapshot.connectionState == ConnectionState.done) {
                          return Positioned.fill(
                            child: Stack(
                              children: [
                                Container(
                                  decoration: BoxDecoration(
                                    image: DecorationImage(
                                      image: NetworkImage(snapshot.data),
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                                Container(
                                  decoration: BoxDecoration(
                                    color: Colors.black.withAlpha(100),
                                  ),
                                ),
                              ],
                            ),
                          );
                        }

                        return Container();
                      },
                    ),
                  Container(
                    padding: EdgeInsets.all(12.0),
                    alignment: Alignment.bottomLeft,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: EdgeInsets.only(bottom: 5.0),
                          child: Text(
                            anomaly.anomalyType.name,
                            style: TextStyle(
                              color: anomaly.images.length > 0
                                  ? Colors.white
                                  : null,
                              fontWeight: FontWeight.w500,
                              fontSize: 14.0,
                            ),
                          ),
                        ),
                        Text(
                          anomaly.description,
                          style: TextStyle(
                            color:
                                anomaly.images.length > 0 ? Colors.white : null,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.add),
        onPressed: () async {
          var result =
              await Navigator.of(context).pushNamed('/anomaly/create') as Map;

          if (result == null) {
            return;
          }

          scaffoldKey.currentState.showSnackBar(SnackBar(
            backgroundColor: Colors.green,
            content: Row(
              children: [
                Icon(
                  Icons.check,
                  color: Colors.white,
                ),
                SizedBox(width: 10.0),
                Text(result['message']),
              ],
            ),
          ));
        },
      ),
    );
  }
}
