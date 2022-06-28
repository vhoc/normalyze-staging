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

export const updateWpconfig = async ( file ) => {
    readFile( file, 'utf-8', function ( error, contents ) {
        if ( error ) {
          console.log( chalk.redBright( error ) )
          process.exit(1)
        }
      
        const replaced = contents.replace(/\'DB_NAME\', \'normalyze\'/g, `'DB_NAME', 'staging'`);
      
        writeFile( file, replaced, 'utf-8', function ( error ) {
            console.log( chalk.redBright( error ) )
        })
    })
}
