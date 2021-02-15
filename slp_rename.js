#!/usr/bin/env node
const fs = require('fs');
var prompt = require('prompt-sync')({ sigint: true });
const path = require('path');
const { default: SlippiGame } = require('@slippi/slippi-js');
const slp = require('@slippi/slippi-js');
const pressAnyKey = require('press-any-key');
const { version, stdin } = require('process');
const { resolve } = require('path');
const { rejects } = require('assert');

const logo = {
	text:
		'__________________________________________________________________________________\n' +
		'__________________████________________________________________████________________\n' +
		'________________▓▓▓▓▓▓▓▓____________________________________▓▓▓▓▓▓██______________\n' +
		'______________██▓▓▓▓▓▓▓▓██________________________________██▓▓▓▓▓▓▓▓██____________\n' +
		'____________██▓▓▓▓▓▓▓▓▓▓██________________________________██▓▓▓▓▓▓▓▓▓▓██__________\n' +
		'____________██▓▓▓▓▓▓▓▓▓▓██________________________________██▓▓▓▓▓▓▓▓▓▓██__________\n' +
		'__________██▓▓▓▓▒▒__▒▒▓▓▓▓██____________________________██▓▓▓▓▒▒__▒▒▓▓▓▓██________\n' +
		'__________██▓▓▓▓░░____▓▓▓▓██____________________________██▓▓██______▓▓▓▓██________\n' +
		'__________██▓▓▓▓░░____▓▓▓▓██____________________________██▓▓██______▓▓▓▓██________\n' +
		'________██▓▓▓▓▓▓░░____▓▓▓▓▓▓██________________________██▓▓▓▓██______▓▓▓▓▓▓██______\n' +
		'________██▓▓▓▓░░░░____░░▓▓▓▓██________________________██▓▓▓▓________░░▓▓▓▓██______\n' +
		'________██▓▓▓▓░░░░____░░▓▓▓▓▓▓██____________________██▓▓▓▓▓▓░░____░░░░▓▓▓▓██______\n' +
		'________██▓▓▓▓░░░░__░░__▓▓▓▓▓▓████████████████████████▓▓▓▓▓▓░░░░__░░░░▓▓▓▓██______\n' +
		'________██▒▒▒▒░░▒▒__▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░▒▒░░▒▒▒▒██______\n' +
		'________██▒▒▒▒░░░░▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒__░░▒▒▒▒██______\n' +
		'____██████▒▒▒▒__▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒░░▒▒▒▒██████__\n' +
		'____██__░░▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒░░__██__\n' +
		'____██__▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒__██__\n' +
		'______██__▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒__██____\n' +
		'__████░░██░░▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒__██__████\n' +
		'__██░░██░░__▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒__░░██__██\n' +
		'__██__░░██__▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒__██____██\n' +
		'__██________▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒________██\n' +
		'____██______▒▒▒▒▒▒▒▒░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██░░░░▒▒▒▒▒▒▒▒______██__\n' +
		'________██░░____▒▒▒▒▒▒▒▒██████░░░░░░░░░░░░░░░░░░░░░░░░██████▒▒▒▒▒▒▒▒______██______\n' +
		'____██████████____▒▒▒▒▒▒▒▒████░░░░░░░░░░░░░░░░░░░░░░░░████▒▒▒▒▒▒▒▒░░__██████████__\n' +
		'__██____░░____██__▒▒▒▒▒▒▒▒▒▒████░░░░░░░░░░░░░░░░░░░░████▒▒▒▒▒▒▒▒▒▒__██________░░██\n' +
		'______██████________▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░▒▒▒▒░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒________██████____\n' +
		'__________████______░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░▒▒░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒________▓▓██________\n' +
		'____________████████____▒▒▒▒▒▒▒▒▒▒▒▒░░░░▒▒▒▒░░░░▒▒▒▒▒▒▒▒▒▒▒▒____████████__________\n' +
		'____________________████░░▒▒▒▒▒▒▒▒▒▒░░▒▒▒▒▒▒▒▒░░▒▒▒▒▒▒▒▒▒▒░░████__________________\n' +
		'__________________________██__▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒__██________________________\n' +
		'_________SLP_Renamer________██__▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░██__________________________\n' +
		'_________R_E_B_O_R_N__________██░░▒▒▒▒▓▓▒▒▒▒▓▓▒▒▒▒__██____________________________\n' +
		'______________________________██__▒▒▒▒▓▓▒▒▓▓▓▓▒▒▒▒__██____________________________\n' +
		'________________________________██░░▒▒▓▓▓▓▓▓▓▓▒▒░░██______________________________\n' +
		'________________________________██____████████____██______________________________\n' +
		'__________________________________▓▓__████████__██_____________This_is_stolen_____\n' +
		'__________________________________▒▒▒▒▒▒░░▒▒▒▒██▒▒___________please_dont_hate_me__\n' +
		'____________________________________░░██░░████____________________________________\n',
};

