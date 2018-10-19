'use strict';

var chalk = require('chalk');

var banner = `
             GGG
     GGGGG  GGGG
     GGGGG GGGG  RRRRR
       GGGGGGGRRRRRRRRRRR
    GGGGGGGRRRRRRRRGGRRRRR                                   BBB
  GGGGGGGRRRRRRRGGRRRRRRRRR                                  BBB
   GGGGRRRRRRRGGRRRRRGGRRRR    BBBBBBBBB    BBBBBBB    BBBBBBBBB   BBBBBBB
      RRRRRGGRRRRRRGGRRRRRR   BBB    BBB  BBB    BBB  BBB    BBB        BB
       RRRRRRRRRGGRRRRGGRRR   BB     BBB  BBB    BBB  BBB    BBB   BBBBBBB
         RRRRRGGRRRGGRRRRRR   BBB    BBB  BBB    BBB  BBB    BBB  BBB   BB
           RRRRRRGGRRRRGGRR    BBBBBBBBB   BBBBBBBB    BBBBBBBBB   BBBBBBB
             RRRRRRRRGGRRRR         BBB
                 RRRRRRRRRR    BBBBBBBB 
                                             BBBBBBBBBBB
             BBB                          BBBBBB      BBBBBBBB
             BBBBBBBBB                BBBBBB                BBBBBB
                   BBBBBBBBBBBBBBBBBBBBB
`;

function colorize(chars) {
	var boxes = '█'.repeat(chars.length);

	switch (chars.charAt(0)) {
		case 'B':
			return chalk.hex('#00005f')(boxes);
		case 'G':
			return chalk.hex('#005f00')(boxes);
		case 'R':
			return chalk.hex('#af0000')(boxes);
		default:
			/* Cannot happpen. */
			return chars;
	}
}

banner = banner.replace(/([BGR])\1+/g, colorize);

module.exports = banner;
