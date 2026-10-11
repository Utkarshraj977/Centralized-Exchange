import type { Asset } from "../../../generated/prisma/enums"

interface marketCreateInterface{
    symbol:string
    baseAsset:Asset,
    quoteAsset:Asset
}

interface marketDeleteInterface{
    symbol:string
}

interface marketGetInterface{
    symbol:string
}

export type {marketCreateInterface,marketDeleteInterface,marketGetInterface};
