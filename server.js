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
const ytdl = require('ytdl-core');
const youtube = new YouTube(process.env.YOUTUBE_KEY);
const queue = new Map();
const figlet = require('figlet');
client.on('ready', () => {
    client.user.setUsername('Ayerety')
    client.user.setPresence({ game: { name: '&help || Version 4.9.2+', type: 0 } });
    console.log(`Ayerety is ready to explore a new world!`);
});

var servers = {};
var prefix = '&';
client.on("message", async message => {
    var args = message.content.substring(prefix.length).split(" ");
    if (!message.content.startsWith(prefix)) return;
  var searchString = args.slice(1).join(' ');
	var url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	var serverQueue = queue.get(message.guild.id);
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
  client.unbanReason = reason;
  client.unbanAuth = message.author;
  var user = args[0];
  var modlog = client.channels.find('name', 'mod-log');
  if (!modlog) return message.reply('I cannot find a mod-log channel');
  if (reason.length < 1) return message.reply('You must supply a reason for the unban.');
  if (!user) return message.reply('You must supply a User Resolvable, such as a user id.').catch(console.error);
  message.guild.unban(user);
            break;
      case "warn":
        var reason = args.slice(1).join(' ');
        var user = message.mentions.users.first();
            var incidentchannel = message.guild.channels.find(`name`, "mod-log");
            if (!incidentchannel) return message.channel.send("**Can't find mod-log channel.**");

        if (!modlog) 
            return message.reply('I cannot find a mod-log channel');

        if (reason.length < 1) 
            return message.reply('You must supply a reason for the warning.');

        if (message.mentions.users.size < 1) 
            return message.reply('You must mention someone to warn them.').catch(console.error);

        var embed = new Discord.RichEmbed()
            .setColor(0x8cff00)
            .setTimestamp()
            .setDescription(`**Action:** Warning\n**Target:** ${user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`);

            incidentchannel.send(embed)
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
                    .addField("• Platform", `\`\`${os.platform()}\`\``,true)
                    .addField("Bot version", "4.9.2+", true)
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

            if (!message.mentions.users.first()) return message.channel.send(`Please mention someone!`).then(message => {
                message.delete(3000)
            });
            message.channel.send(`<@${message.author.id}> pat ${args[0]}`, { embed: patEmb });
            break;
      case "ascii":
  var maxLen = 14 // You can modify the max characters here
  
  if(args.join(' ').length > maxLen) return message.channel.send('Only 14 characters admitted!') 
  
  if(!args[0]) return message.channel.send('Please specify a text to asciify!');
  
  figlet(`${args.join(' ')}`, function(err, data) {
      if (err) {
          console.log('Something went wrong...');
          console.dir(err);
          return;
      }

      message.channel.send(`${data}`, {code: 'AsciiArt'});
  });
break;
      case "mplay":
    var voiceChannel = message.member.voiceChannel;
		if (!voiceChannel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		var permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) {
			return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		}
      if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			var playlist = await youtube.getPlaylist(url);
			var videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				var video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return message.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					var index = 0;
					message.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the 🔎 results ranging from 1-10.
					`);
					// eslint-disable-next-line max-depth
					try {
						var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return message.channel.send('No or invalid value entered, cancelling video selection.');
					}
					var videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return message.channel.send('🆘 I could not obtain any search results.');
				}
			}
			return handleVideo(video, message, voiceChannel);
		}
        break;
      case "mskip":
		if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing that I could skip for you.');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return undefined;
        break;
      case "mstop":
		if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return undefined;
break;
      case "mvolume":
		if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		if (!args[1]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return message.channel.send(`I set the volume to: **${args[1]}**`);
break;
      case "mnp":
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		return message.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
break;
      case "mqueue":
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		return message.channel.send(`
__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title}
	`);
break;
      case "mpause":
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('⏸ Paused the music for you!');
		}
		return message.channel.send('There is nothing playing.');
break;
      case "mresume":
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('▶ Resumed the music for you!');
		}
		return message.channel.send('There is nothing playing.');
	

	return undefined;
break;
}
async function handleVideo(video, message, voiceChannel, playlist = false) {
	var serverQueue = queue.get(message.guild.id);
	console.log(video);
	var song = {
		id: video.id,
		title: video.title,
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		var queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(message.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(message.guild.id);
			return message.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
	}
	return undefined;
}
  function play(guild, song) {
	var serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	var dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
      message.channel.send(`The song **${song.title}** is end.`);
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
}
});
client.login("NDQzNzIwMDEyMDk2NzMzMTg0.DfU0zQ.anmOvYvjxw5Hs7dmFdc9aGTdd4w");
