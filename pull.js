import chalk from "chalk"
import fs from 'fs-extra'
import readline from 'readline'
import { exec } from 'child_process';
import { timeStamp, osExec } from "./helpers.js"

const confirm = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const pull = async ( files, databases ) => {
    console.log( chalk.yellowBright( 'WARNING: This will overwrite the staging website with the production site files and database.'  ) )
    
    confirm.question( chalk.yellow('Do you weant to proceed? y/n: '), async answer => {
        if ( answer == 'y' || answer == 'yes' ) {
            const timestamp = timeStamp()

            try {
                console.log( 'Copying files from Production to Staging...' )
                await osExec( `cp -R ${ files.production }/* ${ files.staging }` )

                console.log( `Copy done. Cloning Production's permissions into Staging...` )
                //await osExec( `rsync -ar ${ files.production } ${ files.staging }` )
                await osExec( `find ${ files.staging } -exec chown user:httpd-group {} +` )
                await osExec( `find ${ files.staging } -type d -exec chmod -R 775 {} +` )
                await osExec( `find ${ files.staging } -type f -exec chmod -R 664 {} +` )
                await osExec( `chmod 660 ${ files.staging }/wp-config.php` )
                await osExec( `chmod 644 ${ files.staging }/.htaccess` )

                console.log( `File permissions applied. Backing up Production's database...` )
                await osExec( `mysqldump -u root ${ databases.production } > ${ databases.backupPath }_${ timestamp }.sql` )

                console.log( `Database backed up. Importing Production database into the Staging database...` )
                await osExec( `mysql ${ databases.staging } < ${ databases.backupPath }_${ timestamp }.sql` )

                console.log( `Production database imported into the Staging database. Updating the URL in the whole database...` )
                await osExec( `mysql -e "UPDATE staging.wp_options SET option_value = replace( option_value, 'https://normalyze.ai', 'https://staging.normalyze.ai' );"` )
                await osExec( `mysql -e "UPDATE staging.wp_posts SET guid = replace(guid, 'https://normalyze.ai','https://staging.normalyze.ai');"` )
                await osExec( `mysql -e "UPDATE staging.wp_posts SET post_content = replace(post_content, 'https://normalyze.ai', 'https://staging.normalyze.ai');"` )
                await osExec( `mysql -e "UPDATE staging.wp_postmeta SET meta_value = replace(meta_value,'https://normalyze.ai','https://staging.normalyze.ai');"` )

                console.log( chalk.greenBright( `Staging environment has been updated to the latest Production state!` ) )
                process.exit()
            } catch (error) {
                console.error( chalk.redBright( error ) )
            }
            
    
        } else {
            console.log( 'Production to Staging pull cancelled.' )
            process.exit()
        }
    } )

    //
}

export default pull
