// Shadow Puppet's Gambit mini-game class
class ShadowPuppetGame {
    constructor(initialGold) {
        this.targetNumber = Math.floor(Math.random() * 100) + 1; // Random number between 1-100
        this.attemptsRemaining = 5;
        this.isSecondChance = false;
        this.initialWager = Math.floor(initialGold * 0.75); // 75% of gold, rounded down
        this.currentGuess = 50; // Default value for slider
        this.wagerDeducted = false; // Track if wager has been deducted
    }
    
    // Process a guess and return feedback
    processGuess(guess) {
        this.attemptsRemaining--;
        this.currentGuess = guess;
        
        if (guess === this.targetNumber) {
            return "correct";
        } else if (guess < this.targetNumber) {
            return "higher";
        } else {
            return "lower";
        }
    }
    
    // Start second chance with fewer attempts
    startSecondChance() {
        this.targetNumber = Math.floor(Math.random() * 100) + 1;
        this.attemptsRemaining = 4;
        this.isSecondChance = true;
        this.currentGuess = 50;
        this.wagerDeducted = false; // Reset for second chance wager
        this.initialWager = gameState.gold; // Set new wager to all remaining gold
    }
    
    // Calculate winnings based on whether it's first or second attempt
    calculateWinnings(remainingGold) {
        if (this.isSecondChance) {
            return this.initialWager * 10; // 10x the wagered amount for second chance
        } else {
            return this.initialWager * 2; // 2x initial wager for first chance
        }
    }
}

let gameState = {
    weapon: null,
    gold: 10,
    items: [],
    currentScene: 'intro',
    miniGame: null
};

