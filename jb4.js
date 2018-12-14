const Discord = require('discord.js')
const client = new Discord.Client()
//Code founadition based off of code sample from DevDungeon's Discord.js tutorial (https://www.devdungeon.com/content/javascript-discord-bot-tutorial)

//date global functions
var dailyFlag = true
var dd
var hh = 18//8pm, Intialize hours 0 - 23   (23 = 11pm)
var userlist = {} //dictionary that contains all user data
client.on('ready', () => {
    console.log("Connected as " + client.user.tag)
    client.user.setActivity("Youtube", {type: "WATCHING"})

    client.guilds.forEach((guild) => {
        console.log(guild.name)
        guild.channels.forEach((channel) => {
            console.log(` - ${channel.name} ${channel.type} ${channel.id}`)
        })
        // General Channel Id: 502644403932758048

    })

  	//intial the date
  	var today = new Date()
  	dd = today.getDay()
    let generalChannel = client.channels.get("502644403932758048")
    //const attachment = new Discord.Attachment('https://www.devdungeon.com/sites/all/themes/devdungeon2/logo.png')
    //generalChannel.send(attachment)
})

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) {
        return
    }//if bot ingore message
  	
    //checkes the date
    if (receivedMessage.createdAt.getDay() != dd && receivedMessage.createdAt.getHours() > hh) {
      	//reset the flag + dates
     	resetdailies()
      	dailyFlag = true
      	dd = receivedMessage.createdAt.getDay()
      	
    }
    //receivedMessage.channel.send("Message received, " + receivedMessage.author.toString() + ": " + receivedMessage.content)
  	if (receivedMessage.content.startsWith("j!")) {
        processCommand(receivedMessage)
    }
})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(2) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments) // There may not be any arguments
	console.log(typeof 'arguments');	
  
    if (primaryCommand == "help") {
        helpCommand(arguments, receivedMessage)
    } else if (primaryCommand == "daily") {
        dailyCommand(arguments, receivedMessage) //when called 
    } else if (primaryCommand == "big") {
		bigCommand(arguments, receivedMessage, splitCommand)
    }  else if (primaryCommand == "admin") {
		adminCommand(arguments, receivedMessage, splitCommand)
    } else {
        receivedMessage.channel.send("I don't understand the command. Try `!help` or `!multiply`")
    }
}

//List of commands
function dailyCommand(arguments, receivedMessage) {
  //check username
  var userdata = receivedMessage.author
  if (userdata.id in userlist){
    //claim new rewards
    if (userlist[userdata.id][0] == true){
      receivedMessage.channel.send("Dailies Received") //get dailys
      userlist[userdata.id][0] = false
    }else {
      //stake awards taken
      receivedMessage.channel.send("Already taken")
    }
  }else {
    //new user
    userlist[userdata.id] = [false, userdata.username, 0, 1] //dailys, username, exp, level, required
    receivedMessage.channel.send("Welcome to the game")
    console.log(userlist)
  }

}
function resetdailies() {
  for (var key in userlist){
    userlist[key][0] = true
  }
}
//overwrite everything
function adminCommand(arguments, receivedMessage, splitCommand) {
  //when adding new functions
  if(splitCommand[1] == "changetime") {
    hh = parseInt(splitCommand[2], 10) 
    console.log(hh)
  } else if(splitCommand[1] == "restartday") {
    resetdailies()
    dailyFlag = true
  }
  
}


function bigCommand(arguments, receivedMessage, splitCommand) {
    if (arguments.length > 0) {
        arguments = arguments.toString();
      if (arguments.substr(0,2) == "<:") {
          arguments = arguments.substring(2, arguments.lastIndexOf(":"))
          console.log(arguments + " <-- Here");
        }
      var bigEmoji = receivedMessage.guild.emojis.find(emoji => emoji.name === arguments);
      console.log(bigEmoji.url)
      receivedMessage.channel.send(new Discord.Attachment(bigEmoji.url))
    } else { //if no arguments are recived
      receivedMessage.channel.send("Specify an emote that you would like to send.")
    }
  }

function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 0) {
        receivedMessage.channel.send("Guess you need help with " + arguments + ". Tough luck."+ "Test" + receivedMessage.createdAt)
    } else {
        receivedMessage.channel.send("I'm not sure what you need help with. Try `!help [topic]`")
    }
}


//Bot Token goes here.
client.login("NTEwOTc1MTc5ODg3NzM4ODgx.Dskf-g.LwKo2ZuKM7B1ult-Cia9GoVFUy4") 