const argv = require('yargs')
	.usage('Usage: $0 [options] <directories>') // Actual assumed syntax> node slp_rename.js './Folder'

	.boolean('p')
	.describe('p', 'player name')
	.boolean('n')
	.describe('n', 'perform a trial run without renaming')
	.boolean('r')
	.describe('r', 'rename in subdirectories too')
	.boolean('s')
	.describe('s', 'enable sorting')
	.help('h').argv;

/** Returns character with their tag or color in parentheses (if they have either). */

function playerName(player, metadata) {
	let character = slp.characters.getCharacterName(player.characterId);

	const color = slp.characters.getCharacterColorName(
		player.characterId,
		player.characterColor
	);

	let playerIds = [];

	if (player.nametag) {
		playerIds.push(player.nametag);
	} else if (color !== 'Default') {
		playerIds.push(color);
	}

	if (
		metadata &&
		metadata.names.netplay !== 'Player' &&
		metadata.names.netplay !== undefined
	) {
		playerIds.push(metadata.names.netplay);
		//console.log('Metadata: \n' + metadata);
	}

	if (playerIds.length > 0) {
		return `${character} (${playerIds.join(',')})`;
	} else {
		return character;
	}
}

function prettyPrintTeams(settings, metadata, winningTeam) {
	const stage = slp.stages.getStageName(settings.stageId);
	const teams = new Map();
	for (let i = 0; i < settings.players.length; i++) {
		let player = settings.players[i];
		if (!teams.has(player.teamId)) {
			teams.set(player.teamId, []);
		}
		if (metadata) {
			teams.get(player.teamId).push(playerName(player, metadata.players[i]));
		} else {
			teams.get(player.teamId).push(playerName(player));
		}
	}
	/* 	if (0 == winningTeam)
		const pretty = Array.from(teams.values())
			.map((team) => team.join(' & '))
			.join(' vs ');
	else if (1 == winningTeam)
		teams[]
		const pretty = Array.from(teams.values())
			.map((team) => team.join(' & '))
			.join(' vs ');
	else */
	const pretty = Array.from(teams.values())
		.map((team) => team.join(' & '))
		.join(' vs ');

	return `${pretty} - ${stage}`;
}

function prettyPrintSingles(settings, metadata, gameVictor) {
	// kind of annoying that some games don't have metadata
	//tru
	let player1, player2;

	if (metadata) {
		//console.log(metadata);
		player1 = playerName(settings.players[0], metadata.players[0]);
		player2 = playerName(settings.players[1], metadata.players[1]);
	} else {
		player1 = playerName(settings.players[0]);
		player2 = playerName(settings.players[1]);
	}
	const stage = slp.stages.getStageName(settings.stageId);

	if (0 == gameVictor) return `${player1} beat ${player2} at ${stage}`;
	else if (1 == gameVictor) return `${player2} beat ${player1} at ${stage}`;
	else return `${player1} vs ${player2} - ${stage}`;
}

function parsedFilename(settings, metadata, stats, file) {
	const dateRegex = file.match('_([^.]+)');

	let datePrefix = null;
	if (!dateRegex) {
		if (!metadata) {
			return null;
		}
		const dateStr = metadata.startAt.replace(/[-:]/g, '');
		datePrefix = dateStr.substring(0, dateStr.length - 1);
	} else {
		datePrefix = dateRegex[1];
	}

	let pretty = null;

	if (settings.isTeams) {
		pretty = prettyPrintTeams(settings, metadata);
	} else {
		//console.log(stats)
		winner = findGameWinner(stats);

		pretty = prettyPrintSingles(settings, metadata, winner);
	}
	if (!pretty) {
		return null;
	}

	return `${datePrefix} - ${pretty}.slp`;
}

