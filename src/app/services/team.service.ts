import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Team } from '../interfaces/team';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const TeamsTableHeaders = ['Name', 'Country', 'Players'];

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private teamDB: AngularFireList<Team>;

  constructor(private db: AngularFireDatabase) {
    this.teamDB = this.db.list('/teams', ref => ref.orderByChild('name'));
  }

  getTeams(): Observable<Team[]> {
    return this.teamDB.snapshotChanges().pipe(
      map(changes => {
        return changes.map( c => ({$key: c.payload.key, ... c.payload.val()}));
      })
    );
  }

  addTeam(team: Team){
    this.teamDB.push(team);
  }

  deleteTeam(id: string){
    this.db.list('/teams').remove(id);
  }

  editTeam(newTeamData) {
    const $key = newTeamData.$key;
    delete(newTeamData.$key);
    this.db.list('/teams').update($key, newTeamData);
  }

}
