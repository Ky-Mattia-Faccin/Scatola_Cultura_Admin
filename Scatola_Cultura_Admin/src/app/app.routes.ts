import { Routes } from '@angular/router';
import { CreaStruttura } from '../components/struttura/crea-struttura/crea-struttura';
import { ModificaStruttura } from '../components/struttura/modifica-struttura/modifica-struttura';
import { CreaCategoria } from '../components/categoria/crea-categoria/crea-categoria';
import { SceltaCategoria } from '../components/categoria/scelta-categoria/scelta-categoria';
import { SceltaStruttura } from '../components/struttura/scelta-struttura/scelta-struttura';
import { CreaDisabilita } from '../components/Disabilità/crea-disabilita/crea-disabilita';
import { ModificaDisabilita } from '../components/Disabilità/modifica-disabilita/modifica-disabilita';
import { SceltaDisabilitaStruttura } from '../components/Disabilità/scelta-disabilitaStruttura/scelta-disabilitaStruttura';
import { Login } from '../components/login/login';
import { authGuard } from '../guard/auth-guard';
import { App } from './app';

export const routes: Routes = [
  { path: 'login', component: Login },

  {
    path: '',
    component: App,
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'creaStruttura', pathMatch: 'full' },
      { path: 'sceltaStruttura', component: SceltaStruttura },
      { path: 'creaStruttura', component: CreaStruttura },
      { path: 'modificaStruttura/:id', component: ModificaStruttura },
      { path: 'creaCategoria', component: CreaCategoria },
      { path: 'disabilitaCategoria', component: SceltaCategoria },
      { path: 'creaDisabilità', component: CreaDisabilita },
      { path: 'modificaDisabilità', component: ModificaDisabilita },
      {
        path: 'sceltaDisabilitàStruttura/:id',
        component: SceltaDisabilitaStruttura,
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
