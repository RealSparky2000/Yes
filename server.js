const Discord = require('discord.js');
const client = new Discord.Client();
const superagent = require('superagent')
const { exec } = require('child_process');
const meme = require('memejs');
const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
let os = require('os')
let cpuStat = require("cpu-stat")
const ms = require("ms");
const help = require("./help").run;
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YOUTUBE_KEY);
const YTDL = require("ytdl-core");
client.on('ready', () => {
    client.user.setUsername('Ayerety')
    client.user.setPresence({ game: { name: '&help || Version 3.8.2', type: 0 } });
    console.log(`Ayerety is ready to explore a new world!`);
});

var servers = {};
var prefix = '&';
client.on("message", async message => {
    var args = message.content.substring(prefix.length).split(" ");
    if (!message.content.startsWith(prefix)) return;
    switch (args[0].toLowerCase()) {
        case "ping":
            var newemb = new Discord.RichEmbed()
                .setColor("#ffffff")
                .addField('Pong! ```•Latency: ```', new Date().getTime() - message.createdTimestamp + " ms ")
            message.channel.send({ embed: newemb })
            break;
        case 'restart':
            if (message.author.id !== "353271087758573578" && message.author.id !== "378998523028307973") return message.channel.send("``Sorry, but you cant restart bot!✖``");
            resetBot(message.channel);
            function resetBot(channel) {
                message.react('✅')
                    .then(message => client.destroy())
                    .then(() => client.login(process.env.SECRET));
                message.channel.send("``Ayerety is sucessfully restarted!``")
            }
            break;
        case "play":
            var gamestr = args.join(" ").replace("play ", "");
            if (message.author.id === "378998523028307973" || message.author.id === "353271087758573578") {
                client.user.setPresence({ game: { name: gamestr, type: 0 } });
                message.channel.send("**The game was set to **" + gamestr);
            }
            else {
                message.reply("Access denied.");
            }
            break;
        case "stream":
            if (message.author.id !== "353271087758573578" && message.author.id !== "378998523028307973") return message.channel.send("**You cant change stream status!**");
            var sgame = args.join(' ').substring(7);
            if (sgame.length === 0) {
                var embed = new Discord.RichEmbed()
                    .setColor("#ffffff")
                    .setDescription('**❎ Name streaming status!**');
                message.channel.send({ embed });
            }
            else {
                client.user.setPresence({ game: { name: sgame, url: 'https://twitch.tv/sh1eldee', type: 1 } });
                var embed = new Discord.RichEmbed()
                    .setColor("#ffffff")
                    .setDescription('**✅ You sucessfully changed streaming status.**');
                message.channel.send({ embed });
            };
            break;
        case "8ball":
            if (!args[0]) {
                var errEmbed = new Discord.RichEmbed()
                    .setColor("#ffffff")
                    .setAuthor('Ayerety')
                    .setTitle(':exclamation: Usage: **&!8ball (question)**');
                message.channel.send({ embed: errEmbed })
                return;
            }
            var sayings = ["It is certain",
                "•It is decidedly so",
                "•Without a doubt",
                "•Yes, definitely",
                "•You may rely on it",
                "•As I see it, yes",
                "•Most likely",
                "•Outlook good",
                "•Yes",
                "•Signs point to yes",
                "•Reply hazy try again",
                "•Ask again later",
                "•Better not tell you now",
                "•Cannot predict now",
                "•Concentrate and ask again",
                "•Don't count on it",
                "•My reply is no",
                "•My sources say no",
                "•Outlook not so good",
                "•Very doubtful"];

            var result = Math.floor((Math.random() * sayings.length) + 0);
            const ballEmb = new Discord.RichEmbed()
                .setColor("#ffffff")
                .setAuthor('8ball', 'https://findicons.com/files/icons/1700/2d/512/8_ball.png')
                .addField(args, sayings[result]);
            message.channel.send({ embed: ballEmb })
            break;
        case "avatar":
            var user = message.mentions.users.first() || message.author;
            var embed = new Discord.RichEmbed()
                .setAuthor('Ayerety', client.user.avatarURL)
                .setTitle('The Ayerety steals avatars :D')
                .setDescription('[Avatar Link](' + user.avatarURL + ')')
                .setImage(user.displayAvatarURL)
                .setColor("#ffffff");
            message.channel.send({ embed });
            break;
        case "help":
            help(client, message, args);
            break;
        case "info":
            var user = message.mentions.users.first() || message.author;
            var embed = new Discord.RichEmbed()
                .setThumbnail(user.avatarURL)
                .setColor("#ffffff")
                .setTitle(`User Info for __${user.username}__`)
                .addField('•ID', user.id, true)
                .addField('•Discriminator', user.discriminator, true)
                .addField('•Status', user.presence.status, true)
                .addField("•Game:", `${user.presence.game ? user.presence.game.name : 'None'}`, true)
                .addField('•Bot?', user.bot, true)
                .addField('•Created At', user.createdAt, true);
            message.channel.send({ embed });
            break;
        case "clean":
            if (!message.guild.member(client.user).hasPermission('MANAGE_MESSAGES')) return message.channel.send('**I do not have the correct permissions.**').catch(console.error);
            if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("**Sorry, but you do not have valid permissions! If you beleive this is a error, contact an owner.**");
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
                .setColor("#ffffff")
                .setThumbnail(sicon)
                .addField('ID', message.guild.id, true)
                .addField('•Name', message.guild.name, true)
                .addField('•Owner', message.guild.owner.user.tag, true)
                .addField('•Region', message.guild.region, true)
                .addField('•Channels', message.guild.channels.size, true)
                .addField('•Members', message.guild.memberCount, true)
                .addField('•Humans', message.guild.memberCount - message.guild.members.filter(m => m.user.bot).size, true)
                .addField('•Bots', message.guild.members.filter(m => m.user.bot).size, true)
                .addField('•Online', online.size, true)
                .addField('•Roles', message.guild.roles.size, true);
            message.channel.send({ embed });
            break;
        case "weather":
            var weather = require('weather-js');
            weather.find({ search: args.join(" "), degreeType: 'C' }, function (err, result) {
                if (err) message.channel.send(err);
                if (result === undefined || result.length === 0) {
                    message.channel.send('**Please enter a right location!**');
                    return;
                }
                var current = result[0].current;
                var location = result[0].location;
                var embed = new Discord.RichEmbed()
                    .setDescription(`**${current.skytext}**`)
                    .setAuthor(`Weather for ${current.observationpoint}`)
                    .setThumbnail(current.imageUrl)
                    .setColor("#ffffff")
                    .addField('•Timezone', `UTC${location.timezone}`, true)
                    .addField('•Degree Type', location.degreetype, true)
                    .addField('•Temperature', `${current.temperature} Degrees`, true)
                    .addField('•Feels Like', `${current.feelslike} Degrees`, true)
                    .addField('•Winds', current.winddisplay, true)
                    .addField('•Humidity', `${current.humidity}%`, true);
                message.channel.send({ embed });
            });

            break;
        case "bash":
            if (message.author.id !== "353271087758573578" && message.author.id !== "378998523028307973") return message.channel.send("**You cant use bash system!**");
            var cmd = args.join(" ").replace("bash ", "");
            exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    message.channel.send("err");
                    return;
                }
                if (stdout != null) {
                    message.channel.send("```\n" + stdout + "\n```")
                }
                if (stderr != null) {
                    message.channel.send("```\n" + stderr + "\n```")
                }
            });
            break;
        case "report":
            if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("**Sorry, but you do not have valid permissions! If you beleive this is a error, contact an owner.**");
            var rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
            if (!rUser) return message.channel.send("**Couldn't find user.**");
            var rreason = args.join(" ").slice(22);
            if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) return message.channel.send('**I do not have the correct permissions.**').catch(console.error)

            var reportEmbed = new Discord.RichEmbed()
                .setDescription("Reports")
                .setColor("#ffffff")
                .addField("•Reported User", `${rUser} with ID: ${rUser.id}`)
                .addField("•Reported By", `${message.author} with ID: ${message.author.id}`)
                .addField("•Channel", message.channel)
                .addField("•Time", message.createdAt)
                .addField("•Reason", rreason);

            var reportschannel = message.guild.channels.find(`name`, "mod-log");
            if (!reportschannel) return message.channel.send("**Can't find mod-log channel.**");


            message.delete().catch(O_o => { });
            reportschannel.send(reportEmbed);


            break;
        case "kick":
            if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("**Sorry, but you do not have valid permissions! If you beleive this is a error, contact an owner.**");
            var kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
            if (!kUser) return message.channel.send("**Can't find user!**");
            var kReason = args.join(" ").slice(22);
            if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("**No can do pal!**");
            if (kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("**That person can't be kicked!**");
            if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) return message.channel.send('**I do not have the correct permissions.**').catch(console.error);

            var kickEmbed = new Discord.RichEmbed()
                .setDescription("~Kick~")
                .setColor("#ffffff")
                .addField("•Kicked User", `${kUser} with ID ${kUser.id}`)
                .addField("•Kicked By", `<@${message.author.id}> with ID ${message.author.id}`)
                .addField("•Kicked In", message.channel)
                .addField("vTiime", message.createdAt)
                .addField("•Reason", kReason);

            var kickChannel = message.guild.channels.find(`name`, "mod-log");
            if (!kickChannel) return message.channel.send("**Can't find mod-log channel.**");

            message.guild.member(kUser).kick(kReason);
            kickChannel.send(kickEmbed);


            break;
        case "ban":
            if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("**Sorry, but you do not have valid permissions! If you beleive this is a error, contact an owner.**");
            var bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
            if (!bUser) return message.channel.send("**Can't find user!**");
            var bReason = args.join(" ").slice(22);
            if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("No can do pal!");
            if (bUser.hasPermission("ADMINISTRATOR")) return message.channel.send("**That person can't be banned!**");
            if (!message.guild.member(client.user).hasPermission('BAN_MEMBERS')) return message.channel.send('**I do not have the correct permissions.**').catch(console.error);

            var banEmbed = new Discord.RichEmbed()
                .setDescription("~Ban~")
                .setColor("#ffffff")
                .addField("•Banned User", `${bUser} with ID ${bUser.id}`)
                .addField("•Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
                .addField("•Banned In", message.channel)
                .addField("•Time", message.createdAt)
                .addField("•Reason", bReason);

            message.guild.member(bUser).ban(bReason);

            var incidentchannel = message.guild.channels.find(`name`, "mod-log");
            if (!incidentchannel) return message.channel.send("**Can't find mod-log channel.**");

            
            incidentchannel.send(banEmbed)
            break;
        case "unban":
            if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES')) return message.channel.send('**I do not have the correct permissions.**').catch(console.error);
            var reason = args.slice(1).join(' ');
            var member = args[0];
            var modlog = client.channels.find('name', 'mod-log');
            if (!modlog) return message.channel.send('**I cannot find a mod-log channel**');
            if (reason.length < 1) return message.channel.send('**You must supply a reason for the unban.**');
            if (!user) return message.channel.send('**You must supply a User Resolvable, such as a user id.**').catch(console.error);
            client.unbanReason = reason;
            client.unbanAuth = message.author;
            message.guild.unban(user);
            message.channel.send(`Successfuly unbanned <@${user}>`)
            break;
        case "stats":
            if (message.author.id !== "353271087758573578" && message.author.id !== "378998523028307973") return message.channel.send("**You cant see the status embed!**");
            var cpuLol;
            cpuStat.usagePercent(function (err, percent, seconds) {
                if (err) {
                    return console.log(err);
                }



                var duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
                var embedStats = new Discord.RichEmbed()
                    .setTitle("*** Stats ***")
                    .setColor("RANDOM")
                    .addField("• Mem Usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`, true)
                    .addField("• Uptime ", `${duration}`, true)
                    .addField("• Users", `${client.users.size.toLocaleString()}`, true)
                    .addField("• Servers", `${client.guilds.size.toLocaleString()}`, true)
                    .addField("• Channels ", `${client.channels.size.toLocaleString()}`, true)
                    .addField("• Discord.js", `v${version}`, true)
                    .addField("• Node", `${process.version}`, true)
                    .addField("• CPU", `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``)
                    .addField("• CPU usage", `\`${percent.toFixed(2)}%\``, true)
                    .addField("• Arch", `\`${os.arch()}\``, true)
                    .addField("• Platform", "``Windows``", true)
                    .addField("Bot version", "3.8.2", true)
                    .setColor("#ffffff")
                message.channel.send(embedStats);
            })
            break;
        case "cat":
            var { body } = await superagent
                .get(`http://aws.random.cat/meow`);

            var embed = new Discord.RichEmbed()
                .setColor("#ffffff")
                .setTitle("Cat 🐱")
                .setImage(body.file);

            message.channel.send({ embed });
            break;
        case "say":
            message.delete();
            if (message.author.bot) return;

            var msg = message.content.toUpperCase();
            var args = msg.split(" ")
            if (!args[1]) return message.channel.send("`You have to provide a message for me to say!`");
            var arg = message.content.split(" ").slice(1);
            message.channel.send(arg.join(" "));
            break;
        case "joke":
            var { body } = await superagent
                .get(`https://icanhazdadjoke.com/slack`);

            var o = new Discord.RichEmbed()
                .setColor("#ffffff")
                .setDescription("**" + body.attachments.map(a => a.text) + "**")
            message.channel.send(o)

            break;
        case "meme":
            meme(function (data) {
                var embed = new Discord.RichEmbed()
                    .setTitle(data.title[0])
                    .setColor("#ffffff")
                    .setImage(data.url[0])
                message.channel.send({ embed });
            });
            break;
        case "coinflip":
            let coin = ['https://www.dhresource.com/0x0s/f2-albu-g4-M01-CB-6B-rBVaEFf172SADIH4AAxRIyzuR3s387.jpg/united-states-of-america-coins-liberty-head.jpg', 'https://images-na.ssl-images-amazon.com/images/I/51NyMaKLydL.jpg']
            var flip = Math.floor((Math.random() * coin.length));
            var embed = new Discord.RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setImage(coin[flip])
                .setColor("#ffffff")
            message.channel.send({ embed });
            break;
        case "invite":
            if (!message.member.hasPermission("CREATE_INSTANT_INVITE")) return;
            message.channel.createInvite({ maxAge: 0 }).then(invite => {
                var embed = new Discord.RichEmbed()
                    .setColor("#ffffff")
                    .setDescription(`**Permanent Invite Link**: ${invite}`);
                message.channel.send(embed);
            });
            break;
        case "candy":
            if (message.mentions.users.size < 1) return message.channel.send('**You must mention someone to give candy them.**').catch(console.error);
            if (!args[0]) {

                var buyEmb = new Discord.RichEmbed()
                    .setColor("#ffffff")
                    .setTitle(`:candy: ${message.author.username} bought him self a candy! :candy:`)
                    .setImage('https://data.whicdn.com/images/29808733/original.gif')
                message.channel.send({ embed: buyEmb })
                return;
            }


            if (!message.mentions.members.first().user.username === message.isMentioned(message.author)) {



                var candyEmb = new Discord.RichEmbed()
                    .setColor("#ffffff")
                    .setTitle(`:candy: ${message.author.username} gave ${message.mentions.members.first().user.username} a candy! :candy:`)
                    .setImage('https://78.media.tumblr.com/427ed12ad003c4dae17f31a198396656/tumblr_nxxqz5SRlY1uf9lmco1_500.gif')
                message.channel.send({ embed: candyEmb })
                return;
            }
            var buyEmb = new Discord.RichEmbed()
                .setColor("#ffffff")
                .setTitle(`:candy: ${message.author.username} bought him self a candy! :candy:`)
                .setImage('https://data.whicdn.com/images/29808733/original.gif')
            message.channel.send({ embed: buyEmb })

            break;
        case "gif":
            if (message.mentions.users.size < 1) return message.channel.send('**You must mention someone to send pat gif them.**').catch(console.error);
            var images = ["https://cdn.discordapp.com/attachments/424667806320033814/437807617965031424/unnamed_1.gif", "https://cdn.glitch.com/5df641e3-8d98-4abb-9045-d5482434003a%2FJake_pat.gif?1524497996034", "https://media.tenor.com/images/cdc004bbbaba6f60d8e62a1f127516e0/tenor.gif"];
            var rand = Math.floor(Math.random() * images.length);
            var randomImage = images[rand];

            var patEmb = new Discord.RichEmbed()
                .setColor("#ffffff")
                .setImage(randomImage);
            var sadEmb = new Discord.RichEmbed()
                .setColor("#ffffff")
                .setImage('https://media.giphy.com/media/Y4z9olnoVl5QI/giphy.gif');
            if (!args[0]) {
                message.channel.send(`<@${message.author.id}> pat <@${message.author.id}>.. Oh wait! You can't pat yourself!`, { embed: sadEmb });
                return;
            }

            if (!message.mentions.users.first()) return message.channel.send(`Please mention someone!`).then(msg => {
                msg.delete(3000)
            });
            message.channel.send(`<@${message.author.id}> pat ${args[0]}`, { embed: patEmb });
            break;
        case "mplay":
	var searchString = args.slice(1).join(' ');
  var url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
            if (!message.guild.member(client.user).hasPermission('SPEAK')) return message.channel.send('**Sorry, but i cant join/speak in this channel!**').catch(console.error);
            if (!args[1]) {
                message.channel.send("**Please provide a URL YouTube link to me to play song.**");
                return;
            }

            if (!message.member.voiceChannel) {
                message.channel.send("**I think it may work better if you are in a voice channel!**");
                return;
            }

            try {
              var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					var video = await youtube.getVideoByID(videos[0].id);
          var video2 = await youtube.getVideoByID(video.id);
          } catch (err) {
            console.error(err);
            return message.channel.send("**Nothing was found by your request.**");
          }
      }
        console.log(video);
        var song = {
          id: video.id,
          title: video.title,
          url: `https://www.youtube.com/watch?v=${video.id}`
        };

            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            message.channel.sendMessage(`🎶Song: **${song.title}** has been added to the queue!`);
            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function (connection) {
                play(connection, message);
            });
            break;
        case "mstop":
            var server = servers[message.guild.id];
            if (!message.member.voiceChannel) {
                message.channel.send("**I think it may work better if you are in a voice channel!**");
                return;
            }

            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            message.channel.send('``The queue of songs removed.``');
            break;
        case "mskip":
            if (!message.member.voiceChannel) {
                message.channel.send("**I think it may work better if you are in a voice channel!**");
                return;
            }

            var server = servers[message.guild.id];
            if (server.dispatcher) server.dispatcher.end();
            message.channel.send('``The song has been sucessfully skipped.``');
            break;
        case "mpause":
            if (!message.member.voiceChannel) {
                message.channel.send("**I think it may work better if you are in a voice channel!**");
                return;
            }

            var server = servers[message.guild.id];
            if (server.dispatcher) server.dispatcher.pause();
            message.channel.send('``The song is paused.``');
            break;
        case "mresume":
            if (!message.member.voiceChannel) {
                message.channel.send("**I think it may work better if you are in a voice channel!**");
                return;
            }

            var server = servers[message.guild.id];
            if (server.dispatcher) server.dispatcher.resume();
            message.channel.send('``The song is sucessfully continued.``');
            break;
          }
function play(connection, message) {
    var server = servers[message.guild.id];
    server.dispatcher = connection.playStream(YTDL(song.url))

    server.queue.shift();

    server.dispatcher.on("end", function () {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });

}
});
client.login(process.env.SECRET);
