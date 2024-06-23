const axios = require('axios');

module.exports.config = {
  name: "joke",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  description: "Get a random joke.",
  usage: "quote",
  credits: "aesther",
  cooldown: 0
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;

  try {
    const response = await axios.get('https://zcdsphapilist.replit.app/joke');
    
    if (response.status === 200) {
      const { content, author } = response.data;
      api.sendMessage(`Joke: ${content}\nAuthor: ${author}`, threadID, messageID);
    } else {
      throw new Error('Failed to fetch joke');
    }
  } catch (error) {
    console.error('Error fetching joke:', error);
    api.sendMessage("Sorry, I couldn't fetch a joke at the moment. Please try again later.", threadID, messageID);
  }
};
