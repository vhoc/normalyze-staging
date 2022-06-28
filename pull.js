import chalk from "chalk"
import fs from 'fs-extra'
import readline from 'readline'
import { exec } from 'child_process';
import { timeStamp } from "./helpers.js"

const confirm = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const pull = async ( files, databases ) => {
    console.log( chalk.yellowBright( 'WARNING: This will overwrite the staging website with the production site files and database.'  ) )
    
    confirm.question( chalk.yellow('Do you weant to proceed? y/n: '), answer => {
        if ( answer == 'y' || answer == 'yes' ) {
            const timestamp = timeStamp()

            console.log( 'Copying files from Production to Staging...' )
            exec( `cp -R ${ files.production }/* ${ files.staging }` )

            console.log( `Copy done. Cloning Production's permissions into Staging...` )
            exec( `rsync -ar ${ files.production } ${ files.staging }` )

            console.log( `File permissions applied. Backing up Production's database...` )
            exec( `mysqldump -u root ${ databases.production } > ${ databases.backupPath }_${ timestamp }.sql` )

            console.log( `Database backed up. Importing Production database into the Staging database...` )
            exec( `mysql ${ databases.staging } < ${ databases.backupPath }_${ timestamp }.sql` )

            console.log( `Production database imported into the Staging database. Updating the URL in the whole database...` )
            exec( `mysql -e "UPDATE wp_options SET option_value = replace( option_value, 'https://normalyze.ai', 'https://staging.normalyze.ai' );"` )
            exec( `mysql -e "UPDATE wp_posts SET guid = replace(guid, 'https://normalyze.ai','https://staging.normalyze.ai');"` )
            exec( `mysql -e "UPDATE wp_posts SET post_content = replace(post_content, 'https://normalyze.ai', 'https://staging.normalyze.ai');"` )
            exec( `mysql -e "UPDATE wp_postmeta SET meta_value = replace(meta_value,'https://normalyze.ai','https://staging.normalyze.ai');"` )

            console.log( chalk.bgGreenBright( `Staging environment has been updated to the latest Production state!` ) )
            process.exit()
    
        } else {
            console.log( 'Production to Staging pull cancelled.' )
            process.exit()
        }
    } )

    //
}

export default pull
