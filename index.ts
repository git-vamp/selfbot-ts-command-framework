import { Client } from 'discord.js-selfbot-v13'
import {CommandHandler} from './CommandHandler'


const client = new Client({checkUpdate: false})
const Handler = new CommandHandler(client).setupCommands()

const TOKEN = "NjAwOTcyOTAzODEwNTk2ODc1.Gq-DoO._NFfcWsox0oFGhWPc3Lg3DldrVKPlXCtgrdb7E"


Handler.on('ready', async () => {
  console.log(`${client.user?.username} is ready!`);
})

Handler.login(TOKEN);