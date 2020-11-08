const Discord = require("discord.js");  //Incluye las librerias necesarias
const ytdl = require("ytdl-core");
const fs = require("fs");
const { REFUSED } = require("dns");

const client = new Discord.Client();  //Crea un objeto de la clase Discord.Client

const PREFIX = "_";  //Define el prefijo
const token = "TOKEN;
const version = "BETA";

const palette = [
    "#DAF7A6",
    "#FFC300",
    "#FF5733",
    "#C70039",
    "#900C3F",
    "#581845",
]

client.on("ready", () =>{  //Cuando el bot este listo envia "LISTO" por la consola e informa del prefijo actual
    const activities_list = [
        "Tan solo " + client.guilds.cache.size + " servidores :(",
        "Versión " + version,
        PREFIX + "help",
    ];

    client.user.setActivity("Ya estoy aqui :D");

    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
        client.user.setActivity(activities_list[index]);
    }, 10000);
    console.log("LISTO");
    console.log("Prefijo actual: \"" + PREFIX + "\"");
    console.log(client.guilds.cache.size + " servidores");
});

try{client.on("message", message => {  //Cuando alguien envie un mensaje
    try{if(message.mentions.users.first().tag == client.user.tag){message.channel.send(embed("TUTIFRUTI", "Prefijo: **" + PREFIX + "**\nAyuda: **" + PREFIX + "help**\nPara mas ayuda consulta el servidor de soporte (https://discord.gg/78x37EvpRH)"));}}catch{}

    if(!(message.author == client.user)){  //Comprueba si ese mensaje no lo ha escrito el propio bot
        var args = "";
        var command = "";
        var hasArgs = false;

        if(message.content.startsWith(PREFIX)){  //Define las variables args command y hasArgs
            args = message.content.slice(PREFIX.length).trim().split(' ');
            command = args.shift().toLowerCase();

            hasArgs = (args.length > 0);
        }

        if(command == "ping"){  //Comando ping
            deb("Se ha ejecutado el comando \"" + command + "\" por el usuario " + message.author.tag);
            message.channel.send(embed("LATENCIA", "Latencia del bot: **" + (Date.now() - message.createdTimestamp) + "ms**"));
        }

        if(command == "reset"){  //Comando reset
            deb("Se ha ejecutado el comando \"" + command + "\" por el usuario \"" + message.author.tag + "\"");
            message.channel.send(embed("Reiniciando...", "Por favor espera"));
            client.user.setActivity("Reiniciando...")
            .then(msg => client.destroy())
            .then(() => client.login(token));
        }

        if(command == "help"){  //Comando help
            deb("Se ha ejecutado el comando \"" + command + "\" por el usuario \"" + message.author.tag + "\"");
            fs.readFile('BotData/help.tft', 'utf8', function (err,data) {
                if (err) {
                  return console.log(err);
                }
                message.channel.send(data);
            });
        }

        if(command == "helpmd" || command == "helpdm" || command == "help-md" || command == "help-dm"){  //Comando help en MD
            deb("Se ha ejecutado el comando \"" + command + "\" por el usuario \"" + message.author.tag + "\"");
            fs.readFile('BotData/help.tft', 'utf8', function (err,data) {
                if (err) {
                  return console.log(err);
                }
                message.author.send(data);
            });
        }

        if(command == "ppt"){  //Piedra papel o tijeras
            deb("Se ha ejecutado el comando \"" + command + "\" por el usuario \"" + message.author.tag + "\"");
            emojis = {
                piedra : "🪨",
                papel : "🧻",
                tijeras : "✂️",
                combo : "🪨🧻✂️"
            };

            if(!hasArgs){message.channel.send("Piedra papel o tijera. Sintaxis: \`" + PREFIX + "ppt <objeto>\`\nPara ver las normas del juego escribe \`" + PREFIX + "ppt rules\`");}
            else{
                if(args[0] == "rules"){
                    fs.readFile('BotData/Rules/ppt.tft', 'utf8', function (err,data) {
                        if (err) {
                          return console.log(err);
                        }
                        message.channel.send(data);
                    });
                }
                else{
                    var tirada;
                    if(args[0] == "piedra") tirada = "piedra";
                    else if(args[0] == "papel") tirada = "papel";
                    else if(args[0] == "tijeras") tirada = "tijeras";
                    else{message.channel.send("Ese no es un objeto valido! (Escribe \`piedra\`, \`papel\` o \`tijeras\`)");}
                    if(tirada != undefined){
                        var objs = ["piedra", "papel", "tijeras"];
                        var tiradaBot = objs[parseInt(Math.random()*3)];
                        message.channel.send("Has tirado " + emojis[tirada] + " y yo he tirado " + emojis[tiradaBot])
                        if(tirada == tiradaBot){
                            message.channel.send("**¡EMPATE!**");
                        }
                        if((tirada == "piedra" && tiradaBot == "papel") || (tirada == "papel" && tiradaBot == "tijeras") || (tirada == "tijeras" && tiradaBot == "piedra")){
                            message.channel.send("**¡HE GANADO YO!**");
                        }
                        if((tirada == "piedra" && tiradaBot == "tijeras") || (tirada == "papel" && tiradaBot == "piedra") || (tirada == "tijeras" && tiradaBot == "papel")){
                            message.channel.send("**¡HAS GANADO!**"); 
                        }
                    }
                }
            }
        }

        if(command == "say"){
            deb("Se ha ejecutado el comando \"" + command + "\" por el usuario \"" + message.author.tag + "\"");
            if(hasArgs){
                var msg = "";
                for(var i = 0; i < args.length; i++){
                    msg = msg + args[i] + " ";
                }
                message.channel.send(msg);
                if(message.deletable){
                    message.delete();
                }
            }
            else{
                message.channel.send("Oops! Necesitas decirme lo que quieres que diga...");
            }
        }

        if(command == "bot-info" || command == "botinfo"){
            deb("Se ha ejecutado el comando \"" + command + "\" por el usuario \"" + message.author.tag + "\"");

            const embed = new Discord.MessageEmbed()
            .setColor(palette[5])
            .setTitle("INFORMACIÓN BOT")
            .setDescription("Información de este bot")
            .setFooter("_help para una lista de comandos")
            .setAuthor("Tutifuti", "https://cdn.discordapp.com/emojis/774758930030264350.png")
            .addField("Servidores", client.guilds.cache.size, true)
            .addField("Fecha de creación", "6/11/2020", true)
            message.channel.send(embed)
        }

        if(command == "server-info" || command == "serverinfo"){
            deb("Se ha ejecutado el comando \"" + command + "\" por el usuario \"" + message.author.tag + "\"");
            var memberCount = message.guild.memberCount;
            var emojiCount = message.guild.emojis.cache.size;

            const embed = new Discord.MessageEmbed()
            .setColor(palette[5])
            .setTitle("INFORMACIÓN DEL SERVIDOR")
            .setDescription("Información sobre el servidor " + message.guild)
            .setFooter("_help para una lista de comandos")
            .setAuthor("Tutifruti", "https://cdn.discordapp.com/emojis/774758930030264350.png")
            .addField("Miembros", memberCount, true)
            .addField("Emojis", emojiCount, true)
            message.channel.send(embed);
        }

        if(command == "createinvite" || command == "create-invite"){
            deb("Se ha ejecutado el comando \"" + command + "\" por el usuario \"" + message.author.tag + "\"");
            if(args.length == 2){
                message.channel.createInvite({
                    maxAge: args[0] * 3600, // maximum time for the invite, in milliseconds
                    maxUses: args[1] // maximum times it can be used
                }).then(invite => {
                    message.reply("Ok! Tu invitación: https://discord.gg/" + invite.code);
                });
            }
            else{
                message.channel.send(embed("Oops...", "Sintaxis del comando: `" + PREFIX + "createinvite <tiempo maximo en horas> <usos maximos>`"));
            }
        }

        if(command == "goal" || command == "goals"){
            deb("Se ha ejecutado el comando \"" + command + "\" por el usuario \"" + message.author.tag + "\"");
            message.channel.send("Muchas gracias por el apoyo que nos habeis dado!\nSin vosotros añadiendome en vuestro servidor nada de esto hubiese sido posible...\nYa estamos en " + client.guilds.cache.size + " servidores en tan poco tiempo!\nNuestra meta es llagar a 75 servidores para poder verificar el bot.\n" + progressBar(client.guilds.cache.size, 75, 75) + "A por ello! 💪");
        }

        if(command == "leave"){
            deb("Se ha ejecutado el comando \"" + command + "\" por el usuario \"" + message.author.tag + "\"");
            if(message.member.voice.channel){
                message.member.voice.channel.leave();
            }
            else{
                message.channel.send(embed("Oops!", "Tienes que estar en un canal de voz para hacer esto..."));
            }
        }

        if(command == "join"){
            deb("Se ha ejecutado el comando \"" + command + "\" por el usuario \"" + message.author.tag + "\"");
            if(message.member.voice.channel){
                message.member.voice.channel.join();
            }
            else{
                message.channel.send(embed("Oops!", "Tienes que estar en un canal de voz para hacer esto..."));
            }
        }

        try{
            if(message.member.permissions.has("ADMINISTRATOR")){
                if(command == "createchannel"){  //Comando createchannel
                    deb("Se ha ejecutado el comando \"" + command + "\" por el usuario \"" + message.author.tag + "\"");
                    if(hasArgs){
                        message.guild.channels.create(args[0], { reason: 'Created channel' }).then( created_channel => {
                            const embed = new Discord.MessageEmbed()
                            .setColor(palette[0])
                            .setTitle("CANAL CREADO")
                            .setDescription("Canal creado correctamente")
                            .addField("Nombre", created_channel.name)
                            .addField("ID", created_channel.id)
                            message.channel.send(embed);
                        });
                    }
                    else{
                        message.channel.send("Necesitas decirme el nombre del canal");
                    }
                }

                if(command == "deletechannel"){  //Comando deletechannel
                    deb("Se ha ejecutado el comando \"" + command + "\" por el usuario \"" + message.author.tag + "\"");
                    if(hasArgs){
                        const deleted_channel = message.guild.channels.cache.get(args[0].replace('<#','').replace('>',''));
                        const embed = new Discord.MessageEmbed()
                        .setColor(palette[2])
                        .setTitle("CANAL BORRADO")
                        .setDescription("Canal borrado correctamente")
                        .addField("Nombre",deleted_channel.name)
                        .addField("ID", deleted_channel.id)
                        deleted_channel.delete();
                        message.channel.send(embed);
                    }
                    else{
                        message.channel.send("Necesitas decirme el nombre del canal");
                    }
                }

                if(command == "clear" || command == "purge"){  //Comando clear
                    if(hasArgs){
                        if(args[0] <= 100){
                            deb("Se ha ejecutado el comando \"" + command + "\" por el usuario \"" + message.author.tag + "\"");
                            fetched = args[0];
                            message.channel.bulkDelete(fetched);
                        }
                        else{
                            message.channel.send(embed("Oops...", "El maximo son 100", palette[2]));
                        }
                    }
                    else{
                        message.channel.send(embed("Oops...", "Dime el numero de mensajes que quieres borrar", palette[2]));
                    }
                }

                if(command == "vote"){
                    deb("Se ha ejecutado el comando \"" + command + "\" por el usuario \"" + message.author.tag + "\"");
                    if(hasArgs){
                        var msg = "";
                        for(var i = 0; i < args.length; i++){
                            msg = msg + args[i] + " ";
                        }
                        message.channel.send(msg).then(sent => {sent.react("✅").then(() => {sent.react("⛔")});});
                        if(message.deletable){
                            message.delete();
                        }
                    }
                    else{
                        message.channel.send("Oops! Necesitas decirme el texto para la votación...");
                    }
                }
            }
        }catch{}
    }
});}catch{}

