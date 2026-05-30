export async function GET() {
  try {

    const btcResponse = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    );

    const btcData =
      await btcResponse.json();

    const eurResponse = await fetch(
      "https://api.frankfurter.app/latest?from=EUR&to=USD"
    );

    const eurData =
      await eurResponse.json();

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

const goldData =
  JSON.parse(goldDataRaw);

    return Response.json({
      btc: btcData.bitcoin.usd,
      eur: eurData.rates.USD,
      ouro: parseFloat(
    goldData.ounce_price_usd
  ),
});

  } catch (error) {

    console.error(error);

    return Response.json(
      {
        erro:
          "Falha ao carregar mercado",
      },
      {
        status: 500,
      }
    );

  }
}