let scenes = {
    intro: {
        // clear game variables
        action: () => {    
            gameState.weapon = null;
            gameState.gold = 10;
            gameState.items.length = 0;
            gameState.miniGame = null;
            console.log('Game state reset');
        },
        text: `In the kingdom of Arlomea, where magic coursed through the very earth and monsters prowled the wilderness, such sounds had become increasingly common. The village of Palomo, nestled at the foot of Mount Planga, had once enjoyed the protection of Knight Contavious, whose castle stood vigilant upon the mountainside. But the knight's mysterious absence in recent months had emboldened the creatures that lurked in the shadows.

		The morning mist still clung to the cobblestone streets of the village of Palomo when sudden screams pierced the dawn. Jordi bolted upright in his bed, the familiar scent of iron and coal from his father's forge replaced by an altogether different metallic tang – blood.
		
		Jordi's calloused hands, hardened by years of apprenticeship at his father's forge, trembled as he rushed to the Yumian farmstead. The scene before him turned his blood to ice: the door hung from broken hinges, deep claw marks scarred the wooden walls, and inside, Farmer Yumian and his wife lay wounded, their faces pale with fear and loss. But it was what – who – was missing that made Jordi's heart stop.

		Palaiana, his betrothed, had vanished without a trace.`,
        choices: [
            { text: 'Continue', next: 'intro2' }
        ]
    },
    intro2: {
        text: `You are playing Jordi in his quest to find Palaiana.
        You need a weapon for your quest, You can get one from the village weapon shop`,
        choices: [
            { text: 'Go to the shop', next: 'shop' }
        ]
    },
    shop: {
        text: `You enter the village weapon shop.  
        
        There are a variety of weapons on display, but only 2 that you can afford:
        A broad iron sword, or a bow with a quiver of arrows.
        The shopkeeper eyes you with concern. "Choose your weapon wisely, young Jordi."`,
        choices: [
            { 
                text: 'Take the sword (Pay 8 Gold)', 
                next: 'weaponChoiceSword', 
                action: () => {
                    gameState.weapon = 'sword';
                    gameState.gold -= 8;
                }
            },
            { 
                text: 'Take the bow and arrows (Pay 6 Gold)', 
                next: 'weaponChoiceBow', 
                action: () => {
                    gameState.weapon = 'bow';
                    gameState.gold -= 6;
                }
            }
        ]
    },
    weaponChoiceSword: {
        text: `You have chosen the ${gameState.weapon}. The weight feels unfamiliar but determined.
        The shopkeeper looks at you appreciatively. 
        "This sword will serve you well against smaller opponents, but if you are facing a bigger monster you might be in danger"`,
        choices: [
            { text: 'Leave the shop', next: 'road' }
        ]
    },
    weaponChoiceBow: {
        text: `You have chosen the ${gameState.weapon} and arrows and paid its price. It is light and feels easy to wield.
        The shopkeepers eyes you suspiciously
        "This will do you well to attack larger foes from a distance, but smaller and quicker enemies might be harder to hit"`,
        choices: [
            { text: 'Leave the shop', next: 'road' }
        ]
    },
    road: {
        text: `The village gates creak behind you as you step onto the road that leads to the forest.
        The road is well trodden, but you can easily detect the signs of monsters who recently passed there.
        A little further on the road you see a smaller less traveled path, with the footprints of monsters still fresh on it.
        When you look up the path, you see that it leads to a small hill and you see an entrance to a cave`,
        choices: [
            { text: 'Go to the cave', next: 'caveEntrance' }
        ]
    },
    caveEntrance: {
        text: 'The cave mouth looms before you, dark and foreboding. Strange sounds echo from within.',
        choices: [
            { text: 'Enter the cave', next: 'caveRoom1' }
        ]
    },
    caveRoom1: {
        text: `As you enter the cave, a giant bat swoops down screeching from the cave's ceiling trying to attack you.`,
        choices: [
            { text: 'Attack the bat', next: 'batFight' }
        ]
    },
    batFight: {
        text: '',
        action: () => {
            const attack = Math.floor(Math.random() * 100) + 1;
			// const attack = 50;
            console.log('attack result is: ' + attack);
            if (gameState.weapon === 'bow' && attack < 50) {
                return 'batMiss';
            } else {
                return 'batVictory';
            }
        }
    },
    batMiss: {
        text: `You release your arrow but the giant bat flew out of its way.
        Your attack missed, and the bat returns to charge at you.`,
        choices: [
            { text: 'Attack the bat', next: 'batFight' }
        ]
    },
    batVictory: {
        text: `The bat falls lifeless, and you notice a chest behind the bat's carcass`,
        choices: [
            { text: 'Open the Chest', next: 'chest' }
        ]
    },
    chest: {
        text: `As you open the chest you see in it several gold coins and a keychain with a few keys on it.
        You take the the gold and keys and see that the caves runs deeper into the hill.
        
        (You found 10 gold coins and a keychain)`,
        action: () => {
            gameState.items.push("Keychain");
            gameState.gold += 10;
        },
		choices: [
            { text: 'Continue down the cave', next: 'doors' }
        ]
    },
    doors: {
        text: `You continue through the cave until you find yourself in a large empty chamber with two doors. Which do you choose?`,
        action: () => {
            console.log(`weapon: ${gameState.weapon}; \n gold: ${gameState.gold}\n
            items: ${gameState.items}`);
        },
        choices: [
            { 
				text: 'Left door', 
				next: 'leftDoor'
			},
            { 
				text: 'Right door', 
				next: 'rightDoor'
			}
        ]
    },
    leftDoor: {
        text: () => {
            if (gameState.weapon === 'sword') {
                return `You encounter a massive Ogre! 
				Your sword seems insignificant compared to its stature, but you have no other choice but to fight...`;
            } else {
                return `You encounter a massive Ogre! 
				You draw your bow and shoot at it from a distance before he gets close and crushes you!`;
            }
        },
        choices: [
            { text: 'Attack!', next: 'ogreFight' }
        ]
        
    },
    rightDoor: {
        text: () => {
            if (gameState.weapon === 'sword') {
                return `A fierce orc stands before you, brandishing its weapon!, 
				Your heavy sword would help you crush him easily, you charge forward...`;
            } else {
                return `A fierce orc stands before you!
				It moves quickly towards you, will you be able to hit him with your arrows in time?`;
            }
        },
		choices: [
            { text: 'Attack!', next: 'orcFight' }
        ]
    },
    ogreFight: {
        text: '',
        action: () => {
            const attack = Math.floor(Math.random() * 100) + 1;
			// const attack = 29;
            console.log('attack result is: ' + attack);
            if ((gameState.weapon === 'bow' && attack >= 30) || 
                (gameState.weapon === 'sword' && attack > 60)) {
                return 'victory';
            }
            return 'defeat';
        }
    },
    orcFight: {
        text: '',
        action: () => {
            const attack = Math.floor(Math.random() * 100) + 1;
            // const attack = 49;
            console.log('attack result is: ' + attack);
            if ((gameState.weapon === 'bow' && attack >= 50) || 
                (gameState.weapon === 'sword' && attack > 40)) {
                return 'victory';
            }
            return 'defeat';
        }
    },
    victory: {
		text:  `Your hit was successful, you defeated your foe.
			
        Now that the threat is gone, you now see a door that was previously blocked by the monster.`,
        choices: [
            { text: 'Continue to next room', next: 'rescue' }
        ]
    },
    defeat: {
        text: `Your attack failed. The monster delivers a hit that overwhelms you. 
			Game Over.`,
        choices: [
            { text: 'Try again', next: 'intro' }
        ]
    },
    rescue: {
        text: `You find Palaiana chained in the final chamber. 
        
        With trembling hands, you break her bonds. As she embraces you with tears of relief, she whispers something urgent in your ear.`,
        choices: [
            { text: 'Listen to Palaiana', next: 'revelationScene' }
        ]
    },
    revelationScene: {
        text: `"Jordi," Palaiana whispers, her voice weak but determined. "The monsters... they work for the court wizard who betrayed Knight Contavious!"

She explains that while captive, she overheard the monsters discussing their master's plans. The knight hasn't abandoned the village—he was trapped by his trusted court wizard in a dimension between worlds where time doesn't flow.

"We must find the wizard and free the knight," she insists. "Only then will our village be truly safe."

As you help Palaiana back toward the village, she mentions rumors of the wizard's current whereabouts—an ancient structure known as the Obsidian Spire.`,
        choices: [
            { text: 'Return to the village with Palaiana', next: 'returnToVillage' }
        ]
    },
    returnToVillage: {
        text: `The villagers celebrate Palaiana's return, but the joy is tempered by the revelation about Knight Contavious's fate.

After ensuring Palaiana's safety and rest, you decide to seek out the Obsidian Spire. Several villagers know of it—a once-sacred astronomical observatory that now stands corrupted on a jagged cliff between the village and Knight Contavious's castle.

"Be careful," the village elder warns. "Strange lights have been seen there at night, and those who venture too close speak of whispers that cloud the mind."`,
        choices: [
            { text: 'Journey to the Obsidian Spire', next: 'obsidianSpireApproach' }
        ]
    },
    obsidianSpireApproach: {
        text: `After a day's journey, you stand before the Obsidian Spire. The once-pristine structure now seems twisted, its dark stone absorbing the light around it rather than reflecting it.

Ancient astronomical symbols carved into its exterior have been defaced with arcane runes that seem to shift when you don't look directly at them.

The massive doors stand slightly ajar, and an unnatural chill emanates from within.`,
        choices: [
            { text: 'Enter the Obsidian Spire', next: 'obsidianSpireInterior' }
        ]
    },
    obsidianSpireInterior: {
        text: `Inside, the air feels thick with magic. What was once a place of learning is now adorned with floating magical artifacts and pulsing crystals. Shadowy tendrils curl along the walls.

As you reach the central chamber, you find not the wizard himself, but a shadowy manifestation—a puppet made of darkness wearing a mocking smile.

"So," it hisses, "another would-be hero comes to challenge the master? How... predictable."`,
        choices: [
            { text: 'Demand information about Knight Contavious', next: 'shadowPuppetChallenge' }
        ]
    },
    shadowPuppetChallenge: {
        text: `The Shadow Puppet laughs—a sound like breaking glass.

"Information has a price, mortal. I propose a game of chance. If you win, I shall reveal how to free your precious knight."

It gestures to your gold pouch. "Most of your gold will be required to play..."

It explains that you must guess a number between 1 and 100. You'll have five attempts, with hints after each guess.`,
        action: () => {
            gameState.miniGame = new ShadowPuppetGame(gameState.gold);
            console.log(gameState.miniGame.targetNumber);
        },
        choices: [
            { text: 'Accept the challenge', next: 'miniGameStart' }
        ]
    },
    miniGameStart: {
        action: () => {
            if (!gameState.miniGame.wagerDeducted) {
                const wagerAmount = gameState.miniGame.isSecondChance ? 
                    gameState.gold : // Take all remaining gold for second chance
                    gameState.miniGame.initialWager;
                gameState.gold -= wagerAmount;
                gameState.miniGame.wagerDeducted = true;
                updateStatusPanel(); // Update the display immediately
            }
        },
        text: () => {
            const wagerText = gameState.miniGame.isSecondChance ? 
                `\nYour soul and all your remaining gold are at stake.` :
                `\nYou have wagered ${gameState.miniGame.initialWager} gold.`;

            return `The Shadow Puppet has chosen a number between 1 and 100.
            ${wagerText}
            You have ${gameState.miniGame.attemptsRemaining} attempts remaining.

Use the slider to select your guess, then click "Submit Guess".`;
        },
        choices: [
            { text: 'Submit Guess', next: 'processGuess' }
        ]
    },
    processGuess: {
        text: '',
        action: () => {
            const guess = gameState.miniGame.currentGuess;
            const result = gameState.miniGame.processGuess(guess);
            
            if (result === "correct") {
                return 'miniGameWin';
            } else if (gameState.miniGame.attemptsRemaining <= 0) {
                // Check if this is the first attempt
                if (!gameState.miniGame.isSecondChance) {
                    return 'secondChanceOffer';  // New scene for offering second chance
                } else {
                    return 'miniGameLose';
                }
            } else {
                return 'miniGameContinue';
            }
        }
    },
    miniGameContinue: {
        text: () => {
            const lastGuess = gameState.miniGame.currentGuess;
            const feedback = lastGuess < gameState.miniGame.targetNumber ? "Higher" : "Lower";
            
            return `"${feedback}," the Shadow Puppet taunts.
            
Your last guess: ${lastGuess}
Attempts remaining: ${gameState.miniGame.attemptsRemaining}

Adjust the slider to make your next guess.`;
        },
        choices: [
            { text: 'Submit Next Guess', next: 'processGuess' }
        ]
    },
    secondChanceOffer: {
        text: `"Too bad," the Shadow Puppet's eyes suddenly gleam with malevolent purpose. 
                
"But I'll offer you one final chance... for much higher stakes. Your remaining gold AND your very soul against the information you seek."

Its voice drops to a sinister whisper. "Four attempts this time. Choose wisely..."`,
        action: () => {
            gameState.miniGame.startSecondChance();
            console.log(gameState.miniGame.targetNumber);
            gameState.miniGame.wagerDeducted = false;
        },
        choices: [
            { text: 'Accept the dark bargain', next: 'miniGameStart' },
            { text: 'Try to leave', next: 'attemptToLeave' }
        ]
    },
    attemptToLeave: {
        text: `"Leave?" The Shadow Puppet's laughter echoes through the chamber, a sound like shattering glass mixed with screaming. 

"Oh, foolish mortal. Did you think you could simply walk away after starting our little game? The stakes were set the moment you accepted my challenge."

Darkness begins to coil around your legs, climbing up your body like serpents made of shadow.

"Your soul is already forfeit. The only choice was whether to risk it for a chance at victory..."

The shadows tighten their grip, and you feel your consciousness being torn away as the Shadow Puppet's final words echo in your mind:

"Next time... choose more wisely."`,
        choices: [
            { text: 'Game Over', next: 'intro' }
        ]
    },
    miniGameLose: {
        text: `"Game over," the Shadow Puppet cackles as darkness engulfs you.
                
You feel your consciousness fading, your soul being torn from your body. The last thing you hear is the clinking of gold coins and cruel laughter as everything fades to black.

Your quest ends here...`,
        choices: [
            { text: 'Game Over', next: 'intro' }
        ]
    },
    miniGameWin: {
        text: () => {
            let winnings;
            if (gameState.miniGame.isSecondChance) {
                winnings = gameState.miniGame.calculateWinnings();
                gameState.gold = winnings;
                
                return `"IMPOSSIBLE!" the Shadow Puppet shrieks, its form wavering.
                
"The number was indeed ${gameState.miniGame.targetNumber}. How could you possibly know?"

Your wagered gold multiplies ten-fold to ${winnings}!`;
            } else {
                winnings = gameState.miniGame.calculateWinnings();
                gameState.gold += winnings;
                
                return `"NO!" the Shadow Puppet recoils in shock.
                
"The number was indeed ${gameState.miniGame.targetNumber}. This was not supposed to happen!"

Your wagered gold is returned and doubled to ${winnings} gold!`;
            }
        },
        choices: [
            { text: 'Demand the promised information', next: 'shadowPuppetDefeat' }
        ]
    },
    shadowPuppetDefeat: {
        text: `The Shadow Puppet trembles with rage, but begins muttering information about Knight Contavious. 

As it speaks, something changes—its shadowy form begins to dissipate as flames erupt from within. A distant, powerful voice cuts through the chamber:

"YOU DARE BETRAY ME FOR A GAME?"

The puppet wriths in agony as blue flames consume it completely. When the fire dies down, an ominous laughter fills the chamber.

"You'll never manage to save him... soon this world shall know pain."

As silence returns, you notice the flames have left strange markings burned into the floor—ancient symbols in a language you cannot understand.`,
        choices: [
            { text: 'Examine the markings', next: 'ancientMarkings' }
        ]
    },
    ancientMarkings: {
        text: `You study the markings carefully. They seem to be instructions of some kind, but in an ancient language beyond your knowledge.

You carefully copy the symbols onto a scrap of parchment. Perhaps someone in the village might be able to translate them.

The village librarian is known for her knowledge of ancient texts, or there are rumors of a druid who lives in the forest who might understand such mystical writing.`,
        action: () => {
            gameState.items.push("Ancient Markings");
        },
        choices: [
            { text: 'Return to the village', next: 'questContinues' }
        ]
    },
    questContinues: {
        text: `You return to the village with the ancient markings, ready to continue your quest to free Knight Contavious.

The markings are your only lead—they may reveal how to break the wizard's spell and rescue the knight from his timeless prison.

Your journey is far from over, but you've taken the first step toward defeating the evil wizard and restoring peace to the kingdom of Arlomea.

[End of current content - To be continued in future updates]`,
        choices: [
            { text: 'Play Again', next: 'intro' }
        ]
    }
};

