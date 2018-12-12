import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Subject } from 'rxjs';

export interface InteractionMessage {
    key:string;
    message:any;
}

@Injectable()
export class EventInteraction {

    private eventBus = new Subject();

    public subscribeComplete(next,error,complete)  {
        return this.eventBus.subscribe(next,error,complete);
    }

    public subscribe(next)  {
        return this.eventBus.subscribe(next);
    }

    public next(event:InteractionMessage){
        this.eventBus.next(event);
    }
}