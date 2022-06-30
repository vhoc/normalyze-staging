import chalk from "chalk"
import readline from 'readline'
import { timeStamp, osExec, updateWpconfig } from "./helpers.js"

const confirm = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const fakepush = async ( files, databases, url ) => {
    
    console.log( chalk.bgYellowBright.blackBright.bold( 'WARNING: This will OVERWRITE the PRODUCTION website with the staging site files and database!'  ) )
    console.log( chalk.bgYellowBright.blackBright.bold( 'WARNING: You must be CERTAIN that the site works PERFECTLY on the Staging environment before pushing changes to Production!'  ) )
    
    confirm.question( chalk.yellowBright.bold('ARE YOU SURE YOU WANT TO CONTINUE? yes/n: '), async answer => {
        if ( answer == 'yes' ) {
            const timestamp = timeStamp()

            try {
                console.log( 'Copying files from Staging to Production...' )
                await osExec( `cp -a ${ files.staging }/. ${ files.fake }` )

                console.log( `Copy done. Ensuring the proper permissions are applied...` )
                await osExec( `find ${ files.fake } -exec chown ubuntu:www-data {} +` )
                await osExec( `find ${ files.fake } -type d -exec chmod -R 775 {} +` )
                await osExec( `find ${ files.fake } -type f -exec chmod -R 664 {} +` )
                await osExec( `chmod 660 ${ files.fake }/wp-config.php` )
                await osExec( `chmod 644 ${ files.fake }/.htaccess` )

                console.log( `File permissions applied. Updating URL in the wp-config.php file...` )
                await updateWpconfig( `${ files.fake }/wp-config.php`, 'toFake' )

                console.log( `wp-config.php updated. Backing up Production's database...` )
                await osExec( `mysqldump -u root ${ databases.staging } > ${ databases.backupPath }_${ timestamp }.sql` )

                console.log( `Database backed up. Importing Staging database into the Production database...` )
                await osExec( `mysql ${ databases.fake } < ${ databases.backupPath }_${ timestamp }.sql` )

                console.log( `Staging database imported into the Production database. Updating the URL in the whole database...` )
                await osExec( `mysql -e "UPDATE ${ databases.fake }.wp_options SET option_value = replace( option_value, '${ url.staging }', '${ url.fake }' );"` )
                await osExec( `mysql -e "UPDATE ${ databases.fake }.wp_posts SET guid = replace(guid, '${ url.staging }','${ url.fake }');"` )
                await osExec( `mysql -e "UPDATE ${ databases.fake }.wp_posts SET post_content = replace(post_content, '${ url.staging }', '${ url.fake }');"` )
                await osExec( `mysql -e "UPDATE ${ databases.fake }.wp_postmeta SET meta_value = replace(meta_value,'${ url.staging }','${ url.fake }');"` )

                console.log( chalk.greenBright( `Production environment has been updated to the latest Staging state!` ) )
                process.exit()
            } catch (error) {
                console.error( chalk.redBright( error ) )
            }
            
    
        } else {
            console.log( 'Staging to Production push cancelled.' )
            process.exit()
        }
    } )

    //
}

export default fakepush
