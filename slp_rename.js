#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { default: SlippiGame } = require('@slippi/slippi-js');
const slp = require('@slippi/slippi-js');

const argv = require('yargs')
	.usage('Usage $0 [options] <directories>') // Actual assumed syntax> node slp_rename.js "./Folder"

	.demandCommand(1, 'You must provide directories to rename.')
	.boolean('n')
	.describe('n', 'perform a trial run without renaming')
	.boolean('r')
	.describe('r', 'rename in subdirectories too')
	.boolean('s')
	.describe('s', 'enable sorting')
	.boolean('f')
	.describe('f', 'Single file rename')
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

function prettyPrintTeams(settings, metadata) {
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

	const pretty = Array.from(teams.values())
		.map((team) => team.join(' & '))
		.join(' vs ');
	return `${pretty} - ${stage}`;
}

function prettyPrintSingles(settings, metadata) {
	// kind of annoying that some games don't have metadata
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

	return `${player1} vs ${player2} - ${stage}`;
}

function parsedFilename(settings, metadata, file) {
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
		pretty = prettyPrintSingles(settings, metadata);
	}
	if (!pretty) {
		return null;
	}

	return `${datePrefix} - ${pretty}.slp`;
}

//returns player index of this slp files winner(based on deaths)
function findGameWinner(file) {
	/*

	//Get game settings – stage, characters, etc
	//const settings = file.getSettings();
	//console.log(settings);

	//Get metadata - start time, platform played on, etc
	//const metadata = file.getMetadata();
	//console.log(metadata);

	//Get computed stats - openings / kill, conversions, etc
	//const stats = file.getStats();
	//console.log('Playerindex 0 kills:' + stats.overall[0].killCount);
	//console.log('Playerindex 1 kills:' + stats.overall[1].killCount);
	
	//Get an ordered list of each stock taken
	//const stonks = file.stocks;
	//console.log(stonks[stonks.length-1]);
	
	*/

	const stats = file.getStats(); //get computed stats - openings / kill, conversions, etc
	const stonks = stats.stocks; //get an ordered list of each stock taken
	const laststonk = stonks[stonks.length - 1]; //get last stock that ended
	if (laststonk.count == 1){
		//If this was their last stock the game is over and the otherperson wins
		console.log(
			"Winner's playerIndex is " + laststonk.opponentIndex + ' by stock elim'
		);
		return laststonk.opponentIndex;
	} else {
		//we only calc the special case on call for effiency
		let killLeader = 0;
		let second_best = null;
		for (let i = 1; i <= stats.length; i++) {
			//check port1 against everyother port for who has the most kills
			if (stats.overall[killLeader].killCount < stats.overall[i].killCount)
				killLeader = second_best;
			killLeader = i;
		}
		if (second_best == null) {
			console.log(
				"Winner's playerIndex is: " + killLeader + ' via becoming kill leader'
			);
			return killLeader;
		} else {
			console.log('no fucking idea who won... you choose: \n' + stats.overall);
		}
	}
	//Error, Tie, or Timeout
	return -1;
}

function isDirectory(dir) {
	const stats = fs.lstatSync(dir);
	return stats && stats.isDirectory();
}

function isFile(file) {
	return err('TODO: implement');
}

function sortFiles(safe, dir) {
	if (!fs.existsSync((dir + '/Wins').join())) {
		try {
			fs.open(dir);
		} catch {}
	}
	return err("Couldn't sort, my b");
}

//MULTIFILE ALGORITHM
const directories = argv._;

while (directories.length > 0) {
	const dir = directories.pop();

	if (!isDirectory(dir)) {
		console.log(`${dir} is not a directory, skipping.`);
		continue;
	}

	console.log(`Searching ${dir} for slp files.`);

	const files = fs.readdirSync(dir);
	for (const file of files) {
		//MULTIFILE ALGO ONLY
		console.log('\n\n\nCurrent Game:' + file);
		console.log('Loading...');
		//SINGLE-FILE ALGO

		const filePath = path.join(dir, file);
		if (argv.r && isDirectory(filePath)) {
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
		const game = new SlippiGame(filePath);

		findGameWinner(game);
		const settings = game.getSettings();
		const metadata = game.getMetadata();

		const newName = parsedFilename(settings, metadata, file);
		if (!newName) {
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
			console.log(`${file} -> ${newName}`);
		}
	}
}
