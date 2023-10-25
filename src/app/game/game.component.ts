import { Component, OnInit, inject } from "@angular/core";
import { Game } from "src/models/game";
import { MatDialog } from "@angular/material/dialog";
import { DialogAddPlayerComponent } from "../dialog-add-player/dialog-add-player.component";
import { GameInfoComponent } from "../game-info/game-info.component";
import { Firestore } from "@angular/fire/firestore";
import { collection } from "rxfire/firestore";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = "";
  game: Game = new Game();
  firestore: Firestore = inject(Firestore);

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      if (this.game.players.length > 0) {
        this.currentCard = this.game.stack.pop()!;
        this.pickCardAnimation = true;

        this.game.currentPlayer++;
        if (this.game.currentPlayer >= this.game.players.length) {
          this.game.currentPlayer = 0;
        }

        setTimeout(() => {
          this.game.playedCards.push(this.currentCard);
          this.pickCardAnimation = false;
        }, 1000);
      } else {
        alert("Please Add a Player");
      }
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }
}
