import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:image_picker/image_picker.dart';
import 'package:rostrenen_et_moi/providers.dart';
import 'package:rostrenen_et_moi/models/anomaly.dart';
import 'package:rostrenen_et_moi/models/anomaly_type.dart';
import 'dart:io';

class Home extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final scaffoldKey = useMemoized(() => GlobalKey<ScaffoldState>());
    final anomalies = useProvider(Providers.anomaliesStream);

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
        loading: () => Container(),
        error: (_, __) => Container(),
        data: (value) => ListView(
          padding: EdgeInsets.symmetric(vertical: 10.0, horizontal: 10.0),
          children: value.map((anomaly) {
            return Card(
              child: Padding(
                padding: EdgeInsets.all(12.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: EdgeInsets.only(bottom: 5.0),
                      child: Text(
                        anomaly.anomalyType.name,
                        style: TextStyle(
                          fontWeight: FontWeight.w500,
                          fontSize: 14.0,
                        ),
                      ),
                    ),
                    Text(anomaly.description),
                  ],
                ),
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
