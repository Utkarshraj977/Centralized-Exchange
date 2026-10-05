import { Asset } from "../../../generated/prisma/enums";

interface balanceCreateInterface {
    walletId: string, asset: Asset, value: number
}
interface balanceUpdateInterface {
    walletId: string, asset: Asset, available: number, reserved: number
}
interface balanceGetInterface {
    walletId: string, asset: Asset
}
export type {balanceCreateInterface,balanceUpdateInterface,balanceGetInterface}

