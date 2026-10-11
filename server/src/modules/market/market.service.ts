import { prisma } from "../../config/db"
import type { marketCreateInterface, marketDeleteInterface, marketGetInterface } from "./market.types"

export const marketCreateService = async ({ symbol, baseAsset, quoteAsset }: marketCreateInterface) => {

    const market = await prisma.market.create({
        data: {
            symbol: symbol,
            baseAsset: baseAsset,
            quoteAsset: quoteAsset
        }
    })
    if (!market) throw new Error("market creation failed");
    return market;

}

export const marketDeleteService = async ({ symbol: symbol }: marketDeleteInterface) => {

    const market = await prisma.market.delete({
        where: {
            symbol: symbol
        }
    })
    return market;

}

export const marketGetAllService = async () => {

    const market = await prisma.market.findMany();
    if (!market || market.length == 0) throw Error("market not found with this symbol");
    return market;

}

export const marketGetBySymbolService = async (data: marketGetInterface) => {

    const market = await prisma.market.findUnique({
        where: {
            symbol: data.symbol
        }
    })
    if (!market) throw Error("market not found with this symbol");
    return market;

}

