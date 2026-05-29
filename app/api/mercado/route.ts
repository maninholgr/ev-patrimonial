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
      "https://www.goldapi.io/api/XAU/USD",
      {
        headers: {
          "x-access-token":
            process.env.GOLD_API_KEY || "",
        },
      }
    );

    const goldData =
      await goldResponse.json();

    return Response.json({
      btc: btcData.bitcoin.usd,
      eur: eurData.rates.USD,
      ouro: goldData.price,
    });

  } catch (error) {

    console.error(error);

    return Response.json(
      {
        erro: "Falha ao carregar mercado",
      },
      {
        status: 500,
      }
    );

  }
}