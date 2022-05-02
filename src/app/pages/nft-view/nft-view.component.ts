import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalConstants } from 'src/app/global-constants';
import { Web3Service } from 'src/app/services/contract/web3.service';
import { ChessNFT } from 'src/model/ChessNFT';
import ChessNFTContract from 'build/contracts/ChessNFT.json'; 
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nft-view',
  templateUrl: './nft-view.component.html',
  styleUrls: ['./nft-view.component.css']
})
export class NftViewComponent implements OnInit {

  public nft: ChessNFT = new ChessNFT();
  public chessNFTContract: any;

  private tokenId: string | null = "";
  public game: ChessNFT = new ChessNFT();
  public owner: string = "";

  constructor(
    private web3: Web3Service,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private toast: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.tokenId = params['tokenId'];
    });

    this.tokenId = this.route.snapshot.paramMap.get("tokenId");

    if (this.tokenId != null) {

      this.web3.getWeb3().then((web3js) => {
        this.chessNFTContract = new web3js.eth.Contract(ChessNFTContract.abi, GlobalConstants.chessNFTContractAddress);

        this.chessNFTContract.methods.fetchToken(this.tokenId)
          .call({ from: this.auth.getAddress() })
          .then((data: any) => {
            console.log(data);
            let chessGame = data[0];
            let ownerAddress = data[1];
            this.game.name = chessGame.name;
            this.game.moves = String.fromCharCode(chessGame.game);
            this.game.black = chessGame.black;
            this.game.white = chessGame.white;
            this.game.date = chessGame.date;
            this.owner = ownerAddress;
          }).catch((err: any) => {
            console.log(err);
            this.toast.error("Something went wrong!");
          });
      });

    }

  }


}
