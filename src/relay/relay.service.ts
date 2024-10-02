import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Wallet } from "@project-serum/anchor";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";
import { SignedTransactionRequestDTO } from "./relay.dto";

@Injectable()
export class RelayService {


    private connection: Connection
    private feePayerWallet: Wallet

    constructor(@Inject("NATS_SERVICE") private natsClient: ClientProxy) {
        this.connection = new Connection(process.env.RPC_URL)
        this.feePayerWallet = new Wallet(Keypair.fromSecretKey(bs58.decode(process.env.FEE_PAYER_KEY)))
    }


    async relayTx(request: SignedTransactionRequestDTO) {
        let transaction: VersionedTransaction
        let signature: string

        try {
            const transactionBuf = Buffer.from(request.transaction, "base64");
            transaction = VersionedTransaction.deserialize(transactionBuf);
        } catch(e) {
            console.log(e)
            throw new Error("Invalid transaction")
        }


        transaction.sign([this.feePayerWallet.payer])

        try {
            
            signature = await this.connection.sendRawTransaction(transaction.serialize(), {
                skipPreflight: false
            })

            this.natsClient.emit({cmd: "tx.relayed"}, {
                payer: request.payer,
                signer: request.signer,
                transaction: Buffer.from(transaction.serialize()).toString("base64"),
                signature: signature
            })

        } catch(e) {
            console.log(e)
            throw new Error("Invalid transaction")
        }


        console.log("signature", signature)
        return signature
    }
}