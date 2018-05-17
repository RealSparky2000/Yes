/*eslint-disable no-unused-params, no-redeclare, no-unused-vars*/
/*globals var messages*/
const Discord = require('discord.js');
const YTDL = require('ytdl-core');
const fs = require("fs");
const client = new Discord.Client();
var servers = {};
client.on('ready', () => {
    client.user.setPresence({ game: { name: '&help || cookies', type: 0 } });
    console.log('Bot is ready to explore a new wolrd!');
});
    
    function play(connection, message) {
        var server = server[message.guild.id];
               
    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
    
    server.queue.shift();
    
    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

var prefix = '&';
client.on('message', message => {
    var args = message.content.substring(prefix.length).split(" ");
    if (!message.content.startsWith(prefix)) return;
    switch (args[0].toLowerCase()) {
        case "ping":
            message.channel.sendMessage('**PONG!**');
            break;
        case "bing":
            message.channel.sendMessage('**BONG!**');
            break;
        case "cookie":
            message.channel.sendMessage('**COOOKIESSSS!**');
            break;
        case "gplay":
            var gamestr = args.join(" ").replace("play ", "");
            if (message.author.id === "378998523028307973" || message.author.id === "353271087758573578") {
                client.user.setPresence({ game: { name: gamestr, type: 0 } });
                message.reply("The game was set to " + gamestr);
            }
            else {
                message.reply("Access deniied.");
            }
            break;
        case "8ball":
            var responses = [
                'Agreed!',
                'Of Course!',
                'Disagree.',
                'No',
                'Maybe',
                'Really?',
                'Cannot predict now.',
                'Yes!'
            ];
            var fetched = responses[Math.floor(Math.random() * responses.length)];
            var embed = new Discord.RichEmbed()
                .setColor('#ffffff')
                .setFooter(fetched);
            message.channel.send({ embed });
            break;
        case "avatar":
            var user = message.mentions.users.first() || message.author;
            var embed = new Discord.RichEmbed()
                .setAuthor('Sonex', client.user.avatarURL)
                .setTitle('The Sonex steals avatars :D')
                .setDescription('[Avatar Link](' + user.avatarURL + ')')
                .setImage(user.displayAvatarURL)
                .setColor('#ffffff');
            message.channel.send({ embed });
            break;
        case "help":
            switch (args[1]) {
                case "avatar":
                    message.channel.send("Displays user's pfp.");
                    break;
                case "info":
                    message.channel.send('Prints information about a user. \nUsage: info [@mention]');
                    break;
                default:
                    var embed = new Discord.RichEmbed()
                        .setTitle('Help Console')
                        .addField("**Avatar**", "Displays user's pfp.", true)
                        .addField("**Help**", "Prints the help.", true)
                        .addField("**Info**", "Prints information about a user. \nUsage: info [@mention]", true)
                        .addField("**Commands for help**", "avatar, help, info, clean", true)
                        .addField("**Сommands for entertainment**", "ping, bing, 8ball", true)
                        .addField('**Music Help Console**', "join, leave, play, stop, skip")
                        .setAuthor('Sonex', client.user.avatarURL)
                        .setColor('#ffffff');
                    message.channel.send({ embed });
                    break;
            }
            break;
        case "info":
            var user = message.mentions.users.first() || message.author;
            var embed = new Discord.RichEmbed()
                .setThumbnail(user.avatarURL)
                .setColor('ffffff')
                .addField('ID', user.id, true)
                .addField('Username', user.username, true)
                .addField('Discriminator', user.discriminator, true)
                .addField('Status', user.presence.status, true)
                .addField('Bot?', user.bot, true)
                .addField('Created At', user.createdAt, true);
            message.channel.send({ embed });
            break;
        case "clean":
            if (isNaN(args[1])) return message.channel.send('**Please supply a valid amount of messages to purge**');
            if (args[1] > 100) return message.channel.send('**Please supply a number less than 100**');
            message.channel.bulkDelete(args[1]);
            message.channel.sendMessage(`**Cleaned ${args[1]} messages** :white_check_mark:`);
            break;
        case "serverinfo":
            var online = message.guild.members.filter(member => member.user.presence.status !== 'offline');
            var day = message.guild.createdAt.getDate();
            var month = 1 + message.guild.createdAt.getMonth();
            var year = message.guild.createdAt.getFullYear();
            var sicon = message.guild.iconURL;
            var embed = new Discord.RichEmbed()
                .setAuthor(message.guild.name, sicon)
                .setFooter('Server Created • ' + month + "." + day + "." + year)
                .setColor('ffffff')
                .setThumbnail(sicon)
                .addField('ID', message.guild.id, true)
                .addField('Name', message.guild.name, true)
                .addField('Owner', message.guild.owner.user.tag, true)
                .addField('Region', message.guild.region, true)
                .addField('Channels', message.guild.channels.size, true)
                .addField('Members', message.guild.memberCount, true)
                .addField('Humans', message.guild.memberCount - message.guild.members.filter(m => m.user.bot).size, true)
                .addField('Bots', message.guild.members.filter(m => m.user.bot).size, true)
                .addField('Online', online.size, true)
                .addField('Roles', message.guild.roles.size, true);
            message.channel.send({ embed });
            break;
        case "join":
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
          message.channel.sendMessage('**I have successfully connected to the channel!**');
        })
        .catch(console.log);
    } else {
      message.channel.sendMessage('**You need to join a voice channel first!**');
    }
        break;
        case "play":
        var servers = {};
        var server = servers[message.guild.id];
    if (!args [1]) {
        message.channel.sendMessage('**Please provide a link!**');
        return;
    }
    
    if (!message.member.voiceChannel) {
        message.channel.sendMessage('**You must be in a voice channel first!**');
    }
    
    if (!servers[message.guild.id]) servers[message.guild.id] = {
        queue: []
    };
    
    var server = servers[message.guild.id];
    
    server.queue.push(args[1]);
    
    if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
        play(connection, message);
    
    });
        break;
        case "skip":
        var servers = {};
        var server = servers[message.guild.id];
        
        if (server.dispatcher) server.dispatcher.end();
        break;
        case "stop":
        var servers = {};
        var server = servers[message.gud];
        
        if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
        break;
        case "leave":
    if (message.member.voiceChannel) {
        message.member.voiceChannel.leave();
    }

        break;
        default:
        message.channel.sendMessage('**Invalid command**');
    }
});
client.login(process.argv[2]);
