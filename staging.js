import chalk from "chalk"
//const readline = require( 'readline' )
import readline from 'readline'

const confirm = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const args = process.argv.slice(2)

if ( args[0] === 'pull' ) {
    console.log( chalk.yellowBright( 'WARNING: This will overwrite the staging website with the production site files and database.'  ) )
    
    confirm.question( chalk.yellow('Do you weant to proceed?'), answer => {
        if ( answer == 'y' || answer == 'yes' ) {
            console.log( 'Pulling files and database from production to staging...' )
        } else {
            console.log( 'Production to Staging pull cancelled.' )
        }
    } )

}

if ( args[0] === 'push' ) {
    console.log( 'pushing files to production' )
}