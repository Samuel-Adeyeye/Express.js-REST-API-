import fs, { PathLike } from 'fs'
import path from 'path'







export const createDatabase = (databaseFolder:PathLike, databaseFile:string) =>{

    if(!fs.existsSync(databaseFolder)){
        fs.mkdirSync(databaseFolder)
    }

    if(!fs.existsSync(databaseFile)){
        fs.writeFileSync(databaseFile, " ")
    }

}


export const readData = (filePath: string)=>{

    let allCollection:any[] = [];
    try {
        let data = fs.readFileSync(filePath, "utf-8");
        allCollection = JSON.parse(data);     
    } catch (parseError) {
        
        allCollection = [];
    }
    return allCollection
}

export const saveData = (filePath:string, data:any)=>{
   try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
   } catch (error) {
    return false
   } 
}