try{client.on("guildCreate", guild => {
    console.log(`NUEVA GUILD: ${guild.name} (id: ${guild.id}). Este servidor tiene ${guild.memberCount} usuarios! Ahora el bot está en ${client.guilds.cache.size} servidores`);
});}catch{}

client.on("guildMemberAdd", mbr => {
    try{
        var role = mbr.guild.roles.cache.get("774692464056860682");
        mbr.roles.add(role);
    }catch{}
    try{
        const webhookClient = new Discord.WebhookClient('774990835028590612', 'V6F2SP3fUgM0r7H2x_JKOsQE5lxAkwpxoFBqNkzlYGs2r2CCMVUl85tPLo1BEW8e3Ab_');
        if(mbr.guild.id == "770044031034982421")webhookClient.send("Nuevo usuario!\nBienvenido <@" + mbr.id + "> a este servidor!");
        mbr.send("Bienvenido al servidor **" + mbr.guild.name + "**, espero que te lo pases bien 👍");
    }catch{}
});

client.login(token);

function deb(msg){
    console.log("- " + msg);
}

function embed(title, description, color){
    const embed = new Discord.MessageEmbed()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    return embed;
}

function embed(title, description){
    const embed = new Discord.MessageEmbed()
    .setColor(palette[1])
    .setTitle(title)
    .setDescription(description)
    return embed;
}

function progressBar(value, maxValue, size){
    const percentage = value / maxValue; // Calculate the percentage of the bar
    const progress = Math.round((size * percentage)); // Calculate the number of square caracters to fill the progress side.
    const emptyProgress = size - progress; // Calculate the number of dash caracters to fill the empty progress side.

    const progressText = '▇'.repeat(progress); // Repeat is creating a string with progress * caracters in it
    const emptyProgressText = '—'.repeat(emptyProgress); // Repeat is creating a string with empty progress * caracters in it
    const percentageText = Math.round(percentage * 100) + '%'; // Displaying the percentage of the bar

    const bar = '```[' + progressText + emptyProgressText + ']' + percentageText + '```'; // Creating the bar
    return bar;
}
