const { description, execute } = require("../random_fun/ping");

module.exports = {
    name: 'args-info',
    description: 'Gives info about the arguments provided',
    execute(message, args) {
        if (args[0] === 'foo') {
            return message.channel.send('bar');
        }

        message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
    },
};