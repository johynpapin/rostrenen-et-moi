import 'package:firebase_auth/firebase_auth.dart' as FirebaseAuth;
import 'package:rostrenen_et_moi/models/user.dart';

class AuthService {
  final FirebaseAuth.FirebaseAuth _firebaseAuth =
      FirebaseAuth.FirebaseAuth.instance;

  User _userFromFirebaseUser(FirebaseAuth.User user) {
    if (user == null) {
      return null;
    }

    return User(
      id: user.uid,
      email: user.email,
    );
  }

  Stream<User> get userStream {
    return _firebaseAuth.onAuthStateChanged.map(_userFromFirebaseUser);
  }

  User get currentUser {
    return _userFromFirebaseUser(_firebaseAuth.currentUser);
  }

  Future signInWithEmailAndPassword(String email, password) async {
    await _firebaseAuth.signInWithEmailAndPassword(
      email: email,
      password: password,
    );
  }

  Future signUpWithEmailAndPassword(String email, password) async {
    await _firebaseAuth.createUserWithEmailAndPassword(
      email: email,
      password: password,
    );
  }

  Future signOut() async {
    await _firebaseAuth.signOut();
  }
}
