import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDoc, getDocs, updateDoc, collectionData, doc, query, orderBy, where, QuerySnapshot, DocumentData, setDoc, QueryDocumentSnapshot} from
'@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { Usuario } from '../clases/usuario';

interface Gasto {
  categoria: string;
  monto: number;
}


@Injectable({
  providedIn: 'root'
})
export class FireService {

  constructor(private firestore : Firestore, private afAuth: AngularFireAuth) { }

  public async logIn(email : string, password : string)
  {
    return await this.afAuth.signInWithEmailAndPassword(email, password);
  }
  
  public async logOut()
  {
    return await this.afAuth.signOut();
  }
  
  public async getUserUid()
  {
    return new Promise<string | null>((resolve, reject) => 
    {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          resolve(user.uid);
        } else {
          resolve(null); 
        }
      });
    });
  }  
  
  
  getUsers()
  {
    const referencia = collection(this.firestore, 'usuariosapp7');
    const q = query(referencia, orderBy('nombres'));

    return collectionData(q) as Observable<Usuario[]>;
  }

  createUser(email:string, clave:string)
  {
    this.afAuth.createUserWithEmailAndPassword(email, clave);
    this.afAuth.signInWithEmailAndPassword("admin@admin.com","111111")
  }

  async subirUser(user : object)
  {
    const referencia = collection(this.firestore,'usuariosapp7');

    let docRef = await addDoc(referencia,user);    
  }

  public async getUserNameByUID(UIDUser: string)
  {
    const userCollection = collection(this.firestore, 'users');
    const userDoc = doc(userCollection, UIDUser);
    const userDocSnapshot = await getDoc(userDoc);
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      return userData['perfil'];
    } 
    else 
    {
      console.log('Usuario no encontrado');
      return '';
    }
  }  
 
}
