import { Component, OnInit } from '@angular/core';
import { Country, SquadNumber } from '../interfaces/player';
import { PlayerService } from '../services/player.service';
import { TeamService } from '../services/team.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-player-dialog',
  templateUrl: './player-dialog.component.html',
  styleUrls: ['./player-dialog.component.scss']
})
export class PlayerDialogComponent implements OnInit {
  private team;
  public countries = Object.keys(Country).map( key => ({label: key, key: Country}));
  public squadNumber = Object.keys(SquadNumber).slice(Object.keys(SquadNumber).length / 2);

  constructor(private playerService: PlayerService, private teamService: TeamService) { }

  ngOnInit() {
    this.teamService.getTeams().pipe(take(1)).subscribe( teams => {
      if (teams.length > 0 ) {
        this.team = teams[0];
      }
    });
  }

  private newPlayer(playerFormValue) {
    const key = this.playerService.addPlayer(playerFormValue).key;
    const playerFormValueKey = {
      ... playerFormValue,
      key
    };

    const formattedTeam = {
      ... this.team,
      players: [...(this.team.players ? this.team.players : []), playerFormValueKey]
    };
    this.teamService.editTeam(formattedTeam);
  }

}
