export async function GET() {
  try {
    const btcResponse = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    );

    const btcData = await btcResponse.json();

    const eurResponse = await fetch(
      "https://api.frankfurter.app/latest?from=EUR&to=USD"
    );

    const eurData = await eurResponse.json();

    const goldResponse = await fetch(
      "https://goldpricez.com/api/rates/currency/usd/measure/ounce",
      {
        headers: {
          "X-API-KEY":
            process.env.GOLDPRICEZ_API_KEY || "",
        },
      }
    );

    const goldDataRaw =
      await goldResponse.json();

    console.log(
      "GOLD RAW:",
      goldDataRaw
    );

    return Response.json({
      btc: btcData.bitcoin.usd,
      eur: eurData.rates.USD,
      goldDataRaw,
    });

  } catch (error) {

    console.error(
      "ERRO:",
      error
    );

    return Response.json(
      {
        erro: String(error),
      },
      {
        status: 500,
      }
    );

  }
}