function updateStatusPanel() {
    // Update weapon display
    const weaponDisplay = document.getElementById('current-weapon');
    weaponDisplay.textContent = gameState.weapon || 'None';

    // Update gold display
    const goldDisplay = document.getElementById('current-gold');
    goldDisplay.textContent = gameState.gold;

    // Update inventory list
    const inventoryList = document.getElementById('inventory-list');
    inventoryList.innerHTML = '';
    gameState.items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        inventoryList.appendChild(li);
    });
}

function updateScene(sceneName) {
    const scene = scenes[sceneName];
    gameState.currentScene = sceneName;
  
    // Update the status panel at the beginning of the scene change
    updateStatusPanel();
  
    const storyText = document.getElementById('story-text');
    const choicesDiv = document.getElementById('choices');
    const sliderContainer = document.getElementById('slider-container');
    
    // Hide slider by default, show only when needed
    if (sliderContainer) {
        sliderContainer.style.display = 'none';
    }
  
    if (scene.action) {
      const result = scene.action();
      updateStatusPanel(); // Update status after action
      if (result) {
        updateScene(result);
        return;
      }
    }
  
    storyText.textContent = typeof scene.text === 'function' ? scene.text() : scene.text;
    choicesDiv.innerHTML = '';
    
    // Special handling for mini-game scenes that need the slider
    if (sceneName === 'miniGameStart' || sceneName === 'miniGameContinue') {
        // Create slider if it doesn't exist
        if (!document.getElementById('slider-container')) {
            const sliderContainer = document.createElement('div');
            sliderContainer.id = 'slider-container';
            sliderContainer.className = 'slider-container';
            
            const sliderLabel = document.createElement('div');
            sliderLabel.textContent = 'Select your guess (1-100):';
            sliderContainer.appendChild(sliderLabel);
            
            const sliderValueDisplay = document.createElement('div');
            sliderValueDisplay.id = 'slider-value';
            sliderValueDisplay.className = 'slider-value';
            sliderValueDisplay.textContent = gameState.miniGame.currentGuess;
            sliderContainer.appendChild(sliderValueDisplay);
            
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = 1;
            slider.max = 100;
            slider.value = gameState.miniGame.currentGuess;
            slider.id = 'guess-slider';
            slider.oninput = function() {
                gameState.miniGame.currentGuess = parseInt(this.value);
                document.getElementById('slider-value').textContent = this.value;
            };
            sliderContainer.appendChild(slider);
            
            // Insert slider before choices
            document.getElementById('game-container').insertBefore(sliderContainer, choicesDiv);
        } else {
            // Update existing slider
            document.getElementById('slider-container').style.display = 'block';
            document.getElementById('guess-slider').value = gameState.miniGame.currentGuess;
            document.getElementById('slider-value').textContent = gameState.miniGame.currentGuess;
        }
    }
  
    if (scene.choices) {
      const choices = typeof scene.choices === 'function' ? scene.choices() : scene.choices;
      choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.textContent = choice.text;
        button.onclick = () => {
          if (choice.action) {
            choice.action();
          }
          updateScene(choice.next);
        };
        choicesDiv.appendChild(button);
      });
    }
    
    console.log('current scene:' + gameState.currentScene);
}

// Start the game
updateStatusPanel(); // Initialize status panel
updateScene('intro');