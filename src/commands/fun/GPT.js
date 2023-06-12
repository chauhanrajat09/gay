const axios = require("axios");

const OPENAI_API_URL = "https://api.openai.com/v1/completions";
const OPENAI_API_KEY = process.env.OPENAI
const OPENAI_MODEL = "text-davinci-003";

module.exports = async (client, interaction, args) => {
  const message = interaction.options.getString("text");
  const requestData = {
    model: OPENAI_MODEL,
    prompt: message,
    temperature: 0,
    max_tokens: 2048,
  };
  const response = await axios.post(OPENAI_API_URL, requestData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
  });
  const completion = response.data.choices[0].text.trim();
  
  await interaction.reply(`\`${message}\`: ${completion}`);
};
