import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, query, orderBy, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  static guardarFs(col: string, usuario: string, segundos: number, firestore: Firestore)
  {
    let options : any = { timeZone: 'America/Argentina/Buenos_Aires'};
    let fecha = new Date().toLocaleString('es-AR', options);
    let params = {jugador: usuario, fecha: fecha, segundos: segundos};
    
    let coleccion = collection(firestore, col);
    
    addDoc(coleccion, params);

    return params;
  } 

    static async traerFs(col: string, firestore: Firestore)
    {
      const colRef = collection(firestore, col);
        const q = query(colRef, orderBy('segundos'));

        try 
        {
            const querySnapshot = await getDocs(q);
            const data: any[] = [];

            querySnapshot.forEach((doc) => {
                data.push(doc.data());
            });

            return data;
        } 
        catch (error) 
        {
            console.error('Error al obtener datos de Firestore:', error);
            throw error;
        }    
    }
}
