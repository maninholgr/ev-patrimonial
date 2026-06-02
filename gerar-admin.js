const bcrypt = require("bcryptjs");

async function gerar() {

  const hash =
    await bcrypt.hash(
      "LucianoSuporte@2026",
      10
    );

  console.log(hash);

}

gerar();