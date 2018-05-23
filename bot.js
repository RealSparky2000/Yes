const Discord = require('discord.js');
const client = new Discord.Client();
const superagent = require('superagent')
const { exec } = require('child_process');
var servers = {};
client.on('ready', () => {
    client.user.setPresence({ game: { name: '&help || cookies', type: 0 } });
    console.log(`Sonex is ready to explore a new world!`);
});
    
var prefix = '&';
client.on("message", async message => {
    var args = message.content.substring(prefix.length).split(" ");
    if (!message.content.startsWith(prefix)) return;
    switch (args[0].toLowerCase()) {
        case "ping":
        var newemb = new Discord.RichEmbed()
.setColor(0x00AE86)
.addField('Pong! ```Latency: ```', new Date().getTime() - message.createdTimestamp + " ms ")
message.channel.send({embed: newemb})
        break;
        case "bing":
                    var newemb = new Discord.RichEmbed()
.setColor(0x00AE86)
.addField('Bong! ```Latency: ```', new Date().getTime() - message.createdTimestamp + " ms ")
message.channel.send({embed: newemb})
            break;
        case "cookie":
            message.channel.sendMessage("COOOKKIIIESSSSS!");
            break;
        case "play":
            var gamestr = args.join(" ").replace("play ", "");
            if (message.author.id === "378998523028307973" || message.author.id === "353271087758573578") {
                client.user.setPresence({ game: { name: gamestr, type: 0 } });
                message.reply("The game was set to " + gamestr);
            }
            else {
                message.reply("Access denied.");
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
                .setColor(0x00AE86)
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
                .setColor(0x00AE86);
            message.channel.send({ embed });
            break;
        case "help":
                    var embed = new Discord.RichEmbed()
                        .addField('Help Commands', "```avatar, help, info, serverinfo, weather```", true)
                        .addField('Entertainment Commands', "```ping, bing, 8ball, cat, dog```", true)
                        .addField('Commands For Moderate', "```ban, kick, report, warn, clean, reload```", true)        
                        .setAuthor('Sonex', client.user.avatarURL)
                        .setFooter(`Requested By ${message.author.username}#${message.author.discriminator}`)
                        .setColor(0x00AE86);
                    message.channel.send({ embed });
            break;
        case "info":
            var user = message.mentions.users.first() || message.author;
            var embed = new Discord.RichEmbed()
                .setThumbnail(user.avatarURL)
                .setColor(0x00AE86)
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
                .setColor(0x00AE86)
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
        case "weather":
          var weather = require('weather-js');
          weather.find({search: args.join(" "), degreeType: 'C'}, function(err, result) {
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
          .setColor(0x00AE86)
          .addField('Timezone',`UTC${location.timezone}`, true)
          .addField('Degree Type',location.degreetype, true)
          .addField('Temperature',`${current.temperature} Degrees`, true)
          .addField('Feels Like', `${current.feelslike} Degrees`, true)
          .addField('Winds',current.winddisplay, true)
          .addField('Humidity', `${current.humidity}%`, true);
          message.channel.send({embed});
  });

        break;
	case "bash":
		if (message.author.id === "378998523028307973" || message.author.id === "353271087758573578") {
			var cmd = args.join(" ").replace("bash ", "");
			exec(cmd, (err, stdout, stderr) => {
				if(err) {
					message.channel.send("err");
					return;
				}
				if(stdout!=null) {
					message.channel.send("```\n" + stdout + "\n```")
				}
				if(stderr!=null) {
                                        message.channel.send("```\n" + stderr + "\n```")
                                }
			});
		}
		break;
        case "report":
    var rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("**Couldn't find user.**");
    var rreason = args.join(" ").slice(22);

    var reportEmbed = new Discord.RichEmbed()
    .setDescription("Reports")
    .setColor(0x00AE86)
    .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
    .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
    .addField("Channel", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", rreason);

    var reportschannel = message.guild.channels.find(`name`, "mod-log");
    if(!reportschannel) return message.channel.send("**Can't find mod-log channel.**");


    message.delete().catch(O_o=>{});
    reportschannel.send(reportEmbed);


    break;
    case "kick":
    var kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.channel.send("**Can't find user!**");
    var kReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("**No can do pal!**");
    if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("**That person can't be kicked!**");

    var kickEmbed = new Discord.RichEmbed()
    .setDescription("~Kick~")
    .setColor(0x00AE86)
    .addField("Kicked User", `${kUser} with ID ${kUser.id}`)
    .addField("Kicked By", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("Kicked In", message.channel)
    .addField("Tiime", message.createdAt)
    .addField("Reason", kReason);

    var kickChannel = message.guild.channels.find(`name`, "mod-log");
    if(!kickChannel) return message.channel.send("**Can't find mod-log channel.**");

    message.guild.member(kUser).kick(kReason);
    kickChannel.send(kickEmbed);


        break;
        case "ban":
    var bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.channel.send("**Can't find user!**");
    var bReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send("No can do pal!");
    if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("**That person can't be banned!**");

    var banEmbed = new Discord.RichEmbed()
    .setDescription("~Ban~")
    .setColor(0x00AE86)
    .addField("Banned User", `${bUser} with ID ${bUser.id}`)
    .addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("Banned In", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", bReason);

    var incidentchannel = message.guild.channels.find(`name`, "mod-log");
    if(!incidentchannel) return message.channel.send("**Can't find mod-log channel.**");

    message.guild.member(bUser).ban(bReason);
    incidentchannel.send(banEmbed)
        break;
      case "dog":
    var { body } = await superagent
    .get('https://dog.ceo/api/breeds/image/random');
    var embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTitle("Woof :dog2:")
    .setImage(body.message)
    message.channel.send({embed});

   break;
      case "cat":
 var{body} = await superagent
  .get(`http://aws.random.cat/meow`);

  var embed = new Discord.RichEmbed()
  .setColor(0x00AE86)
  .setTitle("Cat 🐱")
  .setImage(body.file);

  message.channel.send({embed});
  break;
      case "warn":
  let reason = args.slice(1).join(' ');
  var user = message.mentions.users.first();
  let modlog = client.channels.find('name', 'mod-log');
  if (!modlog) return message.reply('**I cannot find a mod-log channel**');
  if (reason.length < 1) return message.reply('**You must supply a reason for the warning.**');
  if (message.mentions.users.size < 1) return message.reply('**You must mention someone to warn them.**').catch(console.error);
  var embed = new Discord.RichEmbed()
  .setColor(0x00AE86)
  .setTimestamp()
  .addField('Action:', 'Warning')
  .addField('User:', `${user.username}#${user.discriminator}`)
  .addField('Modrator:', `${message.author.username}#${message.author.discriminator}`);
  return client.channels.get(modlog.id).sendEmbed(embed);
  break;
      case "reload":
  let command;
  if (client.commands.has(args[0])) {
    command = args[0];
  } else if (client.aliases.has(args[0])) {
    command = client.aliases.get(args[0]);
  }
  if (!command) {
    return message.channel.sendMessage(`**I cannot find the command: ${args[0]}**`);
  } else {
    message.channel.sendMessage(`**Reloading: ${command}**`)
      .then(m => {
        client.reload(command)
          .then(() => {
            m.edit(`**Successfully reloaded: ${command}**`);
          })
          .catch(e => {
            m.edit(`**Command reload failed: ${command}\n\`\`\`${e.stack}\`\`\`**`);
          });
      });
};
break;
      default:
  break;
        message.channel.sendMessage('**Invalid command**');
    }
});
client.login("token");
