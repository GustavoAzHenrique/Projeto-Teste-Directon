import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBLjvrC7s55-66WVpk0qzIqHwt226pCMPQ",
  authDomain: "projeto-teste-directon.firebaseapp.com",
  projectId: "projeto-teste-directon",
  storageBucket: "projeto-teste-directon.appspot.com",
  messagingSenderId: "876115173429",
  appId: "1:876115173429:web:9a34a303ab0d12ab1ad17c"
};



export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
  ],
};