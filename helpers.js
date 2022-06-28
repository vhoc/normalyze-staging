import { exec } from 'child_process';
import util from 'node:util'

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