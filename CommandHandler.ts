import { Client, Message } from 'discord.js-selfbot-v13'
import { existsSync, PathLike, readdirSync, mkdirSync } from 'fs'
interface Command {
    command: Function,
    module: {
        filename: string,
        base: PathLike
    },
    enabled: boolean
}
export enum HandlerType {
    message, delete, edit
}
interface Handler {
    identifier: string,
    type: HandlerType,
    handler: Function,
    enabled: boolean
}

export class CommandHandler {
    private client: Client<boolean>
    private commandDir: PathLike
    private prefix: string
    private handlerArray: Array<Handler> = []
    private commandArray: Array<Command> = []

    constructor(client: Client, prefix: string = "$!", commandDir: PathLike = "./commands") {
        this.client = client
        this.prefix = prefix
        this.commandDir = commandDir
    }
    public getCommands = (): Array<Command> => this.commandArray
    
    public getHandlers = (): Array<Handler> => {
        console.log(this.handlerArray) 
        return this.handlerArray
    }


    public setHandler(identifier: string, type: HandlerType, handler: Function, state: boolean): void {
        this.getHandlers().push({
            identifier,
            type,
            handler,
            enabled: state
        })
    }

    public disableHandler(identifier: string) {
        this.getHandlers().forEach(handler => {
            if (handler.identifier == identifier) {
                handler.enabled = false
            }
        })
    }
    public getHandler = (identifier: string): Handler => {
        console.log(identifier, this.getHandlers().filter((handler: Handler) => handler.identifier == identifier)[0])
        return this.getHandlers().filter((handler: Handler) => handler.identifier == identifier)[0]

    }

    public getCommand = (name: string) => {
        return this.getCommands().filter(command => command.module.filename == name)[0]
    }
    private loadCommands() {
        if (!existsSync(this.commandDir)) mkdirSync(this.commandDir)
        readdirSync(this.commandDir).forEach(file => {
            if (existsSync(`${this.commandDir}/${file}`)) {
                let filename = file.replace(".ts", "")
                let module = `${this.commandDir}/${filename}`
                import(module).then(data => {
                    filename = filename.toLowerCase()
                    if (!data.command) {
                        console.error(`Error: ${module} -> command() - Not Found`)
                        return
                    }
                    this.commandArray.push({
                        command: data.command, module: {
                            filename: filename,
                            base: module
                        }, enabled: true
                    })
                }).catch(reason => console.log(reason))
            }
            console.clear()
        });
    }
    public setupCommands() {
        this.loadCommands()
        this.client.on("messageCreate", (message: Message) => {
            if (message.author.bot) return
            if (!message.content.startsWith(this.prefix)) return

                this.getHandlers().forEach(handler => {
                    if (handler.enabled == true && handler.type == HandlerType.message) {
                        handler.handler(message, this)
                        console.log(handler)
                    }
                })
             
            this.getCommands().forEach(command => {
                if (message.content.startsWith(`${this.prefix}${command.module.filename}`) && command.enabled === true) {
                    let args = message.content
                        .replace(`${this.prefix}${command.module.filename}`, '')
                        .split(' ')
                        .filter(arg => arg != "")



                    command.command(message, args, this)
                }
            })



        })
        return this.client
    }
}           