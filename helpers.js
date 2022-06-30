import { exec } from 'child_process';
import util from 'node:util'
import { readFile, writeFile } from 'fs';
import chalk from 'chalk';

const execPromise = util.promisify( exec )

export const timeStamp = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day =`${date.getDate()}`.padStart(2, '0');
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return `${year}${month}${day}-${hour}${minute}${second}`
}

export const osExec = async ( command ) => {
    try {
        const { stdout, stderr } = await execPromise( command )
    } catch (error) {
        console.error( error )
        process.exit(1)
    }
}

export const updateWpconfig = async ( file, dbToReplace, dbReplacement ) => {
    readFile( file, 'utf-8', function ( error, contents ) {
        if ( error ) {
          console.log( chalk.redBright( error ) )
          process.exit(1)
        }
        
        const regex = new RegExp( `/\'DB_NAME\', \'${ dbToReplace }\'/g` )
        const replaced = contents.replace(regex, `'DB_NAME', '${ dbReplacement }'`);
      
        writeFile( file, replaced, 'utf-8', function ( error ) {
            if( error ) {
                console.log( chalk.redBright( error ) )
            }
        })
    })
}
