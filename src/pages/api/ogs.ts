import type { NextApiRequest, NextApiResponse } from "next"
import ogs from "open-graph-scraper"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        console.log("unauthorized method %s", req.method)
        return res.status(500)
    }

    const { link } = req.body

    const data = await ogs({ url: link })
    if (data.error) {
        console.log("error fetching open graph %j", data.error)
        return res.status(500)
    }

    const result: any = data.result
    return res.status(200).json({
        title: result.ogTitle || result.twitterTitle,
        description: result.ogDescription || result.twitterDescription,
        image: result.ogImage?.url || result.twitterImage?.url,
    })
}
