import { Client } from 'discord.js-selfbot-v13'
import {CommandHandler} from './CommandHandler'


const client = new Client({checkUpdate: false})
const Handler = new CommandHandler(client).setupCommands()

const TOKEN = ""


Handler.on('ready', async () => {
  console.log(`${client.user?.username} is ready!`);
})

Handler.login(TOKEN);
