import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart' show FirebaseAuthException;
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:email_validator/email_validator.dart';
import 'package:rostrenen_et_moi/providers.dart';

class SignUp extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final scaffoldKey = useMemoized(() => GlobalKey<ScaffoldState>());
    final formKey = useMemoized(() => GlobalKey<FormState>());
    final passwordFocusNode = useFocusNode();

    final email = useState('');
    final password = useState('');

    void submit() async {
      if (!formKey.currentState.validate()) {
        return;
      }

      try {
        context
            .read(Providers.authService)
            .signUpWithEmailAndPassword(email.value, password.value);
      } on FirebaseAuthException catch (e) {
        String message = '';

        switch (e.code) {
          case 'invalid-email':
            message = 'Cette adresse email est invalide.';
            break;
          case 'user-disabled':
            message = 'Ce compte est désactivé.';
            break;
          case 'user-not-found':
            message = 'Aucun compte n\'existe avec cette adresse email.';
            break;
          case 'wrong-password':
            message = 'Mauvais mot de passe.';
            break;
          default:
            message = 'Une erreur est survenue.';
        }

        scaffoldKey.currentState.showSnackBar(SnackBar(
          backgroundColor: Theme.of(context).errorColor,
          content: Row(
            children: <Widget>[
              Icon(
                Icons.error,
                color: Colors.white,
              ),
              SizedBox(width: 10.0),
              Text(message),
            ],
          ),
        ));
      }
    }

    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(
        title: Text('Inscription'),
      ),
      body: Form(
        key: formKey,
        child: ListView(
          padding: EdgeInsets.symmetric(horizontal: 10.0),
          children: <Widget>[
            SizedBox(height: 20.0),
            TextFormField(
              textInputAction: TextInputAction.next,
              decoration: InputDecoration(
                labelText: 'Adresse email',
                border: const OutlineInputBorder(),
              ),
              keyboardType: TextInputType.emailAddress,
              autofocus: true,
              validator: (value) {
                if (value.isEmpty) {
                  return 'Ce champ est obligatoire';
                }

                if (!EmailValidator.validate(value)) {
                  return 'Adresse email invalide';
                }

                return null;
              },
              onChanged: (value) {
                email.value = value;
              },
              onFieldSubmitted: (value) {
                FocusScope.of(context).requestFocus(passwordFocusNode);
              },
            ),
            SizedBox(height: 20.0),
            TextFormField(
              textInputAction: TextInputAction.done,
              focusNode: passwordFocusNode,
              decoration: InputDecoration(
                labelText: 'Mot de passe',
                border: const OutlineInputBorder(),
              ),
              validator: (value) =>
                  value.isEmpty ? 'Ce champ est obligatoire' : null,
              obscureText: true,
              onChanged: (value) {
                password.value = value;
              },
              onFieldSubmitted: (_) {
                submit();
              },
            ),
            SizedBox(height: 20.0),
            RaisedButton(
              child: Text('Envoyer'),
              color: Theme.of(context).primaryColor,
              textColor: Colors.white,
              onPressed: () => submit(),
            ),
            RaisedButton(
              child: Text('J\'ai déjà un compte'),
              onPressed: () {
                Navigator.of(context).pushReplacementNamed('/auth/sign-in');
              },
            ),
          ],
        ),
      ),
    );
  }
}
