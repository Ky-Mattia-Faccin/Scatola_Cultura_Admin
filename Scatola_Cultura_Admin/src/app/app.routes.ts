import { Routes } from '@angular/router';
import { CreaStruttura } from '../components/struttura/crea-struttura/crea-struttura';
import { ModificaStruttura } from '../components/struttura/modifica-struttura/modifica-struttura';
import { CreaCategoria } from '../components/categoria/crea-categoria/crea-categoria';
import { DisabilitaCategoria } from '../components/categoria/disabilita-categoria/disabilita-categoria';
import { SceltaModificaStruttura } from '../components/struttura/modifica-struttura/scelta-modifica-struttura/scelta-modifica-struttura';
import { CreaDisabilita } from '../components/Disabilità/crea-disabilita/crea-disabilita';

export const routes: Routes = [
    {
        path:'creaStruttura',component:CreaStruttura
    },
    {
        path:'modificaStruttura/:id',component:ModificaStruttura
    },
    {
        path:'creaCategoria',component:CreaCategoria
    },
    {
        path:'disabilitaCategoria',component:DisabilitaCategoria
    },
    {
        path:'sceltaStruttura',component:SceltaModificaStruttura
    },
    {
        path:'creaDisabilità',component:CreaDisabilita
    }
];
