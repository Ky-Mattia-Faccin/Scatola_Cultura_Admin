import { Routes } from '@angular/router';
import { CreaStruttura } from '../components/struttura/crea-struttura/crea-struttura';
import { ModificaStruttura } from '../components/struttura/modifica-struttura/modifica-struttura';
import { CreaCategoria } from '../components/categoria/crea-categoria/crea-categoria';
import { SceltaCategoria } from '../components/categoria/scelta-categoria/scelta-categoria';
import { SceltaStruttura } from '../components/struttura/scelta-struttura/scelta-struttura';
import { CreaDisabilita } from '../components/Disabilità/crea-disabilita/crea-disabilita';
import { ModificaDisabilita } from '../components/Disabilità/modifica-disabilita/modifica-disabilita';
import { SceltaDisabilitaStruttura } from '../components/Disabilità/scelta-disabilitaStruttura/scelta-disabilitaStruttura';

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
        path:'disabilitaCategoria',component:SceltaCategoria
    },
    {
        path:'sceltaStruttura',component:SceltaStruttura
    },
    {
        path:'creaDisabilità',component:CreaDisabilita
    },
    {
        path:'modificaDisabilità/:id/:categoria',component:ModificaDisabilita
    },
    {
        path:'sceltaDisabilitàStruttura/:id', component:SceltaDisabilitaStruttura
    }
];
