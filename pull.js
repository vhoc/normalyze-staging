import chalk from "chalk"
import fs from 'fs-extra'
import readline from 'readline'

const confirm = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const pull = ( files ) => {
    console.log( chalk.yellowBright( 'WARNING: This will overwrite the staging website with the production site files and database.'  ) )
    
    confirm.question( chalk.yellow('Do you weant to proceed? y/n: '), answer => {
        if ( answer == 'y' || answer == 'yes' ) {
            console.log( 'Pulling files and database from production to staging...' )
            fs.copySync( files.production, files.staging, {
                overwrite: true
            }, error => {
                if ( error ) {
                    console.error( error )
                    
                } else {
                    console.log( chalk.greenBright( `All files have been copied from Production to Staging!` ) )
                }
            } )
    
        } else {
            console.log( 'Production to Staging pull cancelled.' )
        }
    } )
}

module.exports = pull
