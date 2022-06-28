import chalk from "chalk"

const args = process.argv.slice(2)

if ( args[0] === 'pull' ) {
    console.log( chalk.yellow( 'WARNING: This will overwrite the staging website with the production site files and database.'  ) )
    if ( confirm( chalk.yellow( 'Do you want to proceed? y/n'  ) ) ) {
        console.log( 'Pulling files and database from the production site...' )
    } else {
        console.log( 'Production to Staging pull cancelled.' )
    }

}

if ( args[0] === 'push' ) {
    console.log( 'pushing files to production' )
}