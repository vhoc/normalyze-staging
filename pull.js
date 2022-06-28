import chalk from "chalk"
import fs from 'fs-extra'
import readline from 'readline'
import exec from 'node:childprocess'
import { timeStamp } from "./helpers"

const confirm = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const pull = async ( files, databases ) => {
    console.log( chalk.yellowBright( 'WARNING: This will overwrite the staging website with the production site files and database.'  ) )
    
    confirm.question( chalk.yellow('Do you weant to proceed? y/n: '), answer => {
        if ( answer == 'y' || answer == 'yes' ) {
            console.log( 'Pulling files and database from production to staging...' )
            fs.copySync( files.production, files.staging, {
                overwrite: true
            }, error => {
                if ( error ) {
                    console.error( error )
                    process.exit()
                } else {
                    const timestamp = timeStamp()
                    exec.exec( `sudo mysqldump -u root ${ databases.production } > ${ databases.backupPath }_${ timestamp }` )
                    console.log( chalk.greenBright( `All files have been copied from Production to Staging!` ) )
                    process.exit()
                }
            } )
    
        } else {
            console.log( 'Production to Staging pull cancelled.' )
            process.exit()
        }
    } )

    //
}

export default pull
