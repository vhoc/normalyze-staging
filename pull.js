import chalk from "chalk"
import fs from 'fs-extra'
import readline from 'readline'

const confirm = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const pull = async ( files ) => {
    console.log( chalk.yellowBright( 'WARNING: This will overwrite the staging website with the production site files and database.'  ) )
    
    confirm.question( chalk.yellow('Do you weant to proceed? y/n: '), answer => {
        if ( answer == 'y' || answer == 'yes' ) {
            console.log( 'Pulling files and database from production to staging...' )
            fs.copySync( files.production, files.staging, {
                overwrite: true
            }, error => {
                if ( error ) {
                    console.error( error )
                    return false
                } else {
                    console.log( chalk.greenBright( `All files have been copied from Production to Staging!` ) )
                    return true
                }
            } )
    
        } else {
            console.log( 'Production to Staging pull cancelled.' )
            return false
        }
    } )

    process.exit()
}

export default pull