//returns player index of this slp files winner(based on on kills then deaths)
//small note: i know this is really inefficient
function findGameWinner(stats) {
	/* SAMPLE STOCK
			{
			playerIndex: 1,
			opponentIndex: 0,
			startFrame: 6165,
			endFrame: 9304,
			startPercent: 0,
			endPercent: 155.7899932861328,
			currentPercent: 155.7899932861328,
			count: 3,
			deathAnimation: 7
			} 
		*/
	let stonks = stats.stocks;
	let finalStonk = stonks[stonks.length - 1];

	if (finalStonk.endFrame == null) {
		finalStonk = stonks[stonks.length - 2];
	}

	port1 = 0;
	port2 = 0;
	//counting deaths
	for (stock in stonks) {
		if (stonks[stock].endFrame == null) {
			continue;
		} //if stock has no end, it dont count
		if (stonks[stock].playerIndex) port1++;
		else port2++;
	}
	if (port1 > port2) {
		//	console.log("Winner's playerIndex is " + 0 + ' by dying less');
		return 0;
	}
	if (port1 < port2) {
		//	console.log("Winner's playerIndex is " + 1 + ' by dying less');
		return 1;
	}

	//Error, Tie, or No stocks taken
	console.log('Wierd game - findGameWinner giving an error');

	return -1;
}

function isDirectory(dir) {
	const stats = fs.lstatSync(dir);
	return stats && stats.isDirectory();
}

async function requireUserKeypress() {
	await pressAnyKey('Press any key to continue\n\n');
}

let DONE = false;
async function runRenamerApp() {
	console.log(logo.text);
	//MULTIFILE ALGO:
	let directories = argv._;

	//packaged app interface
	if (directories.length == 0) {
		let cont = false;
		let x = 0;
		console.log(
			`\n\nThe current directory is: ${__dirname}\n` +
				`is this directory okay to rename slp files in? `
		);
		while (!cont) {
			x++;

			var ans = await prompt(
				"Answer 'y' or 'n' continue, or CTRL+C to exit: ",
				{
					ctrlC: 'reject',
				}
			);

			if (ans == 'y' || ans == 'n') cont = true;
			if (ans == 'y') {
				console.log('sure?');
				requireUserKeypress();
				directories = ['./'];
				cont = true;
			} else if (ans == 'n') {
				console.log('move it to that directory and run it again');
				cont = true;
				process.exit();
			} else {
				console.log("i didn't quite understand that");
			}

			if (x > 23) {
				console.log('dude...');
				cont = true;
				process.exit();
			}
			if (x > 20 && x != 21) {
				console.log('dude forreal...? last chance');
			}
		}
	}

	while (directories.length > 0) {
		const dir = directories.pop();

		if (!isDirectory(dir)) {
			//console.log(`${dir} is not a directory, skipping.`);
			continue;
		}

		console.log(`Searching ${dir} for slp files.`);

		const files = fs.readdirSync(dir);
		for (const file of files) {
			DONE = false;
			console.log('\nCurrent Game:' + file);

			//SINGLE-FILE ALGO STARTS HERE:

			/*Checking if file is done:
			
			The Regex Searches with ^(.*\(.*\))(\ beat\ )(.*\(.*\))(\ at\ )(.*\.slp)$

			It'll look like this:
			20210101T696969 Fox(Name, Color) beat Marth(Name, Color) at Platform in Space.slp*/

			const filePath = path.join(dir, file);

			if (argv.r && (await isDirectory(filePath))) {
				directories.push(filePath);
				console.log(
					'Oops ' +
						file +
						' was a folder. Adding the contents to the end of the current list...'
				);
				continue;
			} else {
				if (!file.match(/(^.*)(.slp$)/)) {
					console.log(`'${file}' skipped.`);
					continue;
				}
			}

			const f = file.match(/^(.*(.*))( beat )(.*(.*))( at )(.*.slp)$/);
			if (f!=null) {
				console.log(`'${file}' is done already.`);
				DONE = true;
			} else {
				DONE = false;
			}

			if (!DONE) {
				console.log('Loading game...');
				const game = new SlippiGame(filePath);
				
				const settings = game.getSettings();
				const metadata = game.getMetadata();
				const stats = game.getStats();

				const newName = parsedFilename(settings, metadata, stats, file);

				if (newName == null) {
					console.log(`Error parsing '${file}'`);
					continue;
				}

				const newPath = path.join(dir, newName);
				if (!argv.n) {
					fs.rename(filePath, newPath, (err) => {
						if (err) {
							console.log(`Error renaming ${filePath}: ${err}`);
						} else {
							console.log(`Renamed: ${file} -> ${newName}`);
						}
					});
				} else {
					//SAFE MODE ENABLED
					console.log(`${file} would be ${newName}`);
					/*
				if(argv.s){	
					console.log('Calling safe sort')

				}  */
				}
			}
		}
	}

	console.log('peace dawg');
	requireUserKeypress();
}

runRenamerApp();
